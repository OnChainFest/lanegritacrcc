import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Simple Login: Iniciando proceso...")

    const body = await request.json()
    const { username, password } = body

    console.log("🔐 Simple Login: Username recibido:", username)
    console.log("🔐 Simple Login: Password recibido:", password ? "***" : "no password")

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username y password son requeridos" }, { status: 400 })
    }

    // Verificación con las credenciales exactas del environment
    const adminUsername = process.env.ADMIN_USERNAME || "admin"
    const adminPassword = process.env.ADMIN_PASSWORD || "supersecreto"

    console.log("🔐 Simple Login: Comparando con admin username:", adminUsername)
    console.log("🔐 Simple Login: Admin password configurado:", adminPassword ? "SI" : "NO")

    // Verificación exacta de credenciales
    if (username !== adminUsername || password !== adminPassword) {
      console.log("🔐 Simple Login: Credenciales incorrectas")
      console.log("🔐 Simple Login: Username match:", username === adminUsername)
      console.log("🔐 Simple Login: Password match:", password === adminPassword)
      return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
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
