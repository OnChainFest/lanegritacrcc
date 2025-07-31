import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { playerId, amountPaid, paymentMethod, paymentNotes } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de jugador requerido",
        },
        { status: 400 },
      )
    }

    // Get player info first to determine payment status
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("name, nationality, country")
      .eq("id", playerId)
      .single()

    if (playerError) {
      console.error("Error fetching player:", playerError)
      return NextResponse.json(
        {
          success: false,
          error: "Error al obtener información del jugador",
        },
        { status: 500 },
      )
    }

    // Determine payment status based on amount paid
    // This is a simplified logic - you might want to compare with the expected amount
    const paymentStatus = amountPaid > 0 ? "verified" : "pending"

    // Update player with payment information
    const { data, error } = await supabase
      .from("players")
      .update({
        amount_paid: amountPaid,
        payment_method: paymentMethod || null,
        payment_notes: paymentNotes || null,
        payment_status: paymentStatus,
        payment_updated_at: new Date().toISOString(),
      })
      .eq("id", playerId)
      .select()

    if (error) {
      console.error("Error updating payment:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Error al actualizar el pago",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      playerName: player.name,
      message: "Pago actualizado correctamente",
    })
  } catch (error: any) {
    console.error("Payment update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error del servidor",
      },
      { status: 500 },
    )
  }
}
