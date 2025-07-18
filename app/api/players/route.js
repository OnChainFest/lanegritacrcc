import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    console.log("📊 API Players: Starting request at", new Date().toISOString())

    // Get timestamp from URL to force fresh data
    const { searchParams } = new URL(request.url)
    const timestamp = searchParams.get("t") || Date.now()
    const playerId = searchParams.get("id") // For individual player lookup
    console.log("🔄 Cache-busting timestamp:", timestamp)

    // Import Supabase client
    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration error",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    let query = supabase
      .from("players")
      .select(
        "id, name, email, payment_status, created_at, phone, emergency_contact, emergency_phone, wallet_address, nationality, passport, league, played_in_2024, gender, country, categories, total_cost, currency",
      )
      .order("created_at", { ascending: false })

    // If looking for specific player
    if (playerId) {
      query = query.eq("id", playerId)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ Supabase error in /api/players:", error)
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Format data for admin UI compatibility
    const players = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? "Sin nombre",
      email: p.email ?? "Sin email",
      phone: p.phone ?? "Sin teléfono",
      emergency_contact: p.emergency_contact ?? "Sin contacto",
      emergency_phone: p.emergency_phone ?? "Sin teléfono",
      payment_status: p.payment_status ?? "pending",
      created_at: p.created_at,
      qr_validated: false,
      wallet_address: p.wallet_address ?? null,
      nationality: p.nationality,
      passport: p.passport,
      league: p.league,
      played_in_2024: p.played_in_2024,
      gender: p.gender,
      country: p.country,
      categories: p.categories,
      total_cost: p.total_cost,
      currency: p.currency,
    }))

    console.log(`📊 API Players: Successfully returned ${players.length} players at ${new Date().toISOString()}`)

    return NextResponse.json(
      {
        success: true,
        players,
        timestamp: new Date().toISOString(),
        count: players.length,
        cache_busted: timestamp,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (err) {
    console.error("❌ Unexpected error in /api/players:", err)
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${err.message}`,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    )
  }
}
