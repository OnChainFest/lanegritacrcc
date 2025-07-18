import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    console.log("🏆 API Brackets: Obteniendo lista de brackets...")

    /* ---------- ENV-GUARD ---------- */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("🏆 API Brackets: Credenciales faltantes")
      return Response.json(
        {
          success: false,
          brackets: [],
          error: "Configuración de base de datos incompleta",
        },
        { status: 200 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    /* ---------- FETCH ---------- */
    const { data: brackets, error } = await supabase
      .from("tournament_brackets")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("🏆 API Brackets: Error Supabase:", error)

      // Handle table not found gracefully
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return Response.json(
          {
            success: true,
            brackets: [],
            message: "Tabla de brackets no encontrada - se mostrará lista vacía",
          },
          { status: 200 },
        )
      }

      return Response.json(
        {
          success: false,
          brackets: [],
          error: error.message,
        },
        { status: 200 },
      )
    }

    console.log(`🏆 API Brackets: ${brackets?.length || 0} brackets encontrados`)

    return Response.json(
      {
        success: true,
        brackets: brackets || [],
      },
      { status: 200 },
    )
  } catch (err) {
    console.error("🏆 API Brackets – Error inesperado:", err)
    return Response.json(
      {
        success: false,
        brackets: [],
        error: "Error interno del servidor",
      },
      { status: 200 },
    )
  }
}
