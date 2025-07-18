export async function GET() {
  try {
    // Usar importación relativa en lugar de @/
    const { supabase } = await import("../../../lib/supabase.js")

    return Response.json({
      success: true,
      message: "Relative import works!",
      hasSupabase: !!supabase,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        step: "relative_import_failed",
      },
      { status: 500 },
    )
  }
}
