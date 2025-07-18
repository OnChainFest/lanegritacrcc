import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  console.log("🔍 === DEBUG REGISTRATION SCHEMA START ===")

  try {
    // Test 1: Check Supabase connection
    console.log("🔗 Testing Supabase connection...")
    const { data: connectionTest, error: connectionError } = await supabase
      .from("players")
      .select("count", { count: "exact", head: true })

    if (connectionError) {
      console.error("❌ Connection failed:", connectionError)
      return NextResponse.json({
        success: false,
        error: "Connection failed",
        details: connectionError,
      })
    }

    console.log("✅ Connection successful, player count:", connectionTest)

    // Test 2: Get table schema
    console.log("📋 Getting table schema...")
    const { data: schemaData, error: schemaError } = await supabase.rpc("get_table_schema", {
      table_name: "players",
    })

    if (schemaError) {
      console.log("⚠️ Schema query failed (this is normal):", schemaError.message)
    }

    // Test 3: Try minimal insert
    console.log("🧪 Testing minimal insert...")
    const testData = {
      name: "Test Player",
      email: "test@example.com",
      nationality: "Nacional",
      passport: "123456789",
      league: "Test League",
      gender: "M",
      country: "national",
    }

    const { data: insertResult, error: insertError } = await supabase
      .from("players")
      .insert([testData])
      .select("id, name, email")
      .single()

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
    await supabase.from("players").delete().eq("id", insertResult.id)

    return NextResponse.json({
      success: true,
      message: "All tests passed",
      connection_test: connectionTest,
      schema_data: schemaData,
      insert_test: insertResult,
    })
  } catch (error: any) {
    console.error("💥 Debug schema error:", error)
    return NextResponse.json({
      success: false,
      error: "Debug failed",
      details: error.message,
    })
  }
}
