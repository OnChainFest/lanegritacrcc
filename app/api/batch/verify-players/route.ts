import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { handleError, AuthenticationError, ValidationError } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError()
    }

    const body = await request.json()
    const { playerIds, paymentStatus = 'verified' } = body

    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      throw new ValidationError('playerIds must be a non-empty array')
    }

    if (playerIds.length > 100) {
      throw new ValidationError('Cannot update more than 100 players at once')
    }

    logger.info('Batch verifying players', {
      count: playerIds.length,
      status: paymentStatus,
    })

    const supabase = getSupabase()

    // Update all players in a single query
    const { data, error } = await supabase
      .from('players')
      .update({ payment_status: paymentStatus })
      .in('id', playerIds)
      .select()

    if (error) {
      logger.error('Batch update failed', error)
      throw error
    }

    logger.info('Batch update successful', { updatedCount: data?.length || 0 })

    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
      message: `Successfully updated ${data?.length || 0} players`,
    })
  } catch (error) {
    return handleError(error)
  }
}
