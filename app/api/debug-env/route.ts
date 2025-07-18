import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Present" : "❌ Missing",
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing",
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
  })
}
