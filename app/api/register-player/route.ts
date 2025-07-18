import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  console.log("🎯 === PLAYER REGISTRATION START ===")

  try {
    const body = await request.json()
    console.log("📝 Full registration data received:", JSON.stringify(body, null, 2))

    // Step 1: Validate required fields
    const requiredFields = ["name", "email", "nationality", "passport", "league", "gender", "country"]
    const missingFields = requiredFields.filter((field) => !body[field] || body[field].toString().trim() === "")

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: " + missingFields.join(", "),
          missingFields,
        },
        { status: 400 },
      )
    }

    // Step 2: Check categories
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

    // Step 3: Check for duplicate email
    console.log("🔍 Checking for duplicate email:", body.email)
    try {
      const { data: existingPlayer, error: checkError } = await supabase
        .from("players")
        .select("id, email")
        .eq("email", body.email.toLowerCase().trim())
        .maybeSingle()

      if (checkError) {
        console.error("❌ Error checking duplicates:", checkError)
        return NextResponse.json(
          {
            success: false,
            error: "Database error during duplicate check",
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
    } catch (duplicateError: any) {
      console.error("💥 Duplicate check failed:", duplicateError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check for duplicates",
          details: duplicateError.message,
        },
        { status: 500 },
      )
    }

    // Step 4: Prepare minimal player data first
    const minimalPlayerData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      nationality: body.nationality.trim(),
      passport: body.passport.trim(),
      league: body.league.trim(),
      gender: body.gender,
      country: body.country,
    }

    console.log("💾 Attempting minimal insert first:", minimalPlayerData)

    // Try minimal insert first
    try {
      const { data: minimalResult, error: minimalError } = await supabase
        .from("players")
        .insert([minimalPlayerData])
        .select("id, name, email")
        .single()

      if (minimalError) {
        console.error("❌ Minimal insert failed:", {
          message: minimalError.message,
          details: minimalError.details,
          hint: minimalError.hint,
          code: minimalError.code,
        })

        return NextResponse.json(
          {
            success: false,
            error: "Failed to register player (minimal data)",
            details: {
              message: minimalError.message,
              details: minimalError.details,
              hint: minimalError.hint,
              code: minimalError.code,
            },
            attempted_data: minimalPlayerData,
          },
          { status: 500 },
        )
      }

      console.log("✅ Minimal insert successful:", minimalResult)

      // Now update with additional fields
      const additionalData = {
        played_in_2024: Boolean(body.played_in_2024),
        total_cost: Number(body.total_cost) || 0,
        currency: body.currency || "USD",
        payment_status: "pending",
        handicap: Boolean(categories.handicap),
        senior: Boolean(categories.senior),
        scratch: Boolean(categories.scratch),
        reenganche: Boolean(body.extras?.reenganche),
        marathon: Boolean(body.extras?.marathon),
        desperate: Boolean(body.extras?.desperate),
      }

      console.log("🔄 Updating with additional data:", additionalData)

      const { data: updatedPlayer, error: updateError } = await supabase
        .from("players")
        .update(additionalData)
        .eq("id", minimalResult.id)
        .select("id, name, email, total_cost, country")
        .single()

      if (updateError) {
        console.error("❌ Update failed:", updateError)
        // Player was created but update failed - still return success with basic info
        return NextResponse.json({
          success: true,
          message: "Player registered successfully (basic info only)",
          data: {
            id: minimalResult.id,
            name: minimalResult.name,
            email: minimalResult.email,
            total_cost: body.total_cost,
            country: body.country,
          },
          warning: "Some additional fields could not be saved",
        })
      }

      console.log("✅ Player fully registered:", updatedPlayer)

      return NextResponse.json({
        success: true,
        message: "Player registered successfully",
        data: {
          id: updatedPlayer.id,
          name: updatedPlayer.name,
          email: updatedPlayer.email,
          total_cost: updatedPlayer.total_cost,
          country: updatedPlayer.country,
        },
      })
    } catch (insertError: any) {
      console.error("💥 Insert operation failed:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Database insert failed",
          details: insertError.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("💥 Registration API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
        stack: error.stack,
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
    pricing: {
      early_bird_usd: "$70 hasta 19 de julio",
      regular_usd: "$80 después del 19 de julio",
      early_bird_crc: "₡36,000 hasta 19 de julio",
      regular_crc: "₡42,000 después del 19 de julio",
    },
  })
}
