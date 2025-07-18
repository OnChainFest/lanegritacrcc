import { type NextRequest, NextResponse } from "next/server"
import { AuthWithFirstLoginService } from "@/lib/auth-with-first-login"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const ip = request.ip || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    const result = await AuthWithFirstLoginService.login(username, password, ip, userAgent)

    if (result.success && result.token) {
      const response = NextResponse.json({
        success: true,
        user: result.user,
        mustChangePassword: result.mustChangePassword,
        message: result.mustChangePassword ? "Debe cambiar su contraseña por defecto" : "Login successful",
      })

      response.cookies.set("admin-session", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60,
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 401 })
  } catch (error) {
    console.error("Enhanced login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
