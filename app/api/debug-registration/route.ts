import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, testSupabaseConnection } from "@/lib/supabase-client"

export async function GET() {
  console.log("🔧 === REGISTRATION DEBUG ===")

  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
    },
    connection: null as any,
    tableAccess: null as any,
    sampleData: null as any,
  }

  try {
    // Test connection
    const connectionTest = await testSupabaseConnection()
    debug.connection = connectionTest

    if (connectionTest.success) {
      const supabase = getSupabaseClient()

      // Test table access
      try {
        const { data: tableTest, error: tableError } = await supabase
          .from("players")
          .select("id, name, email, created_at")
          .limit(3)
          .order("created_at", { ascending: false })

        if (tableError) {
          debug.tableAccess = { success: false, error: tableError.message }
        } else {
          debug.tableAccess = {
            success: true,
            count: tableTest?.length || 0,
            hasData: (tableTest?.length || 0) > 0,
          }
          debug.sampleData = tableTest?.map((p) => ({
            id: p.id.substring(0, 8) + "...",
            name: p.name,
            email: p.email.replace(/(.{3}).*(@.*)/, "$1***$2"),
            created_at: p.created_at,
          }))
        }
      } catch (tableError: any) {
        debug.tableAccess = { success: false, error: tableError.message }
      }
    }

    return NextResponse.json(debug)
  } catch (error: any) {
    debug.connection = { success: false, error: error.message }
    return NextResponse.json(debug, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("🧪 === TESTING REGISTRATION FLOW ===")

  try {
    const testData = {
      name: `Test User ${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      nationality: "Costa Rica",
      passport: `TEST-${Date.now()}`,
      league: "Test League",
      played_in_2024: false,
      gender: "M" as const,
      country: "national" as const,
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
      payment_status: "pending" as const,
    }

    console.log("🧪 Creating test registration with data:", {
      email: testData.email,
      name: testData.name,
    })

    const supabase = getSupabaseClient()

    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([testData])
      .select()
      .single()

    if (insertError) {
      console.error("❌ Test registration failed:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Test registration failed",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Test registration successful:", insertedPlayer.id)

    // Clean up test data
    await supabase.from("players").delete().eq("id", insertedPlayer.id)

    return NextResponse.json({
      success: true,
      message: "Test registration completed successfully",
      testPlayer: {
        id: insertedPlayer.id,
        email: insertedPlayer.email,
        name: insertedPlayer.name,
      },
    })
  } catch (error: any) {
    console.error("💥 Test registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
