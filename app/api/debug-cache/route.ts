import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🔍 Debug Cache: Starting cache analysis...")

    const supabase = getSupabase()

    // Get fresh data with timestamp
    const timestamp = new Date().toISOString()

    const { data: players, error } = await supabase
      .from("players")
      .select("id, name, email, payment_status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Debug Cache: Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp,
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

    console.log(`✅ Debug Cache: Found ${players?.length || 0} players`)

    return NextResponse.json(
      {
        success: true,
        timestamp,
        playersCount: players?.length || 0,
        samplePlayers: players?.slice(0, 3) || [],
        cacheHeaders: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("💥 Debug Cache: Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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
