import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("👥 === PLAYERS API CALLED ===")

  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    let query = supabase.from("players").select("*").order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    if (offset) {
      query = query.range(Number.parseInt(offset), Number.parseInt(offset) + (Number.parseInt(limit) || 10) - 1)
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

    console.log(`✅ Fetched ${players?.length || 0} players`)

    return NextResponse.json({
      success: true,
      data: players || [],
      count: players?.length || 0,
    })
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
