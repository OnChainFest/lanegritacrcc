import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest) {
  console.log("👥 Players API called")

  try {
    console.log("🔄 Fetching players data...")

    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching players:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Enhance players data with calculated amounts
    const enhancedPlayers =
      players?.map((player) => {
        const isNational = player.nationality === "Nacional" || player.country === "national"
        const amountPaid = player.amount_paid || player.total_cost || 0
        const packageDetails = getPackageDetails(player)
        const categoryDetails = getCategoryDetails(player)

        return {
          ...player,
          amount_paid: amountPaid,
          currency: isNational ? "CRC" : "USD",
          package_details: packageDetails,
          category_details: categoryDetails,
          payment_display: formatPaymentDisplay(amountPaid, isNational),
          payment_details: {
            package_type: packageDetails,
            category: categoryDetails,
            amount: amountPaid,
            currency: isNational ? "CRC" : "USD",
            formatted_amount: formatPaymentDisplay(amountPaid, isNational),
          },
        }
      }) || []

    console.log(`📊 Found ${enhancedPlayers.length} players`)

    return NextResponse.json({
      success: true,
      players: enhancedPlayers,
    })
  } catch (error: any) {
    console.error("💥 Players API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

function getPackageDetails(player: any): string {
  let packageName = "Básico"

  if (player.package_type === "package3") {
    packageName = "3 Reenganches"
  } else if (player.package_type === "package4") {
    packageName = "4 Reenganches"
  } else if (player.package_type === "package5") {
    packageName = "5 Reenganches"
  } else if (player.package_type === "package8") {
    packageName = "8 Reenganches (Desesperado)"
  }

  if (player.scratch_mode) {
    packageName += " + Scratch"
  }

  return packageName
}

function getCategoryDetails(player: any): string {
  // Extract category information from player data
  const categories = []

  if (player.category_a) categories.push("A")
  if (player.category_b) categories.push("B")
  if (player.category_c) categories.push("C")
  if (player.category_senior) categories.push("Senior")
  if (player.category_super_senior) categories.push("Super Senior")
  if (player.category_master) categories.push("Master")
  if (player.category_female) categories.push("Femenino")

  return categories.length > 0 ? categories.join(", ") : "No especificada"
}

function formatPaymentDisplay(amount: number, isNational: boolean): string {
  if (amount === 0) {
    return "No pagado"
  }

  if (isNational) {
    // Format CRC with proper thousands separators and 2 decimal places
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } else {
    // Format USD with proper thousands separators and 2 decimal places
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }
}
