import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  console.log("📈 === FETCHING TOURNAMENT STATS ===")

  try {
    const supabase = getSupabaseClient()

    // Get total players count
    const { count: totalPlayers, error: countError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ Error counting players:", countError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get player count",
          details: countError.message,
        },
        { status: 500 },
      )
    }

    // Get players by nationality
    const { data: nationalityData, error: nationalityError } = await supabase.from("players").select("nationality")

    if (nationalityError) {
      console.error("❌ Error fetching nationality data:", nationalityError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get nationality data",
          details: nationalityError.message,
        },
        { status: 500 },
      )
    }

    // Count by nationality
    const nationalityStats = (nationalityData || []).reduce((acc: Record<string, number>, player) => {
      const nationality = player.nationality || "Unknown"
      acc[nationality] = (acc[nationality] || 0) + 1
      return acc
    }, {})

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentRegistrations, error: recentError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString())

    if (recentError) {
      console.error("❌ Error fetching recent registrations:", recentError)
    }

    const stats = {
      totalPlayers: totalPlayers || 0,
      nationalityBreakdown: nationalityStats,
      recentRegistrations: recentRegistrations || 0,
      lastUpdated: new Date().toISOString(),
    }

    console.log("✅ Tournament stats:", stats)

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error: any) {
    console.error("💥 Tournament stats error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
