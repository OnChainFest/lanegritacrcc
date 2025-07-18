import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("👥 Players API called")

  try {
    const supabase = getSupabaseClient()

    // Get all players
    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })

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

    console.log(`✅ Fetched ${players?.length || 0} players`)

    return NextResponse.json({
      success: true,
      players: players || [],
      count: players?.length || 0,
    })
  } catch (error: any) {
    console.error("💥 Players API error:", error)
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
