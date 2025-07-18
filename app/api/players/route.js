import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("📊 API Players: Starting request at", new Date().toISOString())
    const supabase = getSupabase()

    // Add timestamp to force fresh data
    const { data, error } = await supabase
      .from("players")
      .select("id, name, email, payment_status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase error in /api/players:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    // Format data for admin UI compatibility
    const players = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? "Sin nombre",
      email: p.email ?? "Sin email",
      phone: null, // Column doesn't exist yet
      emergency_contact: null, // Column doesn't exist yet
      emergency_phone: null, // Column doesn't exist yet
      payment_status: p.payment_status ?? "pending",
      created_at: p.created_at,
      qr_validated: false, // QR functionality removed
      wallet_address: null, // Optional field
    }))

    console.log(`📊 API Players: Successfully returned ${players.length} players at ${new Date().toISOString()}`)

    return NextResponse.json(
      {
        success: true,
        players,
        timestamp: new Date().toISOString(),
        count: players.length,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (err) {
    console.error("❌ Unexpected error in /api/players:", err)
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
