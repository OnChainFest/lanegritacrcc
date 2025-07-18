import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  console.log("📊 === TOURNAMENT STATS API CALLED ===")

  try {
    const supabase = getSupabaseClient()

    // Get all players to calculate stats manually
    const { data: allPlayers, error: playersError } = await supabase
      .from("players")
      .select("id, nationality, payment_status, created_at")

    if (playersError) {
      console.error("❌ Error fetching players for stats:", playersError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch tournament stats",
          details: playersError.message,
        },
        { status: 500 },
      )
    }

    const players = allPlayers || []

    // Calculate stats manually
    const totalPlayers = players.length
    const verifiedPlayers = players.filter((p) => p.payment_status === "verified").length
    const pendingPlayers = players.filter((p) => p.payment_status === "pending").length

    // Calculate nationality breakdown
    const nationalityStats = players.reduce((acc: Record<string, number>, player) => {
      const nationality = player.nationality || "Unknown"
      acc[nationality] = (acc[nationality] || 0) + 1
      return acc
    }, {})

    // Calculate recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentRegistrations = players.filter((player) => {
      if (!player.created_at) return false
      const createdDate = new Date(player.created_at)
      return createdDate >= sevenDaysAgo
    }).length

    const stats = {
      total_players: totalPlayers,
      verified_players: verifiedPlayers,
      pending_players: pendingPlayers,
      nationality_breakdown: nationalityStats,
      recent_registrations: recentRegistrations,
      last_updated: new Date().toISOString(),
    }

    console.log("✅ Tournament stats calculated:", stats)

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
  } catch (error: any) {
    console.error("💥 Tournament stats error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate tournament stats",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
