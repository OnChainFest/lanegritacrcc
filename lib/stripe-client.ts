/**
 * Client-side Stripe utilities
 */

import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

/**
 * Get Stripe instance (singleton)
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
      return Promise.resolve(null)
    }

    stripePromise = loadStripe(publishableKey)
  }

  return stripePromise
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe()

  if (!stripe) {
    throw new Error('Stripe failed to load')
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    throw error
  }
}

/**
 * Create checkout session and redirect
 */
export async function initiateStripeCheckout(data: {
  playerId: string
  playerName: string
  playerEmail: string
  nationality: 'CR' | 'INTL'
  packageSize: number
  hasScratch?: boolean
  categories?: string[]
  isEarlyBird?: boolean
}): Promise<void> {
  try {
    // Create checkout session
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create checkout session')
    }

    const { sessionId, url } = await response.json()

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url
    } else {
      await redirectToCheckout(sessionId)
    }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}
