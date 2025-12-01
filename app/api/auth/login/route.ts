import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`login:${clientIp}`, RATE_LIMITS.AUTH_LOGIN)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
          },
        },
      )
    }

    console.log("🔐 API Login: Iniciando proceso de login...")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("🔐 API Login: Error parsing JSON:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const { username, password } = body

    console.log("🔐 API Login: Datos recibidos:")
    console.log("- Username:", username)
    console.log("- Password:", password)
    console.log("- Expected username:", ADMIN_USERNAME)
    console.log("- Expected password:", ADMIN_PASSWORD)

    if (!username || !password) {
      console.log("🔐 API Login: Faltan credenciales")
      return NextResponse.json(
        {
          success: false,
          error: "Usuario y contraseña son requeridos",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Verificar credenciales simples
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      console.log("🔐 API Login: Credenciales incorrectas")
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales inválidas",
        },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("🔐 API Login: Credenciales válidas")

    // Obtener información del cliente
    const ip =
      request.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const userAgent = request.headers.get("user-agent") || "unknown"

    // Crear token JWT
    const user = {
      id: "admin-001",
      username,
      role: "admin",
      loginTime: new Date().toISOString(),
      ip,
      userAgent,
    }

    let token
    try {
      token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          ip: user.ip,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      )
      console.log("🔐 API Login: Token generado exitosamente")
    } catch (jwtError) {
      console.error("🔐 API Login: Error generando JWT:", jwtError)
      return NextResponse.json(
        {
          success: false,
          error: "Error generando token de sesión",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Crear respuesta con cookie segura
    const response = NextResponse.json(
      {
        success: true,
        user,
        message: "Login exitoso",
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    )

    // Configurar cookie con el token
    response.cookies.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 horas en segundos
      path: "/",
    })

    console.log("🔐 API Login: Cookie configurada")
    console.log("🔐 API Login: Login exitoso para usuario:", username)

    return response
  } catch (error) {
    console.error("🔐 API Login: Error general:", error)
    console.error("🔐 API Login: Error stack:", error.stack)

    // Asegurar que siempre devolvemos JSON válido
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
