export async function GET(request) {
  try {
    console.log("📊 Tournament stats API called")

    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    const { data: players, error } = await supabase.from("players").select("payment_status")

    if (error) {
      console.error("❌ Stats error:", error)
      return Response.json({
        total_players: 0,
        verified_players: 0,
        pending_players: 0,
        total_revenue: 0,
      })
    }

    const total_players = players?.length || 0
    const verified_players = players?.filter((p) => p.payment_status === "verified").length || 0
    const pending_players = total_players - verified_players
    const total_revenue = verified_players * 36000 // Assuming base price

    console.log(`📊 Stats: ${total_players} total, ${verified_players} verified`)

    return Response.json({
      total_players,
      verified_players,
      pending_players,
      total_revenue,
    })
  } catch (error) {
    console.error("💥 Stats API error:", error)
    return Response.json({
      total_players: 0,
      verified_players: 0,
      pending_players: 0,
      total_revenue: 0,
    })
  }
}
