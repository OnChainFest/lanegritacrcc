import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET(request) {
  try {
    console.log("📈 API Tournament Stats: Starting request at", new Date().toISOString())

    // Get timestamp from URL to force fresh data
    const { searchParams } = new URL(request.url)
    const timestamp = searchParams.get("t") || Date.now()
    console.log("🔄 Stats cache-busting timestamp:", timestamp)

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
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store",
            "CDN-Cache-Control": "no-store",
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
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store",
            "CDN-Cache-Control": "no-store",
          },
        },
      )
    }

    // Calculate pending players
    const pendingPlayers = (totalPlayers || 0) - (verifiedPlayers || 0)

    // Calculate total revenue from verified players
    const { data: verifiedPlayersData, error: revenueError } = await supabase
      .from("players")
      .select("total_cost, currency")
      .eq("payment_status", "verified")

    let totalRevenue = 0
    if (!revenueError && verifiedPlayersData) {
      totalRevenue = verifiedPlayersData.reduce((sum, player) => {
        return sum + (player.total_cost || 0)
      }, 0)
    }

    const stats = {
      total_players: totalPlayers || 0,
      verified_players: verifiedPlayers || 0,
      pending_players: pendingPlayers,
      total_revenue: totalRevenue,
      last_updated: new Date().toISOString(),
      cache_busted: timestamp,
    }

    console.log("📈 API Tournament Stats: Successfully calculated stats:", stats)

    return NextResponse.json(
      {
        success: true,
        ...stats,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
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
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
        },
      },
    )
  }
}
