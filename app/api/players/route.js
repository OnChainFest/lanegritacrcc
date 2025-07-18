import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET(request) {
  try {
    console.log("📊 API Players: Starting request at", new Date().toISOString())

    // Get timestamp from URL to force fresh data
    const { searchParams } = new URL(request.url)
    const timestamp = searchParams.get("t") || Date.now()
    console.log("🔄 Cache-busting timestamp:", timestamp)

    const supabase = getSupabase()

    // Force fresh data with no caching
    const { data, error } = await supabase
      .from("players")
      .select("id, name, email, payment_status, created_at, phone, emergency_contact, emergency_phone, wallet_address")
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
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store",
            "CDN-Cache-Control": "no-store",
          },
        },
      )
    }

    // Format data for admin UI compatibility
    const players = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? "Sin nombre",
      email: p.email ?? "Sin email",
      phone: p.phone ?? "Sin teléfono",
      emergency_contact: p.emergency_contact ?? "Sin contacto",
      emergency_phone: p.emergency_phone ?? "Sin teléfono",
      payment_status: p.payment_status ?? "pending",
      created_at: p.created_at,
      qr_validated: false,
      wallet_address: p.wallet_address ?? null,
    }))

    console.log(`📊 API Players: Successfully returned ${players.length} players at ${new Date().toISOString()}`)

    return NextResponse.json(
      {
        success: true,
        players,
        timestamp: new Date().toISOString(),
        count: players.length,
        cache_busted: timestamp,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
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
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
        },
      },
    )
  }
}