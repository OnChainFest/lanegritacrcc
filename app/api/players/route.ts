import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  console.log("👥 === FETCHING PLAYERS ===")

  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = getSupabaseClient()

    console.log(`📊 Fetching players (limit: ${limit}, offset: ${offset})`)

    const {
      data: players,
      error,
      count,
    } = await supabase
      .from("players")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

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

    console.log(`✅ Fetched ${players?.length || 0} players (total: ${count})`)

    return NextResponse.json({
      success: true,
      players: players || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error("💥 Players fetch error:", error)
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
