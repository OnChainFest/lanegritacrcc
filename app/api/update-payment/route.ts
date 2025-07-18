import { type NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { playerId, status } = await request.json()

    console.log(`💳 Updating payment status for player ${playerId} to ${status}`)

    if (!playerId || !status) {
      return NextResponse.json({ success: false, error: "Missing playerId or status" }, { status: 400 })
    }

    if (!["pending", "verified"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const supabase = getSupabase()

    // Update payment status
    const { data, error } = await supabase
      .from("players")
      .update({ payment_status: status })
      .eq("id", playerId)
      .select("id, name, email, payment_status")
      .single()

    if (error) {
      console.error("❌ Error updating payment status:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "Player not found" }, { status: 404 })
    }

    console.log(`✅ Payment status updated successfully for ${data.name}`)
    return NextResponse.json({
      success: true,
      data,
      playerName: data.name,
      message: `Payment status updated to ${status}`,
    })
  } catch (error) {
    console.error("❌ Unexpected error updating payment:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
