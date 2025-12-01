'use client'

import { useState } from 'react'
import { initiateStripeCheckout } from '@/lib/stripe-client'

export interface StripeCheckoutData {
  playerId: string
  playerName: string
  playerEmail: string
  nationality: 'CR' | 'INTL'
  packageSize: number
  hasScratch?: boolean
  categories?: string[]
  isEarlyBird?: boolean
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiateCheckout = async (data: StripeCheckoutData) => {
    setLoading(true)
    setError(null)

    try {
      await initiateStripeCheckout(data)
      // User will be redirected to Stripe, so we don't need to do anything else
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate checkout'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }

  return {
    initiateCheckout,
    loading,
    error,
  }
}
