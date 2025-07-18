import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 Simple Verify: Verificando sesión...")

    // Obtener token de la cookie
    const token = request.cookies.get("simple-admin-session")?.value

    if (!token) {
      console.log("🔐 Simple Verify: No hay token")
      return NextResponse.json({
        valid: false,
        authenticated: false,
        error: "No token found",
      })
    }

    console.log("🔐 Simple Verify: Token encontrado")

    try {
      // Decodificar token simple
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))

      console.log("🔐 Simple Verify: Token decodificado:", decoded)

      // Verificar que el token tenga la estructura correcta
      if (!decoded.username || !decoded.loginTime) {
        console.log("🔐 Simple Verify: Token inválido - estructura incorrecta")
        return NextResponse.json({
          valid: false,
          authenticated: false,
          error: "Invalid token structure",
        })
      }

      // Verificar que no sea muy antiguo (24 horas)
      const loginTime = new Date(decoded.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        console.log("🔐 Simple Verify: Token expirado")
        return NextResponse.json({
          valid: false,
          authenticated: false,
          error: "Token expired",
        })
      }

      console.log("🔐 Simple Verify: Token válido")
      return NextResponse.json({
        valid: true,
        authenticated: true,
        user: {
          username: decoded.username,
          role: "admin",
          loginTime: decoded.loginTime,
        },
      })
    } catch (decodeError) {
      console.error("🔐 Simple Verify: Error decodificando token:", decodeError)
      return NextResponse.json({
        valid: false,
        authenticated: false,
        error: "Invalid token",
      })
    }
  } catch (error) {
    console.error("🔐 Simple Verify: Error general:", error)
    return NextResponse.json(
      {
        valid: false,
        authenticated: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
