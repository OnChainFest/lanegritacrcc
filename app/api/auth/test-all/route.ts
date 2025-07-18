import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tests = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      apis: {
        login: "Available",
        enhancedLogin: "Available",
        verify: "Available",
        changePassword: "Available",
      },
      credentials: {
        defaultUsername: "admin",
        defaultPassword: "TorneoLaNegrita2025!",
        hasJWTSecret: !!process.env.JWT_SECRET,
        hasAdminUsername: !!process.env.ADMIN_USERNAME,
      },
      routes: {
        "/login": "Should exist",
        "/enhanced-login": "Should exist",
        "/admin": "Should exist (protected)",
        "/api/auth/login": "Should exist",
        "/api/auth/enhanced-login": "Should exist",
      },
    }

    return NextResponse.json({
      success: true,
      message: "Auth system diagnostic",
      data: tests,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
