import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🏆 API Results Players: Starting request...")

    const supabase = getSupabase()
    console.log("🏆 API Results Players: Supabase client created successfully")

    const { data, error } = await supabase
      .from("players")
      .select("id, name, payment_status")
      .eq("payment_status", "verified")
      .order("name", { ascending: true })

    if (error) {
      console.error("🏆 API Results Players: Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          players: [],
          error: error.message,
          debug: "Supabase query failed",
        },
        { status: 500 },
      )
    }

    console.log(`🏆 API Results Players: Raw data from Supabase:`, data)

    const players = (data || []).map((player) => ({
      id: player.id,
      name: player.name || "Sin nombre",
      payment_status: player.payment_status,
    }))

    console.log(`🏆 API Results Players: Successfully formatted ${players.length} verified players`)

    return NextResponse.json({
      success: true,
      players,
      error: null,
      debug: `Found ${players.length} verified players`,
    })
  } catch (err) {
    console.error("🏆 API Results Players: Unexpected error:", err)
    return NextResponse.json(
      {
        success: false,
        players: [],
        error: err.message || "Server error",
        debug: "Caught exception in API route",
      },
      { status: 500 },
    )
  }
}
