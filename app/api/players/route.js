export async function GET(request) {
  try {
    console.log("🔍 Players API called at:", new Date().toISOString())

    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials")
      return Response.json(
        {
          success: false,
          error: "Missing database configuration",
          players: [],
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    console.log("📡 Fetching players from database...")

    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Database error:", error)
      return Response.json(
        {
          success: false,
          error: error.message,
          players: [],
        },
        { status: 500 },
      )
    }

    console.log(`✅ Found ${players?.length || 0} players`)

    return Response.json(
      {
        success: true,
        players: players || [],
        count: players?.length || 0,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("💥 Unexpected error in players API:", error)
    return Response.json(
      {
        success: false,
        error: "Internal server error",
        players: [],
      },
      { status: 500 },
    )
  }
}
