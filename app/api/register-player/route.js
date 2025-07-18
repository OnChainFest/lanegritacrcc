export async function POST(request) {
  try {
    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    const playerData = await request.json()

    console.log("🎯 Registration attempt for:", playerData.email)

    // Verificar si ya existe un jugador con el mismo email
    const { data: existingByEmail, error: emailError } = await supabase
      .from("players")
      .select("id, name, email")
      .eq("email", playerData.email)
      .single()

    if (emailError && emailError.code !== "PGRST116") {
      console.error("❌ Error checking email:", emailError)
      return Response.json(
        {
          success: false,
          error: "Error verificando email existente",
        },
        { status: 500 },
      )
    }

    if (existingByEmail) {
      console.log("⚠️ Duplicate email attempt:", playerData.email)
      return Response.json(
        {
          success: false,
          error: `Ya existe un jugador registrado con el email: ${playerData.email}`,
          duplicateType: "email",
          existingPlayer: {
            name: existingByEmail.name,
            email: existingByEmail.email,
          },
        },
        { status: 409 }, // 409 Conflict
      )
    }

    // Verificar si ya existe un jugador con el mismo pasaporte/cédula si se proporciona
    if (playerData.passport) {
      const { data: existingByPassport, error: passportError } = await supabase
        .from("players")
        .select("id, name, passport")
        .eq("passport", playerData.passport)
        .single()

      if (passportError && passportError.code !== "PGRST116") {
        console.error("❌ Error checking passport:", passportError)
        return Response.json(
          {
            success: false,
            error: "Error verificando pasaporte/cédula existente",
          },
          { status: 500 },
        )
      }

      if (existingByPassport) {
        console.log("⚠️ Duplicate passport attempt:", playerData.passport)
        return Response.json(
          {
            success: false,
            error: `Ya existe un jugador registrado con el pasaporte/cédula: ${playerData.passport}`,
            duplicateType: "passport",
            existingPlayer: {
              name: existingByPassport.name,
              passport: existingByPassport.passport,
            },
          },
          { status: 409 }, // 409 Conflict
        )
      }
    }

    // Si no hay duplicados, proceder con el registro
    const { data, error } = await supabase.from("players").insert([playerData]).select().single()

    if (error) {
      console.error("❌ Error inserting player:", error)
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    console.log("✅ Player registered successfully:", data.id)
    return Response.json(
      {
        success: true,
        data,
        message: "Player registered successfully!",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Unexpected error in registration:", error)
    return Response.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
