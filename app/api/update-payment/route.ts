import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { playerId, status } = await request.json()
    console.log(`💳 Updating payment for player ${playerId} to ${status}`)

    if (!playerId || !status) {
      return NextResponse.json({ success: false, error: "Missing playerId or status" }, { status: 400 })
    }

    const supabase = getSupabase()

    // First get the player name for the response
    const { data: player, error: fetchError } = await supabase
      .from("players")
      .select("name")
      .eq("id", playerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching player:", fetchError)
      return NextResponse.json({ success: false, error: "Player not found" }, { status: 404 })
    }

    // Update the payment status
    const { error: updateError } = await supabase.from("players").update({ payment_status: status }).eq("id", playerId)

    if (updateError) {
      console.error("❌ Error updating payment status:", updateError)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    console.log(`✅ Payment status updated successfully for ${player.name}`)

    return NextResponse.json(
      {
        success: true,
        message: `Payment status updated to ${status}`,
        playerName: player.name,
        playerId,
        status,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("💥 Error in update-payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
