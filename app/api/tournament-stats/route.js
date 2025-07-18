import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    console.log("📈 API Tournament Stats: Starting request at", new Date().toISOString())

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
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    // Get all players to calculate stats
    const { data: players, error } = await supabase.from("players").select("payment_status, total_cost, currency")

    if (error) {
      console.error("❌ Supabase error in tournament stats:", error)
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${error.message}`,
        },
        { status: 500 },
      )
    }

    const totalPlayers = players?.length || 0
    const verifiedPlayers = players?.filter((p) => p.payment_status === "verified").length || 0
    const pendingPlayers = totalPlayers - verifiedPlayers

    // Calculate total revenue (only from verified players)
    const totalRevenue =
      players
        ?.filter((p) => p.payment_status === "verified")
        .reduce((sum, p) => {
          // Convert USD to CRC for unified calculation (approximate rate: 1 USD = 500 CRC)
          const amount = p.currency === "USD" ? (p.total_cost || 0) * 500 : p.total_cost || 0
          return sum + amount
        }, 0) || 0

    const stats = {
      total_players: totalPlayers,
      verified_players: verifiedPlayers,
      pending_players: pendingPlayers,
      total_revenue: totalRevenue,
    }

    console.log("📈 Tournament stats calculated:", stats)

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (err) {
    console.error("❌ Unexpected error in tournament stats:", err)
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${err.message}`,
      },
      { status: 500 },
    )
  }
}
