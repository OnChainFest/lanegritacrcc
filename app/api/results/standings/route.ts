import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

/* ──────────────────────────────────────────
 *  Supabase Client Helper
 * ────────────────────────────────────────── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getSupabaseClient = () => {
  if (!supabaseUrl) return null

  // Try service key first, then anon key
  const key = supabaseServiceKey || supabaseAnonKey
  if (!key) return null

  return createClient(supabaseUrl, key)
}

/* ──────────────────────────────────────────
 *  GET  →  /api/results/standings
 * ────────────────────────────────────────── */
export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      { success: false, standings: [], error: "Configuración de base de datos incompleta" },
      { status: 500 },
    )
  }

  try {
    console.log("📊 Fetching standings...")

    // Always use manual calculation to ensure we get the most up-to-date data
    console.log("📊 Calculating standings manually...")

    // Get all player series with player info - using correct column names
    const { data: seriesData, error: seriesError } = await supabase.from("player_series").select(`
        player_id,
        game_1,
        game_2,
        game_3,
        total_score,
        players!inner(name, email)
      `)

    if (seriesError) {
      console.error("❌ Error fetching series data:", seriesError)
      return NextResponse.json({ success: false, standings: [], error: seriesError.message }, { status: 500 })
    }

    console.log("📊 Raw series data:", JSON.stringify(seriesData, null, 2))

    if (!seriesData || seriesData.length === 0) {
      console.log("📊 No series data found")
      return NextResponse.json({ success: true, standings: [] }, { status: 200 })
    }

    // Calculate standings manually
    const playerStats = new Map()

    seriesData.forEach((series) => {
      const playerId = series.player_id
      const playerName = series.players?.name || "Jugador Desconocido"
      const playerEmail = series.players?.email || ""

      // Calculate series total - prioritize total_score, fallback to sum of games
      let seriesTotal = 0
      if (series.total_score && series.total_score > 0) {
        seriesTotal = series.total_score
      } else if (series.game_1 !== null && series.game_2 !== null && series.game_3 !== null) {
        seriesTotal = (series.game_1 || 0) + (series.game_2 || 0) + (series.game_3 || 0)
      }

      console.log(`📊 Processing series for ${playerName}:`, {
        game_1: series.game_1,
        game_2: series.game_2,
        game_3: series.game_3,
        total_score: series.total_score,
        calculated_total: seriesTotal,
      })

      if (!playerStats.has(playerId)) {
        playerStats.set(playerId, {
          player_id: playerId,
          player_name: playerName,
          player_email: playerEmail,
          total_score: 0,
          series_count: 0,
          average_score: 0,
        })
      }

      const stats = playerStats.get(playerId)
      stats.total_score += seriesTotal
      stats.series_count += 1
      // Calculate average per game (3 games per series)
      stats.average_score = Math.round(stats.total_score / (stats.series_count * 3))
    })

    // Convert to array and sort
    const standings = Array.from(playerStats.values())
      .sort((a, b) => b.total_score - a.total_score)
      .map((player, index) => ({
        ...player,
        position: index + 1,
      }))

    console.log("📊 Final standings calculated:", JSON.stringify(standings, null, 2))

    return NextResponse.json({ success: true, standings }, { status: 200 })
  } catch (err) {
    console.error("❌ /api/results/standings – Unexpected error:", err)
    return NextResponse.json(
      {
        success: false,
        standings: [],
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
