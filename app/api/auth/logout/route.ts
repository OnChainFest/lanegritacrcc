import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 API Logout: Cerrando sesión...")

    const response = NextResponse.json(
      {
        success: true,
        message: "Sesión cerrada exitosamente",
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    )

    // Eliminar la cookie de sesión
    response.cookies.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expira inmediatamente
      path: "/",
    })

    console.log("🔐 API Logout: Cookie eliminada")

    return response
  } catch (error) {
    console.error("🔐 API Logout: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error cerrando sesión",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
