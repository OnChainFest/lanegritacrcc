import { createClient } from "@supabase/supabase-js"

let supabaseInstance: any = null

export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Verificar variables de entorno con valores por defecto
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🔍 Supabase Environment check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPreview: supabaseUrl ? supabaseUrl.substring(0, 40) + "..." : "MISSING",
    keyPreview: supabaseKey ? "***" + supabaseKey.slice(-8) : "MISSING",
    allSupabaseVars: Object.keys(process.env).filter((k) => k.includes("SUPABASE")),
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })

  // Si no hay variables de entorno, usar las por defecto del proyecto
  const finalUrl = supabaseUrl || "https://pybfjonqjzlhilknrmbh.supabase.co"
  const finalKey =
    supabaseKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

  if (!finalUrl || !finalKey) {
    console.error("🔥 Supabase configuration missing even with fallbacks:", {
      url: !!finalUrl,
      key: !!finalKey,
    })
    throw new Error("Supabase configuration is missing")
  }

  console.log("🔧 Creating Supabase client...")

  try {
    supabaseInstance = createClient(finalUrl, finalKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    })

    console.log("✅ Supabase client created successfully")
    return supabaseInstance
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    throw error
  }
}

// Reset connection function for debugging
export function resetSupabaseConnection() {
  supabaseInstance = null
  console.log("🔄 Supabase connection reset")
}
