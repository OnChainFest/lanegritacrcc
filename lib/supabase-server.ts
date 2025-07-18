import { createClient } from "@supabase/supabase-js"

let supabaseInstance: any = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pybfjonqjzlhilknrmbh.supabase.co"
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M"

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  }
  return supabaseInstance
}

export function resetSupabaseConnection() {
  supabaseInstance = null
  return getSupabase()
}
