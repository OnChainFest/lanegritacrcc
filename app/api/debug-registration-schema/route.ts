import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  console.log("🔍 === DEBUG REGISTRATION SCHEMA ===")

  try {
    // Test basic connection
    console.log("Testing Supabase connection...")
    const { data: testData, error: testError } = await supabase.from("players").select("*").limit(1)

    if (testError) {
      console.error("❌ Connection test failed:", testError)
      return NextResponse.json({
        success: false,
        error: "Connection failed",
        details: testError,
      })
    }

    console.log("✅ Connection successful")

    // Get table schema by trying to insert with minimal data
    console.log("Testing minimal insert...")
    const minimalData = {
      name: "Test Player",
      email: "test@example.com",
      nationality: "Nacional",
      passport: "123456789",
      league: "Test League",
      gender: "M",
      country: "national",
    }

    const { data: insertTest, error: insertError } = await supabase.from("players").insert([minimalData]).select()

    if (insertError) {
      console.error("❌ Minimal insert failed:", {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
      })

      return NextResponse.json({
        success: false,
        error: "Insert test failed",
        details: {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        },
        attempted_data: minimalData,
      })
    }

    console.log("✅ Minimal insert successful:", insertTest)

    // Clean up test data
    if (insertTest && insertTest[0]?.id) {
      await supabase.from("players").delete().eq("id", insertTest[0].id)
      console.log("🧹 Test data cleaned up")
    }

    return NextResponse.json({
      success: true,
      message: "Schema test successful",
      test_data: minimalData,
      result: insertTest,
    })
  } catch (error: any) {
    console.error("💥 Debug error:", error)
    return NextResponse.json({
      success: false,
      error: "Debug failed",
      details: error.message,
    })
  }
}
