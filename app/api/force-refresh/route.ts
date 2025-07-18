import { NextResponse } from "next/server"
import { resetSupabaseConnection, getSupabase } from "@/lib/supabase-server"

export async function POST() {
  try {
    console.log("🔄 Force Refresh: Resetting all connections...")

    // Reset Supabase connection
    resetSupabaseConnection()

    // Create fresh connection
    const supabase = getSupabase()

    // Test the connection with fresh data
    const { data, error } = await supabase
      .from("players")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("❌ Force Refresh: Connection test failed:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    console.log("✅ Force Refresh: Connection refreshed successfully")

    return NextResponse.json({
      success: true,
      message: "Connection refreshed successfully",
      playersCount: data?.length || 0,
      timestamp: new Date().toISOString(),
      sampleData: data?.slice(0, 3) || [],
    })
  } catch (error) {
    console.error("❌ Force Refresh: Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
