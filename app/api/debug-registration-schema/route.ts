import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  console.log("🔍 === DEBUG REGISTRATION SCHEMA ===")

  try {
    // Test 1: Check Supabase connection
    console.log("1. Testing Supabase connection...")
    const { data: connectionTest, error: connectionError } = await supabase.from("players").select("count").limit(1)

    if (connectionError) {
      console.error("❌ Connection failed:", connectionError)
      return NextResponse.json({
        success: false,
        error: "Connection failed",
        details: connectionError,
      })
    }

    console.log("✅ Connection successful")

    // Test 2: Get sample data to see structure
    console.log("2. Getting sample data structure...")
    const { data: sampleData, error: selectError } = await supabase.from("players").select("*").limit(1)

    if (selectError) {
      console.error("❌ Select failed:", selectError)
    } else {
      console.log("✅ Sample data structure:", sampleData)
    }

    // Test 3: Try minimal insert with all required fields
    console.log("3. Testing complete insert...")
    const testData = {
      name: "Test Player Schema",
      email: `test-schema-${Date.now()}@example.com`,
      nationality: "Nacional",
      passport: "TEST123456",
      league: "Test League",
      gender: "M",
      country: "national",
      total_cost: 70,
      currency: "USD",
      payment_status: "pending",
      played_in_2024: false,
      handicap: true,
      senior: false,
      scratch: false,
      reenganche: false,
      marathon: false,
      desperate: false,
    }

    const { data: insertResult, error: insertError } = await supabase.from("players").insert([testData]).select()

    if (insertError) {
      console.error("❌ Insert test failed:", insertError)
      return NextResponse.json({
        success: false,
        error: "Insert test failed",
        details: insertError,
        attempted_data: testData,
      })
    }

    console.log("✅ Insert test successful:", insertResult)

    // Clean up test data
    if (insertResult && insertResult[0]) {
      await supabase.from("players").delete().eq("id", insertResult[0].id)
      console.log("🧹 Test data cleaned up")
    }

    return NextResponse.json({
      success: true,
      message: "All schema tests passed",
      sample_data: sampleData,
      insert_test: insertResult,
      test_data_used: testData,
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
