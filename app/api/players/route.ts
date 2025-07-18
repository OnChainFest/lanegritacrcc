import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("👥 === PLAYERS API CALLED ===")

  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const paymentStatus = searchParams.get("paymentStatus")
    const country = searchParams.get("country")

    console.log("🔍 Filters applied:", { paymentStatus, country })

    // Build query
    let query = supabase.from("players").select("*").order("created_at", { ascending: false })

    // Apply filters
    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus)
    }

    if (country && country !== "all") {
      query = query.eq("nationality", country)
    }

    const { data: players, error } = await query

    if (error) {
      console.error("❌ Error fetching players:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch players",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Retrieved ${players?.length || 0} players`)

    return NextResponse.json(
      {
        success: true,
        players: players || [],
        count: players?.length || 0,
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
    console.error("💥 Players API error:", error)
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
