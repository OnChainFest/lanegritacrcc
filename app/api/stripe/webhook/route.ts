import { NextRequest, NextResponse } from 'next/server'
import { stripe, verifyWebhookSignature } from '@/lib/stripe-config'
import { getSupabase } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'

// Disable body parser for webhook
export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Stripe Webhook Handler
 * Handles payment events from Stripe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      logger.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (err) {
      logger.error('Webhook signature verification failed', err as Error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    logger.info('Stripe webhook received', {
      type: event.type,
      id: event.id,
    })

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        logger.info('Unhandled webhook event type', { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error', error as Error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const playerId = session.client_reference_id
    const metadata = session.metadata

    if (!playerId) {
      logger.error('Missing playerId in checkout session', { sessionId: session.id })
      return
    }

    logger.info('Processing successful checkout', {
      sessionId: session.id,
      playerId,
      amountTotal: session.amount_total,
    })

    const supabase = getSupabase()

    // Update player payment status
    const { error: updateError } = await supabase
      .from('players')
      .update({
        payment_status: 'verified',
        amount_paid: session.amount_total ? session.amount_total / 100 : 0,
        currency: 'USD',
        payment_method: 'stripe',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        verified_at: new Date().toISOString(),
      })
      .eq('id', playerId)

    if (updateError) {
      logger.error('Failed to update player payment status', updateError)
      throw updateError
    }

    // Log payment event
    logger.payment('payment_completed', playerId, session.amount_total ? session.amount_total / 100 : 0, 'USD')

    // TODO: Send confirmation email
    logger.info('Payment processed successfully', {
      playerId,
      sessionId: session.id,
    })
  } catch (error) {
    logger.error('Error handling checkout completed', error as Error)
    throw error
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  logger.info('Payment intent succeeded', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
  })

  // Additional handling if needed
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  logger.warn('Payment intent failed', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
  })

  // TODO: Notify admin or player about failed payment
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  logger.info('Charge refunded', {
    id: charge.id,
    amount: charge.amount,
  })

  // TODO: Update player payment status to reflect refund
  const supabase = getSupabase()

  // Find player by stripe payment intent
  const { data: players, error } = await supabase
    .from('players')
    .select('id')
    .eq('stripe_payment_intent', charge.payment_intent)
    .limit(1)

  if (error || !players || players.length === 0) {
    logger.error('Failed to find player for refunded charge', { chargeId: charge.id })
    return
  }

  const playerId = players[0].id

  // Update payment status
  await supabase
    .from('players')
    .update({
      payment_status: 'refunded',
      refunded_at: new Date().toISOString(),
    })
    .eq('id', playerId)

  logger.info('Player payment status updated to refunded', { playerId })
}
