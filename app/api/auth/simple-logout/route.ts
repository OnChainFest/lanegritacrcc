import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Simple Logout: Cerrando sesión...")

    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    })

    // Eliminar la cookie de sesión
    response.cookies.set("simple-admin-session", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0, // Expira inmediatamente
      path: "/",
    })

    console.log("🔐 Simple Logout: Cookie eliminada")
    return response
  } catch (error) {
    console.error("🔐 Simple Logout: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error cerrando sesión",
      },
      { status: 500 },
    )
  }
}
