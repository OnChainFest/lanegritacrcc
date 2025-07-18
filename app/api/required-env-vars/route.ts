import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Lista completa de variables de entorno requeridas
    const requiredEnvVars = {
      // Variables públicas de Supabase (OBLIGATORIAS)
      NEXT_PUBLIC_SUPABASE_URL: {
        required: true,
        description: "URL de tu proyecto Supabase",
        example: "https://tu-proyecto.supabase.co",
        currentValue: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET",
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        required: true,
        description: "Clave anónima de Supabase",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        currentValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (hidden)" : "NOT_SET",
      },

      // Variables de autenticación (OBLIGATORIAS)
      JWT_SECRET: {
        required: true,
        description: "Secreto para firmar tokens JWT",
        example: "tu-secreto-super-seguro-aqui-123456789",
        currentValue: process.env.JWT_SECRET ? "SET (hidden)" : "NOT_SET",
      },
      JWT_EXPIRES_IN: {
        required: true,
        description: "Tiempo de expiración de tokens JWT",
        example: "24h",
        currentValue: process.env.JWT_EXPIRES_IN || "NOT_SET",
      },
      ADMIN_USERNAME: {
        required: true,
        description: "Nombre de usuario del administrador",
        example: "admin",
        currentValue: process.env.ADMIN_USERNAME || "NOT_SET",
      },
      ADMIN_PASSWORD_HASH: {
        required: true,
        description: "Hash de la contraseña del administrador",
        example: "$2b$10$...",
        currentValue: process.env.ADMIN_PASSWORD_HASH ? "SET (hidden)" : "NOT_SET",
      },
      ADMIN_EMAIL: {
        required: true,
        description: "Email del administrador",
        example: "admin@torneo.com",
        currentValue: process.env.ADMIN_EMAIL || "NOT_SET",
      },

      // Variables de aplicación (OBLIGATORIAS)
      NEXT_PUBLIC_APP_URL: {
        required: true,
        description: "URL de tu aplicación en producción",
        example: "https://tu-app.vercel.app",
        currentValue: process.env.NEXT_PUBLIC_APP_URL || "NOT_SET",
      },

      // Variables de email (OPCIONALES pero recomendadas)
      RESEND_API_KEY: {
        required: false,
        description: "API Key de Resend para envío de emails",
        example: "re_...",
        currentValue: process.env.RESEND_API_KEY ? "SET (hidden)" : "NOT_SET",
      },
      FROM_EMAIL: {
        required: false,
        description: "Email desde el cual se envían notificaciones",
        example: "noreply@torneo.com",
        currentValue: process.env.FROM_EMAIL || "NOT_SET",
      },

      // Variables alternativas de email
      SENDGRID_API_KEY: {
        required: false,
        description: "API Key de SendGrid (alternativa a Resend)",
        example: "SG...",
        currentValue: process.env.SENDGRID_API_KEY ? "SET (hidden)" : "NOT_SET",
      },

      // Variable temporal para contraseña (solo para generar hash)
      ADMIN_PASSWORD: {
        required: false,
        description: "Contraseña temporal para generar hash (eliminar después)",
        example: "tu-contraseña-segura",
        currentValue: process.env.ADMIN_PASSWORD ? "SET (hidden)" : "NOT_SET",
      },
    }

    // Separar variables por categorías
    const categorized = {
      obligatory: Object.entries(requiredEnvVars).filter(([_, config]) => config.required),
      optional: Object.entries(requiredEnvVars).filter(([_, config]) => !config.required),
      missing: Object.entries(requiredEnvVars).filter(
        ([_, config]) => config.required && config.currentValue === "NOT_SET",
      ),
      set: Object.entries(requiredEnvVars).filter(([_, config]) => config.currentValue !== "NOT_SET"),
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total: Object.keys(requiredEnvVars).length,
        obligatory: categorized.obligatory.length,
        optional: categorized.optional.length,
        missing: categorized.missing.length,
        set: categorized.set.length,
      },
      variables: requiredEnvVars,
      categorized,
      instructions: {
        vercel: [
          "1. Ve a tu dashboard de Vercel",
          "2. Selecciona tu proyecto",
          "3. Ve a Settings → Environment Variables",
          "4. Agrega cada variable de la lista 'obligatory'",
          "5. Opcionalmente agrega las variables 'optional'",
          "6. Redeploy tu aplicación",
        ],
        supabase: [
          "1. Ve a tu proyecto en Supabase",
          "2. Settings → API",
          "3. Copia la URL del proyecto",
          "4. Copia la clave 'anon public'",
        ],
      },
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
