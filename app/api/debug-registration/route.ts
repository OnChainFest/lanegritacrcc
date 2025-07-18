import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  console.log("🔍 Debug registration GET endpoint called")

  try {
    const supabase = getSupabaseClient()

    // Test basic connection
    const { data: testData, error: testError } = await supabase.from("players").select("id").limit(1)

    if (testError) {
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: testError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Debug registration endpoint working",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Server error",
      details: error.message,
    })
  }
}

export async function POST(request: NextRequest) {
  console.log("🧪 Debug registration test started")

  try {
    const supabase = getSupabaseClient()

    // Create test player data
    const testPlayer = {
      name: `Test Player ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      nationality: "Costa Rica",
      passport: `TEST${Date.now()}`,
      league: "Test League",
      played_in_2024: false,
      gender: "M",
      country: "national",
      categories: { handicap: true },
      total_cost: 50,
      currency: "USD",
      payment_status: "pending",
      created_at: new Date().toISOString(),
    }

    console.log("🧪 Inserting test player:", testPlayer.email)

    // Insert test player
    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([testPlayer])
      .select()
      .single()

    if (insertError) {
      console.error("❌ Test registration failed:", insertError)
      return NextResponse.json({
        success: false,
        error: "Test registration failed",
        details: insertError.message,
      })
    }

    console.log("✅ Test player created:", insertedPlayer.id)

    return NextResponse.json({
      success: true,
      message: "Test registration successful",
      player: {
        id: insertedPlayer.id,
        name: insertedPlayer.name,
        email: insertedPlayer.email,
      },
    })
  } catch (error: any) {
    console.error("💥 Debug registration error:", error)
    return NextResponse.json({
      success: false,
      error: "Server error",
      details: error.message,
    })
  }
}
