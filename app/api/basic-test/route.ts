import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Basic test starting...")

    return NextResponse.json({
      success: true,
      message: "Basic API route works!",
      timestamp: new Date().toISOString(),
      environment: "v0",
    })
  } catch (error) {
    console.error("❌ Basic test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        stack: error?.stack,
      },
      { status: 500 },
    )
  }
}
