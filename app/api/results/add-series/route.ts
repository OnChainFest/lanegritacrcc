import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
 *  POST  →  /api/results/add-series
 * ────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Configuración de base de datos incompleta para operaciones de escritura" },
      { status: 500 },
    )
  }

  try {
    const body = await request.json()
    const { player_id, round_id, game1, game2, game3 } = body

    console.log("🎯 Adding series request:", { player_id, round_id, game1, game2, game3 })

    // Validate required fields
    if (!player_id || !round_id || game1 === undefined || game2 === undefined || game3 === undefined) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos: player_id, round_id, game1, game2, game3" },
        { status: 400 },
      )
    }

    // Validate score ranges
    const scores = [Number(game1), Number(game2), Number(game3)]
    if (scores.some((s) => isNaN(s) || s < 0 || s > 300)) {
      return NextResponse.json(
        { success: false, error: "Los puntajes deben ser números entre 0 y 300" },
        { status: 400 },
      )
    }

    // Check if player exists
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id, name")
      .eq("id", player_id)
      .single()

    if (playerError || !player) {
      console.error("❌ Player not found:", playerError)
      return NextResponse.json({ success: false, error: "Jugador no encontrado" }, { status: 404 })
    }

    // Check if round exists
    const { data: round, error: roundError } = await supabase
      .from("tournament_rounds")
      .select("id, round_name")
      .eq("id", round_id)
      .single()

    if (roundError || !round) {
      console.error("❌ Round not found:", roundError)
      return NextResponse.json({ success: false, error: "Ronda no encontrada" }, { status: 404 })
    }

    // Check for duplicate series (same player + round)
    const { data: dup, error: duplicateError } = await supabase
      .from("player_series")
      .select("id")
      .eq("player_id", player_id)
      .eq("round_id", round_id)

    if (duplicateError) {
      console.error("❌ Error checking for duplicates:", duplicateError)
      return NextResponse.json({ success: false, error: "Error verificando series existentes" }, { status: 500 })
    }

    if (dup && dup.length > 0) {
      return NextResponse.json(
        { success: false, error: `Ya existe una serie para ${player.name} en ${round.round_name}` },
        { status: 409 },
      )
    }

    // Insert the new series - let the database calculate total_score
    const insertData = {
      player_id,
      round_id,
      game_1: scores[0],
      game_2: scores[1],
      game_3: scores[2],
      created_at: new Date().toISOString(),
    }

    console.log("🎯 Inserting series data:", insertData)

    const { data: inserted, error } = await supabase
      .from("player_series")
      .insert(insertData)
      .select("id, player_id, round_id, game_1, game_2, game_3, total_score, created_at")
      .single()

    if (error) {
      console.error("❌ Error inserting series:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ Series inserted successfully:", inserted)

    return NextResponse.json(
      {
        success: true,
        message: "Serie agregada exitosamente",
        series: inserted,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error("❌ /api/results/add-series – Unexpected error:", err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
