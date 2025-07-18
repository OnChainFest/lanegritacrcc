import { createClient } from "@supabase/supabase-js"

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    })
  }
  return supabaseInstance
}

/**
 * Resets the stored Supabase client so that a fresh
 * connection can be created on the next call to getSupabase().
 * Useful for debugging or after environment-variable changes.
 */
export function resetSupabaseConnection() {
  supabaseInstance = null
}
