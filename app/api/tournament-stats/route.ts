import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  console.log("📊 === TOURNAMENT STATS API ===")

  try {
    const supabase = getSupabaseClient()

    // Get all players
    const { data: players, error: playersError } = await supabase.from("players").select("*")

    if (playersError) {
      console.error("❌ Error fetching players:", playersError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch players",
          details: playersError.message,
        },
        { status: 500 },
      )
    }

    const allPlayers = players || []

    // Calculate statistics
    const totalPlayers = allPlayers.length
    const nationalPlayers = allPlayers.filter((p) => p.country === "national").length
    const internationalPlayers = allPlayers.filter((p) => p.country === "international").length
    const maleePlayers = allPlayers.filter((p) => p.gender === "M").length
    const femalePlayers = allPlayers.filter((p) => p.gender === "F").length
    const paidPlayers = allPlayers.filter((p) => p.payment_status === "paid").length
    const pendingPlayers = allPlayers.filter((p) => p.payment_status === "pending").length

    // Calculate category statistics
    const categoryStats = {
      handicap: 0,
      scratch: 0,
      seniorM: 0,
      seniorF: 0,
      marathon: 0,
      desperate: 0,
      reenganche3: 0,
      reenganche4: 0,
      reenganche5: 0,
      reenganche8: 0,
    }

    allPlayers.forEach((player) => {
      if (player.categories) {
        Object.keys(categoryStats).forEach((category) => {
          if (player.categories[category]) {
            categoryStats[category as keyof typeof categoryStats]++
          }
        })
      }
    })

    // Calculate total revenue
    const totalRevenue = allPlayers.reduce((sum, player) => sum + (player.total_cost || 0), 0)

    const stats = {
      totalPlayers,
      nationalPlayers,
      internationalPlayers,
      maleePlayers,
      femalePlayers,
      paidPlayers,
      pendingPlayers,
      categoryStats,
      totalRevenue,
      averageCost: totalPlayers > 0 ? totalRevenue / totalPlayers : 0,
    }

    console.log("✅ Tournament stats calculated:", stats)

    return NextResponse.json({
      success: true,
      data: stats,
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
