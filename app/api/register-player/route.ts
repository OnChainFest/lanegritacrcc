import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, testSupabaseConnection } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  console.log("🎯 === REGISTRATION API CALLED ===")
  console.log("🌍 Environment:", process.env.NODE_ENV)
  console.log("🔗 Request URL:", request.url)
  console.log("📅 Timestamp:", new Date().toISOString())

  try {
    // Test Supabase connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionTest.error,
        },
        { status: 500 },
      )
    }

    // Parse request body
    let playerData
    try {
      playerData = await request.json()
      console.log("📝 Registration data received:", {
        email: playerData.email,
        name: playerData.name,
        hasCategories: !!playerData.categories,
      })
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!playerData.email || !playerData.name) {
      console.error("❌ Missing required fields:", {
        email: !!playerData.email,
        name: !!playerData.name,
      })
      return NextResponse.json(
        {
          success: false,
          error: "Email and name are required",
        },
        { status: 400 },
      )
    }

    const supabase = getSupabaseClient()

    // Check for existing email
    console.log("🔍 Checking for existing email:", playerData.email)
    const { data: existingByEmail, error: emailError } = await supabase
      .from("players")
      .select("id, name, email")
      .eq("email", playerData.email)
      .maybeSingle()

    if (emailError) {
      console.error("❌ Error checking existing email:", emailError)
      return NextResponse.json(
        {
          success: false,
          error: "Database query failed",
          details: emailError.message,
        },
        { status: 500 },
      )
    }

    if (existingByEmail) {
      console.log("⚠️ Duplicate email found:", playerData.email)
      return NextResponse.json(
        {
          success: false,
          error: `Ya existe un jugador registrado con el email: ${playerData.email}`,
          duplicateType: "email",
          existingPlayer: {
            name: existingByEmail.name,
            email: existingByEmail.email,
          },
        },
        { status: 409 },
      )
    }

    // Check for existing passport/cedula if provided
    if (playerData.passport) {
      console.log("🔍 Checking for existing passport:", playerData.passport)
      const { data: existingByPassport, error: passportError } = await supabase
        .from("players")
        .select("id, name, passport")
        .eq("passport", playerData.passport)
        .maybeSingle()

      if (passportError) {
        console.error("❌ Error checking existing passport:", passportError)
        return NextResponse.json(
          {
            success: false,
            error: "Database query failed",
            details: passportError.message,
          },
          { status: 500 },
        )
      }

      if (existingByPassport) {
        console.log("⚠️ Duplicate passport found:", playerData.passport)
        return NextResponse.json(
          {
            success: false,
            error: `Ya existe un jugador registrado con el pasaporte/cédula: ${playerData.passport}`,
            duplicateType: "passport",
            existingPlayer: {
              name: existingByPassport.name,
              passport: existingByPassport.passport,
            },
          },
          { status: 409 },
        )
      }
    }

    // Prepare data for insertion
    const insertData = {
      ...playerData,
      created_at: new Date().toISOString(),
      payment_status: "pending",
      qr_validated: false,
    }

    console.log("💾 Inserting player data...")
    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([insertData])
      .select()
      .single()

    if (insertError) {
      console.error("❌ Error inserting player:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to register player",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Player registered successfully:", {
      id: insertedPlayer.id,
      email: insertedPlayer.email,
      name: insertedPlayer.name,
    })

    // Try to send confirmation email (non-blocking)
    try {
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-confirmation-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: insertedPlayer.id,
          playerName: insertedPlayer.name,
          playerEmail: insertedPlayer.email,
        }),
      })

      if (emailResponse.ok) {
        console.log("📧 Confirmation email sent successfully")
      } else {
        console.warn("⚠️ Failed to send confirmation email, but registration succeeded")
      }
    } catch (emailError) {
      console.warn("⚠️ Email service error (non-critical):", emailError)
    }

    return NextResponse.json(
      {
        success: true,
        data: insertedPlayer,
        message: "Player registered successfully!",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("💥 Unexpected error in registration:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// Add GET method for testing
export async function GET() {
  console.log("🔍 Registration API health check")

  try {
    const connectionTest = await testSupabaseConnection()
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabase: connectionTest.success ? "connected" : "failed",
      error: connectionTest.success ? null : connectionTest.error,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
