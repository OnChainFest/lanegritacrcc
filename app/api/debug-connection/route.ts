import { NextResponse } from "next/server"
import { getSupabase, resetSupabaseConnection } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🔍 Debug Connection: Starting diagnostic...")

    // Reset connection to force fresh connection
    resetSupabaseConnection()

    const supabase = getSupabase()

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("players")
      .select("count", { count: "exact", head: true })

    if (testError) {
      console.error("❌ Connection test failed:", testError)
      return NextResponse.json(
        {
          success: false,
          error: testError.message,
          details: testError,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Get recent data to verify freshness
    const { data: recentPlayers, error: recentError } = await supabase
      .from("players")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("❌ Recent data fetch failed:", recentError)
      return NextResponse.json(
        {
          success: false,
          error: recentError.message,
          details: recentError,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Environment info
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseVars: Object.keys(process.env).filter((k) => k.includes("SUPABASE")),
      timestamp: new Date().toISOString(),
      totalPlayers: testData,
      recentPlayersCount: recentPlayers?.length || 0,
    }

    console.log("✅ Debug Connection: All tests passed", envInfo)

    return NextResponse.json({
      success: true,
      message: "Connection working correctly",
      environment: envInfo,
      recentPlayers:
        recentPlayers?.map((p) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          created_at: p.created_at,
        })) || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Debug Connection: Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
