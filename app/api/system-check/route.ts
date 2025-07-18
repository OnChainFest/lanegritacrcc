import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🔍 Starting system check...")

    // 1. Verificar variables de entorno
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "NOT_SET",
      ADMIN_USERNAME: process.env.ADMIN_USERNAME || "NOT_SET",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "NOT_SET",
      ADMIN_PASSWORD_HASH: !!process.env.ADMIN_PASSWORD_HASH,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT_SET",
    }

    console.log("📋 Environment variables check:", envCheck)

    // 2. Verificar conexión a Supabase
    const supabaseCheck = { connected: false, error: null, tablesExist: false }
    try {
      const supabase = getSupabase()

      // Probar conexión básica
      const { data: connectionTest, error: connectionError } = await supabase.from("players").select("count").limit(1)

      if (connectionError) {
        console.log("⚠️ Supabase connection test failed:", connectionError.message)
        supabaseCheck.error = connectionError.message
      } else {
        console.log("✅ Supabase connection successful")
        supabaseCheck.connected = true
        supabaseCheck.tablesExist = true
      }
    } catch (error) {
      console.error("❌ Supabase connection error:", error)
      supabaseCheck.error = error instanceof Error ? error.message : "Unknown error"
    }

    // 3. Verificar tablas principales
    const tablesCheck = { players: false, tournaments: false, player_series: false }
    if (supabaseCheck.connected) {
      try {
        const supabase = getSupabase()

        // Verificar tabla players
        const { error: playersError } = await supabase.from("players").select("id").limit(1)
        tablesCheck.players = !playersError

        // Verificar tabla tournaments
        const { error: tournamentsError } = await supabase.from("tournaments").select("id").limit(1)
        tablesCheck.tournaments = !tournamentsError

        // Verificar tabla player_series
        const { error: seriesError } = await supabase.from("player_series").select("id").limit(1)
        tablesCheck.player_series = !seriesError

        console.log("📊 Tables check:", tablesCheck)
      } catch (error) {
        console.error("❌ Tables check error:", error)
      }
    }

    // 4. Calcular estado general
    const missingEnvVars = Object.entries(envCheck).filter(
      ([key, value]) => value === false || value === "NOT_SET",
    ).length

    const workingTables = Object.values(tablesCheck).filter(Boolean).length

    const systemStatus = {
      overall: missingEnvVars === 0 && supabaseCheck.connected && workingTables >= 2 ? "READY" : "NEEDS_SETUP",
      environment: {
        total: Object.keys(envCheck).length,
        configured: Object.keys(envCheck).length - missingEnvVars,
        missing: missingEnvVars,
      },
      database: {
        connected: supabaseCheck.connected,
        tablesWorking: workingTables,
        totalTables: Object.keys(tablesCheck).length,
      },
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: systemStatus,
      details: {
        environment: envCheck,
        supabase: supabaseCheck,
        tables: tablesCheck,
      },
      nextSteps:
        systemStatus.overall === "READY"
          ? [
              "✅ Sistema listo para usar",
              "🎯 Puedes acceder al panel de administración",
              "📊 Comenzar a registrar jugadores",
              "🏆 Configurar el torneo",
            ]
          : [
              missingEnvVars > 0 ? "❌ Configurar variables de entorno faltantes" : "✅ Variables de entorno OK",
              !supabaseCheck.connected ? "❌ Verificar conexión a Supabase" : "✅ Conexión a Supabase OK",
              workingTables < 2 ? "❌ Ejecutar scripts de base de datos" : "✅ Tablas de base de datos OK",
            ],
    })
  } catch (error) {
    console.error("🔥 System check failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
