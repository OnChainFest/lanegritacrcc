import { NextResponse } from "next/server"
import { resetSupabaseConnection } from "@/lib/supabase-server"

export async function GET() {
  return NextResponse.json({
    message: "Force refresh endpoint is working",
    timestamp: new Date().toISOString(),
    method: "GET",
    note: "Use POST to trigger actual refresh",
  })
}

export async function POST() {
  try {
    console.log("🔄 Force refresh triggered at:", new Date().toISOString())

    // Reset Supabase connection
    resetSupabaseConnection()

    // Clear any potential caches
    const timestamp = Date.now()

    console.log("✅ Force refresh completed successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Cache cleared and connections reset",
        timestamp: new Date().toISOString(),
        cache_busted: timestamp,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("❌ Force refresh failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
