import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 API Verify: Iniciando verificación...")

    // Obtener token de la cookie
    const token = request.cookies.get("admin-session")?.value

    if (!token) {
      console.log("🔐 API Verify: No hay token en cookies")
      return NextResponse.json(
        {
          valid: false,
          authenticated: false,
          error: "No token found",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("🔐 API Verify: Token encontrado, verificando...")

    try {
      // Verificar token JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any

      console.log("🔐 API Verify: Token válido para usuario:", decoded.username)

      return NextResponse.json(
        {
          valid: true,
          authenticated: true,
          user: {
            id: decoded.userId,
            username: decoded.username,
            role: decoded.role,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    } catch (jwtError) {
      console.error("🔐 API Verify: Error JWT:", jwtError)

      if (jwtError instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          {
            valid: false,
            authenticated: false,
            error: "Token expired",
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      if (jwtError instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          {
            valid: false,
            authenticated: false,
            error: "Invalid token",
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      return NextResponse.json(
        {
          valid: false,
          authenticated: false,
          error: "Token verification failed",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("🔐 API Verify: Error general:", error)
    console.error("🔐 API Verify: Error stack:", error.stack)

    // Asegurar que siempre devolvemos JSON válido
    return NextResponse.json(
      {
        valid: false,
        authenticated: false,
        error: "Internal server error",
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
