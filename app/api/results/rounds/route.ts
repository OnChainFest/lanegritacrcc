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

const mapRound = (r: any) => ({
  id: r.id,
  name: r.round_name, // UI expects `name`
  date: r.start_date, // UI expects `date`
  round_number: r.round_number,
  status: r.is_active ? "active" : "inactive",
})

/* ──────────────────────────────────────────
 *  GET  →  /api/results/rounds
 * ────────────────────────────────────────── */
export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      { success: false, rounds: [], error: "Configuración de base de datos incompleta" },
      { status: 500 },
    )
  }

  try {
    const { data, error } = await supabase
      .from("tournament_rounds")
      .select("*")
      .order("round_number", { ascending: true })

    if (error) {
      console.error("❌ /api/results/rounds – Supabase error:", error)
      return NextResponse.json({ success: false, rounds: [], error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, rounds: (data ?? []).map(mapRound) }, { status: 200 })
  } catch (err) {
    console.error("❌ /api/results/rounds – Unexpected:", err)
    return NextResponse.json({ success: false, rounds: [], error: "Error interno del servidor" }, { status: 500 })
  }
}

/* ──────────────────────────────────────────
 *  POST  →  /api/results/rounds
 * ────────────────────────────────────────── */
export async function POST(request: Request) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ success: false, error: "Configuración de base de datos incompleta" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, date } = body

    if (!name?.trim() || !date?.trim()) {
      return NextResponse.json({ success: false, error: "Nombre y fecha son requeridos" }, { status: 400 })
    }

    // Get the next round number
    const { data: lastRound, error: lastRoundError } = await supabase
      .from("tournament_rounds")
      .select("round_number")
      .order("round_number", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastRoundError && lastRoundError.code !== "PGRST116") {
      console.error("❌ Error getting last round:", lastRoundError)
      return NextResponse.json({ success: false, error: lastRoundError.message }, { status: 500 })
    }

    const nextRoundNumber = (lastRound?.round_number || 0) + 1

    const { data, error } = await supabase
      .from("tournament_rounds")
      .insert({
        round_name: name.trim(),
        start_date: date.trim(),
        round_number: nextRoundNumber,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ /api/results/rounds POST – Supabase error:", error)

      // Provide more specific error messages
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Ya existe una ronda con ese nombre o número",
          },
          { status: 400 },
        )
      }

      if (error.code === "42501") {
        return NextResponse.json(
          {
            success: false,
            error: "Permisos insuficientes para crear rondas. Verifica la configuración de la base de datos.",
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: `Error de base de datos: ${error.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, round: mapRound(data) }, { status: 201 })
  } catch (err) {
    console.error("❌ /api/results/rounds POST – Unexpected:", err)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
