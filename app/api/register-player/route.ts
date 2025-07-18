import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  console.log("🎯 === PLAYER REGISTRATION START ===")

  try {
    const body = await request.json()
    console.log("📝 Registration data received:", {
      name: body.name,
      email: body.email,
      nationality: body.nationality,
    })

    // Validate required fields
    const requiredFields = ["name", "email", "nationality", "passport", "league"]
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

    // Check for duplicate email
    console.log("🔍 Checking for duplicate email...")
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("id, email")
      .eq("email", body.email)
      .limit(1)

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Error checking for duplicates:", checkError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error while checking duplicates",
          details: checkError.message,
        },
        { status: 500 },
      )
    }

    if (existingPlayer && existingPlayer.length > 0) {
      console.log("⚠️ Duplicate email found:", body.email)
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered",
          duplicateType: "email",
        },
        { status: 409 },
      )
    }

    // Prepare player data using the correct database schema
    const playerData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      nationality: body.nationality.trim(),
      passport: body.passport.trim(),
      league: body.league.trim(),
      played_in_2024: Boolean(body.played_in_2024),
      gender: body.gender || "M",
      country: body.country || "national",
      categories: body.categories || {},
      total_cost: Number(body.total_cost) || 0,
      currency: body.currency || "USD",
      payment_status: body.payment_status || "pending",
      created_at: new Date().toISOString(),
    }

    console.log("💾 Inserting player data...")

    // Insert new player
    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([playerData])
      .select()
      .single()

    if (insertError) {
      console.error("❌ Insert error:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to register player",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Player registered successfully:", insertedPlayer.id)

    return NextResponse.json({
      success: true,
      message: "Player registered successfully",
      data: insertedPlayer,
    })
  } catch (error: any) {
    console.error("💥 Registration error:", error)
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

export async function GET() {
  return NextResponse.json({
    message: "Player registration endpoint",
    method: "POST",
    status: "active",
  })
}
