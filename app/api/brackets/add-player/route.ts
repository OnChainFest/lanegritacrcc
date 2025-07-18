import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getSupabaseClient = () => {
  if (!supabaseUrl) return null
  const key = supabaseServiceKey || supabaseAnonKey
  if (!key) return null
  return createClient(supabaseUrl, key)
}

export async function POST(request: NextRequest) {
  try {
    console.log("🏆 API Add Player to Bracket: Iniciando proceso...")

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error("🏆 API Add Player to Bracket: No se pudo crear cliente Supabase")
      return Response.json(
        {
          success: false,
          error: "Configuración del servidor incompleta",
        },
        { status: 500 },
      )
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("🏆 API Add Player to Bracket: Error parseando JSON:", parseError)
      return Response.json(
        {
          success: false,
          error: "Formato de datos inválido",
        },
        { status: 400 },
      )
    }

    const { bracket_id, player_id } = body

    if (!bracket_id || !player_id) {
      console.error("🏆 API Add Player to Bracket: Parámetros faltantes:", { bracket_id, player_id })
      return Response.json(
        {
          success: false,
          error: "bracket_id y player_id son requeridos",
        },
        { status: 400 },
      )
    }

    console.log(`🏆 API Add Player to Bracket: Agregando jugador ${player_id} al bracket ${bracket_id}`)

    // Verificar que el bracket existe
    const { data: bracket, error: bracketError } = await supabase
      .from("tournament_brackets")
      .select("*")
      .eq("id", bracket_id)
      .maybeSingle()

    if (bracketError) {
      console.error("🏆 API Add Player to Bracket: Error consultando bracket:", bracketError)
      return Response.json(
        {
          success: false,
          error: "Error consultando bracket: " + bracketError.message,
        },
        { status: 500 },
      )
    }

    if (!bracket) {
      console.error("🏆 API Add Player to Bracket: Bracket no encontrado")
      return Response.json(
        {
          success: false,
          error: "Bracket no encontrado",
        },
        { status: 404 },
      )
    }

    // Verificar que el bracket tiene espacio
    if (bracket.current_players >= bracket.max_players) {
      console.error("🏆 API Add Player to Bracket: Bracket lleno")
      return Response.json(
        {
          success: false,
          error: "El bracket está lleno",
        },
        { status: 400 },
      )
    }

    // Verificar que el jugador existe y está verificado
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id, name, payment_status")
      .eq("id", player_id)
      .eq("payment_status", "verified")
      .maybeSingle()

    if (playerError) {
      console.error("🏆 API Add Player to Bracket: Error consultando jugador:", playerError)
      return Response.json(
        {
          success: false,
          error: "Error consultando jugador: " + playerError.message,
        },
        { status: 500 },
      )
    }

    if (!player) {
      console.error("🏆 API Add Player to Bracket: Jugador no encontrado o no verificado")
      return Response.json(
        {
          success: false,
          error: "Jugador no encontrado o no está verificado",
        },
        { status: 404 },
      )
    }

    // Verificar que el jugador no esté ya en el bracket
    const { data: existingPlayer, error: checkError } = await supabase
      .from("bracket_players")
      .select("*")
      .eq("bracket_id", bracket_id)
      .eq("player_id", player_id)
      .maybeSingle()

    if (checkError) {
      console.error("🏆 API Add Player to Bracket: Error verificando jugador existente:", checkError)
      return Response.json(
        {
          success: false,
          error: "Error verificando jugador: " + checkError.message,
        },
        { status: 500 },
      )
    }

    if (existingPlayer) {
      console.error("🏆 API Add Player to Bracket: Jugador ya existe en bracket")
      return Response.json(
        {
          success: false,
          error: "El jugador ya está en este bracket",
        },
        { status: 400 },
      )
    }

    // Agregar jugador al bracket
    const { error: insertError } = await supabase.from("bracket_players").insert({
      bracket_id: bracket_id,
      player_id: player_id,
      joined_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("🏆 API Add Player to Bracket: Error agregando jugador:", insertError)
      return Response.json(
        {
          success: false,
          error: "Error agregando jugador: " + insertError.message,
        },
        { status: 500 },
      )
    }

    // Actualizar contador de jugadores en el bracket
    const { error: updateError } = await supabase
      .from("tournament_brackets")
      .update({ current_players: bracket.current_players + 1 })
      .eq("id", bracket_id)

    if (updateError) {
      console.error("🏆 API Add Player to Bracket: Error actualizando contador:", updateError)
      // No retornamos error aquí porque el jugador ya fue agregado
    }

    console.log("🏆 API Add Player to Bracket: Jugador agregado exitosamente")

    return Response.json(
      {
        success: true,
        message: "Jugador agregado al bracket exitosamente",
        data: {
          bracket_name: bracket.bracket_name,
          player_name: player.name,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("🏆 API Add Player to Bracket: Error general:", error)
    return Response.json(
      {
        success: false,
        error: "Error interno del servidor: " + (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 },
    )
  }
}
