import { NextResponse } from "next/server"
import { resetSupabaseConnection } from "@/lib/supabase-server"

export async function GET() {
  return NextResponse.json({
    message: "Force refresh endpoint is working",
    timestamp: new Date().toISOString(),
    method: "GET",
  })
}

export async function POST() {
  try {
    console.log("🔄 Force refresh triggered at", new Date().toISOString())

    // Reset Supabase connection
    resetSupabaseConnection()

    // Clear any potential caches
    const response = NextResponse.json({
      success: true,
      message: "Cache cleared and connections reset",
      timestamp: new Date().toISOString(),
    })

    // Add aggressive cache-busting headers
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
    response.headers.set("CDN-Cache-Control", "no-store")

    console.log("✅ Force refresh completed successfully")
    return response
  } catch (error) {
    console.error("❌ Force refresh failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
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
