import { type NextRequest, NextResponse } from "next/server"
import { ProductionAuthService } from "@/lib/auth-production"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Verificar que el email sea del administrador
    const adminEmail = process.env.ADMIN_EMAIL
    if (email !== adminEmail) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
      })
    }

    const resetToken = await ProductionAuthService.generatePasswordResetToken(email)

    // En producción, enviar email aquí
    // await sendPasswordResetEmail(email, resetToken)

    console.log(`Password reset requested for: ${email}`)
    console.log(`Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`)

    return NextResponse.json({
      success: true,
      message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
