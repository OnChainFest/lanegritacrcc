export async function GET() {
  try {
    // Importación dinámica para evitar problemas
    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    const { data, error } = await supabase.from("tournaments").select("*").limit(1)

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

    return Response.json({
      success: true,
      message: "Supabase connection works!",
      data: data,
      count: data?.length || 0,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        step: "import_or_setup_failed",
      },
      { status: 500 },
    )
  }
}
