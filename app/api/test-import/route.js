export async function GET() {
  try {
    // Probar solo la importación de Supabase
    const { supabase } = await import("@/lib/supabase.js")

    return Response.json({
      success: true,
      message: "Import works",
      hasSupabase: !!supabase,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        step: "import_failed",
      },
      { status: 500 },
    )
  }
}
