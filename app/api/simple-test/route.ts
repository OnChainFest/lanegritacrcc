import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("tournaments").select("*").limit(1)

    if (error) {
      return NextResponse.json({ success: false, step: "query", error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length ?? 0,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, step: "unexpected", error: err?.message }, { status: 500 })
  }
}
