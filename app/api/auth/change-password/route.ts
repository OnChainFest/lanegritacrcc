import { type NextRequest, NextResponse } from "next/server"
import { AuthWithFirstLoginService } from "@/lib/auth-with-first-login"

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json()

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Obtener token de la cookie
    const token = request.cookies.get("admin-session")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "Sesión no válida" }, { status: 401 })
    }

    const result = await AuthWithFirstLoginService.changePassword(currentPassword, newPassword, confirmPassword, token)

    if (result.success && result.newToken) {
      const response = NextResponse.json({
        success: true,
        message: "Contraseña cambiada exitosamente",
      })

      // Actualizar cookie con nuevo token
      response.cookies.set("admin-session", result.newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60,
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    console.error("Change password API error:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
