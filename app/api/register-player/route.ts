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
    const requiredFields = ["name", "email", "phone", "nationality", "passport", "league", "gender", "country"]
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Por favor ingresa un email válido",
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

      if (checkError && checkError.code !== "PGRST116") {
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

    // Calculate amount due
    const amountDue = calculatePlayerAmountDue(body)

    // Step 4: Prepare complete player data with individual columns
    const playerData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      nationality: body.nationality.trim(),
      passport: body.passport.trim(),
      league: body.league.trim(),
      played_in_2024: Boolean(body.played_in_2024),
      gender: body.gender,
      country: body.country,
      categories: body.categories,
      extras: body.extras,
      total_cost: Number(body.total_cost) || 0,
      currency: body.currency || "USD",
      payment_status: "pending",
      amount_due: amountDue,
      amount_paid: 0,
      created_at: new Date().toISOString(),
      // Individual category columns (now they exist!)
      handicap: Boolean(body.categories?.handicap),
      senior: Boolean(body.categories?.senior),
      scratch: Boolean(body.categories?.scratch),
      // Individual extra columns
      reenganche: Boolean(body.extras?.reenganche),
      marathon: Boolean(body.extras?.marathon),
      desperate: Boolean(body.extras?.desperate),
    }

    console.log("💾 Attempting to insert complete player data:", {
      name: playerData.name,
      email: playerData.email,
      phone: playerData.phone,
      nationality: playerData.nationality,
      country: playerData.country,
      total_cost: playerData.total_cost,
      categories: playerData.categories,
      extras: playerData.extras,
      amount_due: playerData.amount_due,
      amount_paid: playerData.amount_paid,
      created_at: playerData.created_at,
    })

    // Insert the complete player data
    try {
      const { data: insertedPlayer, error: insertError } = await supabase
        .from("players")
        .insert([playerData])
        .select(
          "id, name, email, phone, total_cost, country, handicap, senior, scratch, reenganche, marathon, desperate, amount_due, amount_paid, created_at",
        )
        .single()

      if (insertError) {
        console.error("❌ Insert failed:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        })

        // More specific error handling
        if (insertError.code === "23505") {
          return NextResponse.json(
            {
              success: false,
              error: "Email already registered",
              duplicate: true,
            },
            { status: 409 },
          )
        }

        return NextResponse.json(
          {
            success: false,
            error: "Failed to register player",
            details: {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              code: insertError.code,
            },
            attempted_data: playerData,
          },
          { status: 500 },
        )
      }

      console.log("✅ Player registered successfully:", {
        id: insertedPlayer.id,
        name: insertedPlayer.name,
        email: insertedPlayer.email,
        phone: insertedPlayer.phone,
        total_cost: insertedPlayer.total_cost,
        categories: insertedPlayer.categories,
        extras: insertedPlayer.extras,
        amount_due: insertedPlayer.amount_due,
        amount_paid: insertedPlayer.amount_paid,
        created_at: insertedPlayer.created_at,
      })

      return NextResponse.json({
        success: true,
        message: "Player registered successfully",
        data: {
          id: insertedPlayer.id,
          name: insertedPlayer.name,
          email: insertedPlayer.email,
          phone: insertedPlayer.phone,
          total_cost: insertedPlayer.total_cost,
          country: insertedPlayer.country,
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

function calculatePlayerAmountDue(playerData: any): number {
  const registrationDate = new Date()
  const earlyBirdDeadline = new Date("2025-07-22T23:59:59")
  const isEarlyBird = registrationDate <= earlyBirdDeadline

  // Check if player is national or international
  const isNational = playerData.nationality === "Nacional" || playerData.country === "national"

  let baseAmount = 0

  if (isNational) {
    // National pricing in CRC
    if (playerData.extras?.reenganche) {
      baseAmount = isEarlyBird ? 65000 : 71000
    } else if (playerData.extras?.marathon) {
      baseAmount = isEarlyBird ? 72000 : 78000
    } else {
      baseAmount = isEarlyBird ? 36000 : 42000
    }

    // Add scratch fee if applicable
    if (playerData.categories?.scratch) {
      baseAmount += 11000
    }
  } else {
    // International pricing in USD
    if (playerData.extras?.reenganche) {
      baseAmount = isEarlyBird ? 122 : 132
    } else if (playerData.extras?.marathon) {
      baseAmount = isEarlyBird ? 153 : 163
    } else if (playerData.extras?.desperate) {
      baseAmount = isEarlyBird ? 201 : 210
    } else {
      baseAmount = isEarlyBird ? 70 : 80
    }

    // Add scratch fee if applicable
    if (playerData.categories?.scratch) {
      baseAmount += 22
    }
  }

  return Math.round(baseAmount)
}
