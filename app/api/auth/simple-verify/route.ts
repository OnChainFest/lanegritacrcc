import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 Simple Verify: Verificando sesión...")

    const token = request.cookies.get("simple-admin-session")?.value

    if (!token) {
      console.log("🔐 Simple Verify: No hay token")
      return NextResponse.json({ success: false, error: "No hay sesión activa" }, { status: 401 })
    }

    try {
      const tokenData = JSON.parse(Buffer.from(token, "base64").toString())
      console.log("🔐 Simple Verify: Token decodificado:", tokenData)

      // Verificar que el token tenga la estructura correcta
      if (!tokenData.username || !tokenData.loginTime || tokenData.type !== "simple") {
        console.log("🔐 Simple Verify: Token inválido")
        return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
      }

      // Verificar que el usuario sea admin
      const adminUsername = process.env.ADMIN_USERNAME || "admin"
      if (tokenData.username !== adminUsername) {
        console.log("🔐 Simple Verify: Usuario no autorizado")
        return NextResponse.json({ success: false, error: "Usuario no autorizado" }, { status: 401 })
      }

      // Verificar que el token no sea muy antiguo (24 horas)
      const loginTime = new Date(tokenData.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        console.log("🔐 Simple Verify: Token expirado")
        return NextResponse.json({ success: false, error: "Sesión expirada" }, { status: 401 })
      }

      console.log("🔐 Simple Verify: Sesión válida")
      return NextResponse.json({
        success: true,
        user: {
          username: tokenData.username,
          role: "admin",
          loginTime: tokenData.loginTime,
        },
      })
    } catch (decodeError) {
      console.error("🔐 Simple Verify: Error decodificando token:", decodeError)
      return NextResponse.json({ success: false, error: "Token corrupto" }, { status: 401 })
    }
  } catch (error) {
    console.error("🔐 Simple Verify: Error general:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
