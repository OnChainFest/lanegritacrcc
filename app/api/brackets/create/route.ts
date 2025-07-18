import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🏆 API Create Bracket: Iniciando creación de bracket...")

    /* ---------- ENV-GUARD ---------- */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("🏆 API Create Bracket: Credenciales faltantes", {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
      return Response.json(
        {
          success: false,
          error: "Configuración de base de datos incompleta",
        },
        { status: 200 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("🏆 API Create Bracket: Cliente Supabase creado")

    /* ---------- BODY PARSE ---------- */
    const { bracket_name, bracket_type, max_players } = await request.json()

    if (!bracket_name || !bracket_type) {
      return Response.json(
        {
          success: false,
          error: "Nombre y tipo de bracket son requeridos",
        },
        { status: 200 },
      )
    }

    const maxPlayersCount = Number(max_players) || 16
    console.log(`🏆 API Create Bracket: Creando bracket ${bracket_name} tipo ${bracket_type}`)

    /* ---------- INSERT ---------- */
    const { data: bracket, error } = await supabase
      .from("tournament_brackets")
      .insert({
        bracket_name,
        bracket_type,
        max_players: maxPlayersCount,
        current_players: 0,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("🏆 API Create Bracket: Error Supabase:", error)

      // Handle specific table not found error
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return Response.json(
          {
            success: false,
            error: "La tabla de brackets no existe. Contacta al administrador para configurar la base de datos.",
          },
          { status: 200 },
        )
      }

      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 200 },
      )
    }

    console.log("🏆 API Create Bracket: Bracket creado exitosamente:", bracket)

    return Response.json(
      {
        success: true,
        bracket,
        message: "Bracket creado exitosamente",
      },
      { status: 200 },
    )
  } catch (err) {
    console.error("🏆 API Create Bracket – Error inesperado:", err)
    return Response.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 200 },
    )
  }
}
