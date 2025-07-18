import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  console.log("📊 === TOURNAMENT STATS API CALLED ===")
  console.log("📅 Timestamp:", new Date().toISOString())

  try {
    const supabase = getSupabaseClient()

    // Get total players count
    const { count: totalPlayers, error: totalError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("❌ Error getting total players:", totalError)
      throw totalError
    }

    // Get verified players count
    const { count: verifiedPlayers, error: verifiedError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "verified")

    if (verifiedError) {
      console.error("❌ Error getting verified players:", verifiedError)
      throw verifiedError
    }

    // Get pending players count
    const { count: pendingPlayers, error: pendingError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending")

    if (pendingError) {
      console.error("❌ Error getting pending players:", pendingError)
      throw pendingError
    }

    // Calculate revenue (verified players * average cost)
    const averageCost = 50 // Base cost in USD
    const totalRevenue = (verifiedPlayers || 0) * averageCost

    const stats = {
      total_players: totalPlayers || 0,
      verified_players: verifiedPlayers || 0,
      pending_players: pendingPlayers || 0,
      total_revenue: totalRevenue,
      timestamp: new Date().toISOString(),
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
    console.error("💥 Error calculating tournament stats:", error)
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
