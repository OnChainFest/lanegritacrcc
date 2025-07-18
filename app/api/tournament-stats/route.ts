import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("📊 Tournament stats API called")

  try {
    const supabase = getSupabaseClient()

    // Get all players to calculate stats
    const { data: players, error } = await supabase.from("players").select("*")

    if (error) {
      console.error("❌ Error fetching players for stats:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch tournament stats",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Calculate stats
    const totalPlayers = players?.length || 0
    const verifiedPlayers = players?.filter((p) => p.payment_status === "verified").length || 0
    const pendingPlayers = players?.filter((p) => p.payment_status === "pending").length || 0
    const totalRevenue = players?.reduce((sum, p) => sum + (p.total_cost || 0), 0) || 0

    const stats = {
      total_players: totalPlayers,
      verified_players: verifiedPlayers,
      pending_players: pendingPlayers,
      total_revenue: totalRevenue,
    }

    console.log("📊 Tournament stats calculated:", stats)

    return NextResponse.json({
      success: true,
      ...stats,
    })
  } catch (error: any) {
    console.error("💥 Tournament stats error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
