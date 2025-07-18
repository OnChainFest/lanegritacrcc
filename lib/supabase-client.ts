import { createClient } from "@supabase/supabase-js"

// Ensure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  })
  throw new Error("Missing required Supabase environment variables")
}

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    console.log("🔄 Creating new Supabase client instance")
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "X-Client-Info": "torneo-la-negrita-2025",
        },
      },
    })
  }
  return supabaseInstance
}

// Reset function for testing
export function resetSupabaseClient() {
  supabaseInstance = null
  console.log("🔄 Supabase client reset")
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from("players").select("count(*)").limit(1)

    if (error) {
      console.error("❌ Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Supabase connection test successful")
    return { success: true, data }
  } catch (error: any) {
    console.error("❌ Supabase connection test error:", error)
    return { success: false, error: error.message }
  }
}
