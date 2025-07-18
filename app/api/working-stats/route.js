export async function GET() {
  try {
    // Importación relativa
    const { supabase } = await import("../../../lib/supabase.js")

    const { data: players, error } = await supabase.from("players").select("payment_status, country, categories")

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
          step: "query_failed",
        },
        { status: 500 },
      )
    }

    const stats = {
      total: players?.length || 0,
      verified: players?.filter((p) => p.payment_status === "verified").length || 0,
      pending: players?.filter((p) => p.payment_status === "pending").length || 0,
      national: players?.filter((p) => p.country === "national").length || 0,
      international: players?.filter((p) => p.country === "international").length || 0,
    }

    return Response.json({
      success: true,
      data: stats,
      message: "Tournament stats retrieved successfully!",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        step: "unexpected_error",
      },
      { status: 500 },
    )
  }
}
