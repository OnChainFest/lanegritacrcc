import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, testSupabaseConnection } from "@/lib/supabase-client"

export async function GET() {
  console.log("🔍 === DEBUG REGISTRATION API ===")

  try {
    // Test Supabase connection
    const connectionTest = await testSupabaseConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: connectionTest.error,
      })
    }

    const supabase = getSupabaseClient()

    // Get player count
    const { data: players, error: playersError } = await supabase.from("players").select("id")

    if (playersError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch players",
        details: playersError.message,
      })
    }

    // Get recent registrations
    const { data: recentPlayers, error: recentError } = await supabase
      .from("players")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch recent players",
        details: recentError.message,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalPlayers: players?.length || 0,
        recentRegistrations: recentPlayers || [],
        connectionStatus: "connected",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Debug registration error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error.message,
    })
  }
}

export async function POST(request: NextRequest) {
  console.log("🧪 === TEST REGISTRATION ===")

  try {
    const testPlayer = {
      name: `Test Player ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      nationality: "Costa Rica",
      passport: `TEST${Date.now()}`,
      league: "Test League",
      played_in_2024: false,
      gender: "M",
      country: "national",
      categories: {
        handicap: true,
        scratch: false,
        seniorM: false,
        seniorF: false,
        marathon: false,
        desperate: false,
        reenganche3: false,
        reenganche4: false,
        reenganche5: false,
        reenganche8: false,
      },
      total_cost: 50,
      currency: "USD",
      payment_status: "pending",
      created_at: new Date().toISOString(),
    }

    const supabase = getSupabaseClient()

    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([testPlayer])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: "Test registration failed",
        details: insertError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Test registration successful",
      data: insertedPlayer,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Test registration error",
      details: error.message,
    })
  }
}
