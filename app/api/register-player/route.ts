import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  console.log("🎯 === PLAYER REGISTRATION START ===")

  try {
    const body = await request.json()
    console.log("📝 Registration data received:", {
      name: body.name,
      email: body.email,
      nationality: body.nationality,
      categories: body.categories,
      extras: body.extras,
      total_cost: body.total_cost,
    })

    // Validate required fields
    const requiredFields = ["name", "email", "nationality", "passport", "league", "gender"]
    const missingFields = requiredFields.filter((field) => !body[field] || body[field].toString().trim() === "")

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 },
      )
    }

    // Check if at least one category is selected
    const categories = body.categories || {}
    const hasCategory = Object.values(categories).some(Boolean)
    if (!hasCategory) {
      console.log("❌ No categories selected")
      return NextResponse.json(
        {
          success: false,
          error: "At least one category must be selected",
        },
        { status: 400 },
      )
    }

    // Check for duplicate email
    console.log("🔍 Checking for duplicate email:", body.email)
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("id, email")
      .eq("email", body.email.toLowerCase().trim())
      .single()

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

    if (existingPlayer) {
      console.log("❌ Email already exists:", body.email)
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered",
          duplicate: true,
        },
        { status: 409 },
      )
    }

    // Prepare player data for insertion
    const playerData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      nationality: body.nationality.trim(),
      passport: body.passport.trim(),
      league: body.league.trim(),
      played_in_2024: Boolean(body.played_in_2024),
      gender: body.gender,
      country: body.country || "national",
      total_cost: body.total_cost || 0,
      currency: body.currency || "USD",
      payment_status: body.payment_status || "pending",
      // Categories
      handicap: Boolean(categories.handicap),
      senior: Boolean(categories.senior),
      scratch: Boolean(categories.scratch),
      // Extras
      reenganche: Boolean(body.extras?.reenganche),
      marathon: Boolean(body.extras?.marathon),
      desperate: Boolean(body.extras?.desperate),
      created_at: new Date().toISOString(),
    }

    console.log("💾 Inserting player data:", {
      name: playerData.name,
      email: playerData.email,
      categories: {
        handicap: playerData.handicap,
        senior: playerData.senior,
        scratch: playerData.scratch,
      },
      extras: {
        reenganche: playerData.reenganche,
        marathon: playerData.marathon,
        desperate: playerData.desperate,
      },
      total_cost: playerData.total_cost,
    })

    // Insert the player
    const { data: insertedPlayer, error: insertError } = await supabase
      .from("players")
      .insert([playerData])
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
      name: insertedPlayer.name,
      email: insertedPlayer.email,
      total_cost: insertedPlayer.total_cost,
    })

    return NextResponse.json({
      success: true,
      message: "Player registered successfully",
      data: {
        id: insertedPlayer.id,
        name: insertedPlayer.name,
        email: insertedPlayer.email,
        total_cost: insertedPlayer.total_cost,
      },
    })
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

export async function GET() {
  return NextResponse.json({
    message: "Player registration endpoint",
    method: "POST",
    status: "active",
    tournament_dates: "2 al 9 de agosto 2025",
    early_bird_price: "$70 hasta 19 de julio",
    regular_price: "$80 después del 19 de julio",
  })
}
