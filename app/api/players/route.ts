import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("👥 === PLAYERS API CALLED ===")
  console.log("🌍 Environment:", process.env.NODE_ENV)
  console.log("📅 Timestamp:", new Date().toISOString())

  try {
    const supabase = getSupabaseClient()

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const paymentStatus = searchParams.get("paymentStatus")
    const country = searchParams.get("country")

    console.log("🔍 Query filters:", { paymentStatus, country })

    // Build query
    let query = supabase.from("players").select("*").order("created_at", { ascending: false })

    // Apply filters
    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus)
    }

    if (country && country !== "all") {
      query = query.eq("country", country)
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

    console.log("✅ Players fetched successfully:", {
      count: players?.length || 0,
      filters: { paymentStatus, country },
    })

    return NextResponse.json(
      {
        success: true,
        players: players || [],
        count: players?.length || 0,
        timestamp: new Date().toISOString(),
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
    console.error("💥 Unexpected error fetching players:", error)
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
