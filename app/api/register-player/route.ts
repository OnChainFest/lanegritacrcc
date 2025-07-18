import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  console.log("🎯 === PLAYER REGISTRATION START ===")

  try {
    console.log("🎳 Registration API called")

    const body = await request.json()
    console.log("📝 Registration data received:", {
      name: body.name,
      email: body.email,
      nationality: body.nationality,
    })

    // Validate required fields
    const requiredFields = ["name", "email", "nationality", "passport", "league", "gender", "country"]
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
      country: body.country,
      total_cost: body.total_cost || 0,
      currency: body.currency || "USD",
      payment_status: body.payment_status || "pending",
      // Categories as individual boolean fields
      handicap: Boolean(categories.handicap),
      scratch: Boolean(categories.scratch),
      senior_m: Boolean(categories.seniorM),
      senior_f: Boolean(categories.seniorF),
      marathon: Boolean(categories.marathon),
      desperate: Boolean(categories.desperate),
      reenganche_3: Boolean(categories.reenganche3),
      reenganche_4: Boolean(categories.reenganche4),
      reenganche_5: Boolean(categories.reenganche5),
      reenganche_8: Boolean(categories.reenganche8),
      created_at: new Date().toISOString(),
    }

    console.log("💾 Inserting player data:", {
      name: playerData.name,
      email: playerData.email,
      categories: {
        handicap: playerData.handicap,
        scratch: playerData.scratch,
        senior_m: playerData.senior_m,
        senior_f: playerData.senior_f,
        marathon: playerData.marathon,
        desperate: playerData.desperate,
        reenganche_3: playerData.reenganche_3,
        reenganche_4: playerData.reenganche_4,
        reenganche_5: playerData.reenganche_5,
        reenganche_8: playerData.reenganche_8,
      },
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
    })

    return NextResponse.json({
      success: true,
      message: "Player registered successfully",
      data: {
        id: insertedPlayer.id,
        name: insertedPlayer.name,
        email: insertedPlayer.email,
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
  })
}
