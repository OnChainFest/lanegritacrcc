import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Simple Login: Iniciando proceso...")

    const body = await request.json()
    const { username } = body

    console.log("🔐 Simple Login: Username recibido:", username)

    if (!username) {
      return NextResponse.json({ success: false, error: "Username es requerido" }, { status: 400 })
    }

    // Verificación simple - solo username "admin"
    if (username.toLowerCase() !== "admin") {
      return NextResponse.json({ success: false, error: "Usuario incorrecto" }, { status: 401 })
    }

    console.log("🔐 Simple Login: Credenciales válidas")

    // Crear token simple
    const tokenData = {
      username: username,
      loginTime: new Date().toISOString(),
      type: "simple",
    }

    const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")

    // Crear respuesta exitosa
    const response = NextResponse.json({
      success: true,
      user: {
        username: username,
        role: "admin",
        loginTime: tokenData.loginTime,
      },
      message: "Login exitoso",
    })

    // Configurar cookie
    response.cookies.set("simple-admin-session", token, {
      httpOnly: true,
      secure: false, // Para desarrollo
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
    })

    console.log("🔐 Simple Login: Login exitoso, cookie configurada")
    return response
  } catch (error) {
    console.error("🔐 Simple Login: Error general:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
