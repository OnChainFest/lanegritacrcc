import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("📧 API Send Email: Enviando email de confirmación...")

    const body = await request.json()
    const { player, qrCodeUrl } = body

    if (!player || !player.email) {
      return Response.json(
        {
          success: false,
          error: "Datos del jugador requeridos",
        },
        { status: 200 },
      )
    }

    console.log(`📧 API Send Email: Enviando a ${player.email}`)
    console.log(`📧 API Send Email: QR Code URL: ${qrCodeUrl}`)

    // Simular envío de email (en producción aquí iría el servicio real como SendGrid, Resend, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("📧 API Send Email: Email enviado exitosamente (simulado)")

    return Response.json(
      {
        success: true,
        message: "Email de confirmación enviado exitosamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("📧 API Send Email: Error general:", error)
    return Response.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 200 },
    )
  }
}
