import { createClient } from "@supabase/supabase-js"

let supabaseClient: any = null

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return {
    url,
    key,
    hasUrl: !!url,
    hasKey: !!key,
  }
}

export function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getSupabaseConfig()

    if (!config.url || !config.key) {
      throw new Error("Missing Supabase configuration")
    }

    supabaseClient = createClient(config.url, config.key, {
      auth: {
        persistSession: false,
      },
    })
  }

  return supabaseClient
}

export async function testSupabaseConnection() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("players").select("id").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
