export async function GET() {
  try {
    // Prueba muy básica sin importaciones
    return Response.json({
      success: true,
      message: "Simple stats API works",
      data: {
        total: 0,
        verified: 0,
        pending: 0,
      },
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        step: "basic_test",
      },
      { status: 500 },
    )
  }
}
