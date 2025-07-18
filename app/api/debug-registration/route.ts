import { NextResponse } from "next/server"
import { getSupabaseClient, getSupabaseConfig } from "@/lib/supabase-client"

export async function GET() {
  console.log("🔧 === DEBUG REGISTRATION API CALLED ===")
  console.log("📅 Timestamp:", new Date().toISOString())

  try {
    // Check environment variables
    const config = getSupabaseConfig()
    console.log("🔧 Supabase config:", {
      hasUrl: config.hasUrl,
      hasKey: config.hasKey,
      urlPreview: config.url ? `${config.url.substring(0, 30)}...` : "missing",
    })

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      supabase: {
        url: config.hasUrl,
        key: config.hasKey,
        urlValue: config.url || "missing",
      },
      connection: null as any,
      tableAccess: null as any,
      sampleData: [] as any[],
    }

    // Test basic connection
    try {
      const supabase = getSupabaseClient()
      console.log("🔧 Testing basic connection...")

      // Simple query to test connection
      const { data: testData, error: testError } = await supabase.from("players").select("id").limit(1)

      if (testError) {
        console.error("❌ Connection test failed:", testError)
        debugInfo.connection = {
          success: false,
          error: testError.message,
        }
      } else {
        console.log("✅ Connection test successful")
        debugInfo.connection = {
          success: true,
          data: testData,
        }
      }
    } catch (connectionError: any) {
      console.error("💥 Connection error:", connectionError)
      debugInfo.connection = {
        success: false,
        error: connectionError.message,
      }
    }

    // Test table access and get count
    if (debugInfo.connection?.success) {
      try {
        const supabase = getSupabaseClient()
        console.log("🔧 Testing table access...")

        // Get all players to count them manually (avoiding count syntax issues)
        const { data: allPlayers, error: playersError } = await supabase
          .from("players")
          .select("id, name, email, created_at")
          .order("created_at", { ascending: false })

        if (playersError) {
          console.error("❌ Table access failed:", playersError)
          debugInfo.tableAccess = {
            success: false,
            error: playersError.message,
          }
        } else {
          console.log("✅ Table access successful")
          debugInfo.tableAccess = {
            success: true,
            count: allPlayers?.length || 0,
            hasData: (allPlayers?.length || 0) > 0,
          }

          // Get sample data (last 5 records)
          debugInfo.sampleData = allPlayers?.slice(0, 5) || []
        }
      } catch (tableError: any) {
        console.error("💥 Table access error:", tableError)
        debugInfo.tableAccess = {
          success: false,
          error: tableError.message,
        }
      }
    }

    console.log("🔧 Debug info compiled:", debugInfo)

    return NextResponse.json(debugInfo, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error: any) {
    console.error("💥 Debug API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Debug API failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  console.log("🧪 === TEST REGISTRATION API CALLED ===")

  try {
    const supabase = getSupabaseClient()

    // Create test player data
    const testPlayer = {
      name: `Test Player ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      phone: "+1234567890",
      nationality: "Test Country",
      average_score: 150,
      payment_status: "pending",
      created_at: new Date().toISOString(),
    }

    console.log("🧪 Attempting to register test player:", testPlayer)

    const { data, error } = await supabase.from("players").insert([testPlayer]).select()

    if (error) {
      console.error("❌ Test registration failed:", error)
      return NextResponse.json({
        success: false,
        error: "Test registration failed",
        details: error.message,
      })
    }

    console.log("✅ Test registration successful:", data)

    return NextResponse.json({
      success: true,
      message: "Test registration completed successfully",
      data: data,
    })
  } catch (error: any) {
    console.error("💥 Test registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test registration failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
