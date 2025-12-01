import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG, calculateStripeAmount, createProductDescription } from '@/lib/stripe-config'
import { logger } from '@/lib/logger'
import { handleError, ValidationError } from '@/lib/error-handler'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`stripe-checkout:${clientIp}`, RATE_LIMITS.REGISTRATION)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many checkout attempts. Please try again later.',
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      playerId,
      playerName,
      playerEmail,
      nationality,
      packageSize,
      hasScratch = false,
      categories = [],
      isEarlyBird = false,
    } = body

    // Validate required fields
    if (!playerId || !playerName || !playerEmail || !nationality || !packageSize) {
      throw new ValidationError('Missing required fields')
    }

    // Validate nationality
    if (nationality !== 'CR' && nationality !== 'INTL') {
      throw new ValidationError('Invalid nationality')
    }

    // Validate package size
    const validSizes = nationality === 'CR' ? [3, 4] : [3, 5, 8]
    if (!validSizes.includes(packageSize)) {
      throw new ValidationError(`Invalid package size for ${nationality} nationality`)
    }

    logger.info('Creating Stripe checkout session', {
      playerId,
      nationality,
      packageSize,
      hasScratch,
    })

    // Calculate amount
    const amount = calculateStripeAmount({
      nationality,
      packageSize,
      hasScratch,
      isEarlyBird,
    })

    // Create product description
    const description = createProductDescription({
      playerName,
      nationality,
      packageSize,
      hasScratch,
      categories,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: `Torneo La Negrita 2025 - ${playerName}`,
              description,
              images: [
                process.env.NEXT_PUBLIC_URL
                  ? `${process.env.NEXT_PUBLIC_URL}/images/logo-192.png`
                  : 'https://lanegritacrcc.vercel.app/images/logo-192.png',
              ],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      customer_email: playerEmail,
      client_reference_id: playerId,
      metadata: {
        playerId,
        playerName,
        nationality,
        packageSize: packageSize.toString(),
        hasScratch: hasScratch.toString(),
        categories: categories.join(','),
        isEarlyBird: isEarlyBird.toString(),
      },
    })

    logger.info('Stripe checkout session created', {
      sessionId: session.id,
      playerId,
      amount,
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    logger.error('Failed to create Stripe checkout session', error as Error)
    return handleError(error)
  }
}
