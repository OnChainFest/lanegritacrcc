import { createClient } from "@supabase/supabase-js"

let supabaseInstance: any = null

export function resetSupabaseConnection() {
  console.log("🔄 Resetting Supabase connection...")
  supabaseInstance = null
}

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("🔍 Supabase Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 40) + "..." : "MISSING",
      keyPreview: supabaseKey ? "***" + supabaseKey.slice(-8) : "MISSING",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error("🔥 Supabase configuration missing:", {
        url: !!supabaseUrl,
        key: !!supabaseKey,
      })
      throw new Error("Supabase configuration is missing")
    }

    console.log("🔗 Creating new Supabase connection...")
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
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
  }

  return supabaseInstance
}
