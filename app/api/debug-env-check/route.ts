import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Obtener todas las variables de entorno que empiecen con NEXT_PUBLIC o sean relevantes
    const envVars = {
      // Variables públicas de Supabase
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (hidden)" : "NOT_SET",

      // Variables de autenticación
      JWT_SECRET: process.env.JWT_SECRET ? "SET (hidden)" : "NOT_SET",
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "NOT_SET",
      ADMIN_USERNAME: process.env.ADMIN_USERNAME || "NOT_SET",
      ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH ? "SET (hidden)" : "NOT_SET",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "NOT_SET",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "SET (hidden)" : "NOT_SET",

      // Variables de email
      FROM_EMAIL: process.env.FROM_EMAIL || "NOT_SET",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "SET (hidden)" : "NOT_SET",
      RESEND_API_KEY: process.env.RESEND_API_KEY ? "SET (hidden)" : "NOT_SET",

      // Otras variables
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT_SET",
      NODE_ENV: process.env.NODE_ENV || "NOT_SET",

      // Contar todas las variables disponibles
      TOTAL_ENV_VARS: Object.keys(process.env).length,

      // Variables que empiecen con NEXT_PUBLIC
      NEXT_PUBLIC_VARS: Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC_")),

      // Variables relacionadas con Supabase
      SUPABASE_VARS: Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envVars,
      message: "Environment variables check completed",
    })
  } catch (error) {
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
