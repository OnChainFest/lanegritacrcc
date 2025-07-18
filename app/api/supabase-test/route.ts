import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Testing Supabase import...")

    // Test if we can import createClient
    const { createClient } = await import("@supabase/supabase-js")

    console.log("✅ Supabase import successful")

    // Test if we can create client
    const supabaseUrl = "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("✅ Supabase client created")

    // Test basic query
    const { data, error } = await supabase.from("tournaments").select("*").limit(1)

    if (error) {
      console.error("❌ Query error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          step: "query_failed",
        },
        { status: 500 },
      )
    }

    console.log("✅ Query successful:", data)

    return NextResponse.json({
      success: true,
      message: "Supabase connection works!",
      data: data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("❌ Supabase test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        step: "import_or_setup_failed",
        stack: error?.stack,
      },
      { status: 500 },
    )
  }
}
