import { createClient } from "@supabase/supabase-js"

let supabaseInstance: any = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase environment variables")
      throw new Error("Missing Supabase configuration")
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey)
    console.log("✅ Supabase client created successfully")
  }

  return supabaseInstance
}

export function resetSupabaseConnection() {
  supabaseInstance = null
  console.log("🔄 Supabase connection reset")
}
