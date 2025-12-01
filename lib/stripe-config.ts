/**
 * Stripe configuration and utilities
 */

import Stripe from 'stripe'

// Initialize Stripe with API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is required in production')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd', // Default currency
  successUrl: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/payment/success`
    : 'http://localhost:3000/payment/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/payment/cancel`
    : 'http://localhost:3000/payment/cancel',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
}

// Product prices in cents (USD)
export const STRIPE_PRICES = {
  // National (CR) packages - converted to USD
  CR: {
    package3: {
      early: 12500, // $125
      regular: 13500, // $135
    },
    package4: {
      early: 14000, // $140
      regular: 15000, // $150
    },
  },
  // International packages
  INTL: {
    package3: {
      early: 12200, // $122
      regular: 13200, // $132
    },
    package5: {
      early: 15300, // $153
      regular: 16300, // $163
    },
    package8: {
      early: 20100, // $201
      regular: 21000, // $210
    },
  },
  // Add-ons
  scratch: 2200, // $22
}

/**
 * Calculate price in cents based on player data
 */
export function calculateStripeAmount(data: {
  nationality: 'CR' | 'INTL'
  packageSize: 3 | 4 | 5 | 8
  hasScratch: boolean
  isEarlyBird: boolean
}): number {
  const { nationality, packageSize, hasScratch, isEarlyBird } = data

  let basePrice = 0

  if (nationality === 'CR') {
    if (packageSize === 3) {
      basePrice = isEarlyBird
        ? STRIPE_PRICES.CR.package3.early
        : STRIPE_PRICES.CR.package3.regular
    } else if (packageSize === 4) {
      basePrice = isEarlyBird
        ? STRIPE_PRICES.CR.package4.early
        : STRIPE_PRICES.CR.package4.regular
    }
  } else {
    if (packageSize === 3) {
      basePrice = isEarlyBird
        ? STRIPE_PRICES.INTL.package3.early
        : STRIPE_PRICES.INTL.package3.regular
    } else if (packageSize === 5) {
      basePrice = isEarlyBird
        ? STRIPE_PRICES.INTL.package5.early
        : STRIPE_PRICES.INTL.package5.regular
    } else if (packageSize === 8) {
      basePrice = isEarlyBird
        ? STRIPE_PRICES.INTL.package8.early
        : STRIPE_PRICES.INTL.package8.regular
    }
  }

  if (hasScratch) {
    basePrice += STRIPE_PRICES.scratch
  }

  return basePrice
}

/**
 * Create product description for Stripe
 */
export function createProductDescription(data: {
  playerName: string
  nationality: 'CR' | 'INTL'
  packageSize: number
  hasScratch: boolean
  categories: string[]
}): string {
  const { playerName, nationality, packageSize, hasScratch, categories } = data

  const parts = [
    `Registro: ${playerName}`,
    `Paquete: ${packageSize} ${packageSize === 1 ? 'juego' : 'juegos'}`,
    nationality === 'CR' ? 'Nacional' : 'Internacional',
  ]

  if (hasScratch) {
    parts.push('+ Scratch')
  }

  if (categories.length > 0) {
    parts.push(`Categorías: ${categories.join(', ')}`)
  }

  return parts.join(' | ')
}

/**
 * Format amount from cents to dollars
 */
export function formatStripeAmount(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!STRIPE_CONFIG.webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.webhookSecret
  )
}
