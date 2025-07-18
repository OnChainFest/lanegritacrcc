import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("📈 API Tournament Stats: Starting request at", new Date().toISOString())
    const supabase = getSupabase()

    // Get total players count with fresh data
    const { count: totalPlayers, error: countError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ Error getting total players:", countError)
      return NextResponse.json(
        {
          success: false,
          error: countError.message,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    // Get verified players count
    const { count: verifiedPlayers, error: verifiedError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "verified")

    if (verifiedError) {
      console.error("❌ Error getting verified players:", verifiedError)
      return NextResponse.json(
        {
          success: false,
          error: verifiedError.message,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    // Calculate pending players
    const pendingPlayers = (totalPlayers || 0) - (verifiedPlayers || 0)

    // Calculate total revenue (assuming $50 per verified player)
    const totalRevenue = (verifiedPlayers || 0) * 50000 // 50,000 CRC per player

    const stats = {
      total_players: totalPlayers || 0,
      verified_players: verifiedPlayers || 0,
      pending_players: pendingPlayers,
      total_revenue: totalRevenue,
      last_updated: new Date().toISOString(),
    }

    console.log("📈 API Tournament Stats: Successfully calculated stats:", stats)

    return NextResponse.json(
      {
        success: true,
        ...stats,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (err) {
    console.error("❌ Unexpected error in tournament stats:", err)
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
