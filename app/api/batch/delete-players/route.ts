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
    const { playerIds } = body

    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      throw new ValidationError('playerIds must be a non-empty array')
    }

    if (playerIds.length > 50) {
      throw new ValidationError('Cannot delete more than 50 players at once')
    }

    logger.info('Batch deleting players', { count: playerIds.length })

    const supabase = getSupabase()

    // Delete all players in a single query
    const { data, error } = await supabase
      .from('players')
      .delete()
      .in('id', playerIds)
      .select()

    if (error) {
      logger.error('Batch delete failed', error)
      throw error
    }

    logger.info('Batch delete successful', { deletedCount: data?.length || 0 })

    return NextResponse.json({
      success: true,
      deletedCount: data?.length || 0,
      message: `Successfully deleted ${data?.length || 0} players`,
    })
  } catch (error) {
    return handleError(error)
  }
}
