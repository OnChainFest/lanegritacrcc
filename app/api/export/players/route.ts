import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase-server'
import { arrayToCSV, PLAYER_EXPORT_COLUMNS } from '@/lib/export-utils'
import { logger } from '@/lib/logger'
import { handleError, AuthenticationError } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header')
    }

    logger.info('Exporting players data')

    const supabase = getSupabase()

    // Get all players
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Failed to fetch players for export', error)
      throw error
    }

    logger.info('Players fetched for export', { count: players?.length || 0 })

    // Convert to CSV
    const csv = arrayToCSV(players || [], PLAYER_EXPORT_COLUMNS)

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="jugadores_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
