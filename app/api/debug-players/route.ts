import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🔍 Debug Players: Starting analysis at", new Date().toISOString())

    const supabase = getSupabase()

    // Get all players with full details
    const { data: allPlayers, error: playersError } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })

    if (playersError) {
      console.error("❌ Error fetching players:", playersError)
      return NextResponse.json(
        {
          success: false,
          error: playersError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Get count using Supabase count
    const { count: supabaseCount, error: countError } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ Error getting count:", countError)
      return NextResponse.json(
        {
          success: false,
          error: countError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Analyze data
    const actualCount = allPlayers?.length || 0
    const duplicateEmails = new Map()
    const duplicatePassports = new Map()
    const invalidRecords = []

    allPlayers?.forEach((player) => {
      // Check for duplicate emails
      if (player.email) {
        if (duplicateEmails.has(player.email)) {
          duplicateEmails.get(player.email).push(player)
        } else {
          duplicateEmails.set(player.email, [player])
        }
      }

      // Check for duplicate passports
      if (player.passport) {
        if (duplicatePassports.has(player.passport)) {
          duplicatePassports.get(player.passport).push(player)
        } else {
          duplicatePassports.set(player.passport, [player])
        }
      }

      // Check for invalid records
      if (!player.name || !player.email) {
        invalidRecords.push(player)
      }
    })

    // Find actual duplicates
    const emailDuplicates = Array.from(duplicateEmails.entries()).filter(([_, players]) => players.length > 1)

    const passportDuplicates = Array.from(duplicatePassports.entries()).filter(([_, players]) => players.length > 1)

    const analysis = {
      supabase_count: supabaseCount,
      actual_count: actualCount,
      count_matches: supabaseCount === actualCount,
      duplicate_emails: emailDuplicates.length,
      duplicate_passports: passportDuplicates.length,
      invalid_records: invalidRecords.length,
      email_duplicates_detail: emailDuplicates,
      passport_duplicates_detail: passportDuplicates,
      invalid_records_detail: invalidRecords,
      all_players: allPlayers?.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        passport: p.passport,
        payment_status: p.payment_status,
        created_at: p.created_at,
      })),
      timestamp: new Date().toISOString(),
    }

    console.log("🔍 Debug analysis complete:", {
      supabase_count: supabaseCount,
      actual_count: actualCount,
      duplicates: emailDuplicates.length + passportDuplicates.length,
      invalid: invalidRecords.length,
    })

    return NextResponse.json(
      {
        success: true,
        ...analysis,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("❌ Debug players error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
