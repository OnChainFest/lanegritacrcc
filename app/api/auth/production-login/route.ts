import { type NextRequest, NextResponse } from "next/server"
import { ProductionAuthService } from "@/lib/auth-production"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Obtener información del cliente
    const ip =
      request.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const userAgent = request.headers.get("user-agent") || "unknown"

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    const result = await ProductionAuthService.login(username, password, ip, userAgent)

    if (result.success && result.token) {
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: "Login successful",
      })

      // Establecer cookie segura
      response.cookies.set("admin-session", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 horas
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
