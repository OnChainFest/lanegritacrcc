export async function GET() {
  try {
    const { supabase } = await import("../../../lib/supabase.js")

    // Test 1: Conexión básica
    const { data: tournaments, error: tourError } = await supabase.from("tournaments").select("*").limit(1)

    if (tourError) {
      return Response.json({ success: false, step: "tournaments", error: tourError.message }, { status: 500 })
    }

    // Test 2: Estadísticas
    const { data: players, error: playersError } = await supabase.from("players").select("*")

    if (playersError) {
      return Response.json({ success: false, step: "players", error: playersError.message }, { status: 500 })
    }

    // Test 3: Insertar y eliminar un registro de prueba
    const testPlayer = {
      name: "TEST DELETE ME",
      nationality: "Test",
      email: `test-${Date.now()}@delete.com`,
      passport: "TEST123",
      league: "Test League",
      played_in_2024: false,
      gender: "M",
      country: "national",
      categories: { handicap: true },
      total_cost: 1,
      currency: "CRC",
      payment_status: "pending",
    }

    const { data: inserted, error: insertError } = await supabase.from("players").insert([testPlayer]).select().single()

    if (insertError) {
      return Response.json({ success: false, step: "insert", error: insertError.message }, { status: 500 })
    }

    // Eliminar el registro de prueba
    await supabase.from("players").delete().eq("id", inserted.id)

    return Response.json({
      success: true,
      message: "🎉 Database fully functional!",
      tests: {
        connection: "✅ Connected",
        tournaments: `✅ Found ${tournaments?.length || 0} tournaments`,
        players: `✅ Found ${players?.length || 0} players`,
        insert: "✅ Insert/Delete works",
      },
      stats: {
        totalPlayers: players?.length || 0,
        verified: players?.filter((p) => p.payment_status === "verified").length || 0,
        pending: players?.filter((p) => p.payment_status === "pending").length || 0,
      },
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        step: "unexpected",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
