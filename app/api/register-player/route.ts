import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  console.log("🎳 === PLAYER REGISTRATION API CALLED ===")
  console.log("📅 Timestamp:", new Date().toISOString())

  try {
    const body = await request.json()
    console.log("📝 Registration data received:", {
      name: body.name,
      email: body.email,
      phone: body.phone,
      nationality: body.nationality,
    })

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "nationality"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 },
      )
    }

    const supabase = getSupabaseClient()

    // Check for existing email
    console.log("🔍 Checking for existing email...")
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("id, email")
      .eq("email", body.email)
      .limit(1)

    if (checkError) {
      console.error("❌ Error checking existing email:", checkError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error while checking email",
          details: checkError.message,
        },
        { status: 500 },
      )
    }

    if (existingPlayer && existingPlayer.length > 0) {
      console.log("⚠️ Email already exists:", body.email)
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered",
          message: "Este email ya está registrado en el torneo",
        },
        { status: 409 },
      )
    }

    // Prepare player data
    const playerData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      nationality: body.nationality.trim(),
      average_score: Number.parseInt(body.average_score) || 0,
      payment_status: "pending",
      created_at: new Date().toISOString(),
    }

    console.log("💾 Inserting player data:", playerData)

    // Insert new player
    const { data: newPlayer, error: insertError } = await supabase.from("players").insert([playerData]).select()

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

    console.log("✅ Player registered successfully:", newPlayer)

    return NextResponse.json(
      {
        success: true,
        message: "Player registered successfully",
        player: newPlayer[0],
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("💥 Registration API error:", error)
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
