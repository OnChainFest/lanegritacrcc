import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase-server'
import { arrayToCSV, RESULTS_EXPORT_COLUMNS } from '@/lib/export-utils'
import { logger } from '@/lib/logger'
import { handleError, AuthenticationError } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header')
    }

    logger.info('Exporting results data')

    const supabase = getSupabase()

    // Get all series with player names
    const { data: results, error } = await supabase
      .from('player_series')
      .select(`
        *,
        players (name)
      `)
      .order('round_number', { ascending: true })

    if (error) {
      logger.error('Failed to fetch results for export', error)
      throw error
    }

    // Format data for export
    const formattedResults = results?.map(result => ({
      player_name: (result.players as unknown as { name: string })?.name || 'Unknown',
      round_number: result.round_number,
      game_1: result.game_1,
      game_2: result.game_2,
      game_3: result.game_3,
      total_score: result.total_score,
      created_at: result.created_at,
    })) || []

    logger.info('Results fetched for export', { count: formattedResults.length })

    // Convert to CSV
    const csv = arrayToCSV(formattedResults, RESULTS_EXPORT_COLUMNS)

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="resultados_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
