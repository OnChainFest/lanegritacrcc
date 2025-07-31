import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest) {
  console.log("📊 Tournament Stats API called")

  try {
    console.log("🔄 Fetching tournament stats...")

    // Get all players
    const { data: players, error: playersError } = await supabase.from("players").select("*")

    if (playersError) {
      console.error("❌ Error fetching players:", playersError)
      return NextResponse.json(
        {
          success: false,
          error: playersError.message,
        },
        { status: 500 },
      )
    }

    // Calculate stats
    const totalPlayers = players?.length || 0
    let verifiedPlayers = 0
    let pendingPlayers = 0
    let totalRevenueUSD = 0

    console.log(`📊 Processing ${totalPlayers} players...`)

    players?.forEach((player) => {
      // Count verified vs pending players
      if (player.payment_status === "verified") {
        verifiedPlayers++
      } else {
        pendingPlayers++
      }

      // Calculate revenue - count all payments with amount > 0
      // All amounts are already in USD
      const amountPaid = player.amount_paid || 0
      if (amountPaid > 0) {
        console.log(`💰 Player ${player.name}: $${amountPaid} USD (Status: ${player.payment_status})`)
        totalRevenueUSD += amountPaid
      }
    })

    console.log(`📊 Final Stats:`)
    console.log(`   - Total players: ${totalPlayers}`)
    console.log(`   - Verified: ${verifiedPlayers}`)
    console.log(`   - Pending: ${pendingPlayers}`)
    console.log(`   - Total revenue in USD: $${totalRevenueUSD.toLocaleString()}`)

    return NextResponse.json({
      success: true,
      total_players: totalPlayers,
      verified_players: verifiedPlayers,
      pending_players: pendingPlayers,
      total_revenue: totalRevenueUSD,
    })
  } catch (error: any) {
    console.error("💥 Tournament Stats API error:", error)
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
