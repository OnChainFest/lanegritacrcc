import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getSupabaseClient = () => {
  if (!supabaseUrl) return null
  const key = supabaseServiceKey || supabaseAnonKey
  if (!key) return null
  return createClient(supabaseUrl, key)
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      { success: false, participants: [], error: "Configuración de base de datos incompleta" },
      { status: 500 },
    )
  }

  try {
    const bracketId = params.id
    console.log("🏆 Fetching participants for bracket:", bracketId)

    // Get bracket participants
    const { data: bracketPlayers, error: bracketError } = await supabase
      .from("bracket_players")
      .select("player_id, position, status")
      .eq("bracket_id", bracketId)

    if (bracketError) {
      console.error("❌ Error fetching bracket players:", bracketError)
      return NextResponse.json({ success: false, participants: [], error: bracketError.message }, { status: 500 })
    }

    if (!bracketPlayers || bracketPlayers.length === 0) {
      console.log("📊 No participants found for bracket:", bracketId)
      return NextResponse.json({ success: true, participants: [] }, { status: 200 })
    }

    // Get player details
    const playerIds = bracketPlayers.map((bp) => bp.player_id)
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, email")
      .in("id", playerIds)

    if (playersError) {
      console.error("❌ Error fetching players:", playersError)
      return NextResponse.json({ success: false, participants: [], error: playersError.message }, { status: 500 })
    }

    // Merge bracket data with player data
    const participants = bracketPlayers.map((bp) => {
      const player = players?.find((p) => p.id === bp.player_id)
      return {
        player_id: bp.player_id,
        player_name: player?.name || "Jugador Desconocido",
        player_email: player?.email || "",
        position: bp.position,
        status: bp.status,
      }
    })

    console.log("🏆 Participants found:", participants.length)

    return NextResponse.json({ success: true, participants }, { status: 200 })
  } catch (err) {
    console.error("❌ participantes – Unexpected error:", err)
    return NextResponse.json(
      {
        success: false,
        participants: [],
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
