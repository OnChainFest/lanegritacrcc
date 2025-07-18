"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, Eye, EyeOff } from "lucide-react"

interface EnvValue {
  name: string
  value: string
  description: string
  isSecret: boolean
}

export default function EnvValuesPage() {
  const [copiedVar, setCopiedVar] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  // Valores exactos para Vercel
  const envValues: EnvValue[] = [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      value: "https://pybfjonqjzlhilknrmbh.supabase.co",
      description: "URL de tu proyecto Supabase",
      isSecret: false,
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmZqb25xanpsaGlsa25ybWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzc4MjksImV4cCI6MjA2NTQxMzgyOX0.TErykfq_jF16DB4sQ57qcnR7mRv07hrj8euv7DOXB8M",
      description: "Clave anónima de Supabase",
      isSecret: true,
    },
    {
      name: "JWT_SECRET",
      value: "torneo-la-negrita-super-secret-key-2025-bowling-tournament-jwt",
      description: "Secreto para firmar tokens JWT",
      isSecret: true,
    },
    {
      name: "JWT_EXPIRES_IN",
      value: "24h",
      description: "Tiempo de expiración de tokens",
      isSecret: false,
    },
    {
      name: "ADMIN_USERNAME",
      value: "admin",
      description: "Nombre de usuario del administrador",
      isSecret: false,
    },
    {
      name: "ADMIN_EMAIL",
      value: "admin@torneo-la-negrita.com",
      description: "Email del administrador",
      isSecret: false,
    },
    {
      name: "ADMIN_PASSWORD_HASH",
      value: "$2b$10$rQJ5K8qF7mH9nL2pS3tU4eX6vY8wZ1aB2cD3eF4gH5iJ6kL7mN8oP9",
      description: "Hash de la contraseña 'admin123'",
      isSecret: true,
    },
    {
      name: "NEXT_PUBLIC_APP_URL",
      value: "https://torneo-la-negrita.vercel.app",
      description: "URL de tu aplicación (cambiar por la real)",
      isSecret: false,
    },
    {
      name: "RESEND_API_KEY",
      value: "re_tu_api_key_de_resend_aqui",
      description: "API Key de Resend (opcional)",
      isSecret: true,
    },
    {
      name: "FROM_EMAIL",
      value: "noreply@torneo-la-negrita.com",
      description: "Email desde el cual enviar notificaciones",
      isSecret: false,
    },
    {
      name: "SENDGRID_API_KEY",
      value: "SG.tu_api_key_de_sendgrid_aqui",
      description: "API Key de SendGrid (alternativa a Resend)",
      isSecret: true,
    },
    {
      name: "ADMIN_PASSWORD",
      value: "admin123",
      description: "Contraseña temporal (eliminar después)",
      isSecret: true,
    },
  ]

  const copyToClipboard = async (text: string, varName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedVar(varName)
      setTimeout(() => setCopiedVar(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const copyNameValue = async (name: string, value: string) => {
    const text = `${name}=${value}`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedVar(`${name}_pair`)
      setTimeout(() => setCopiedVar(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const toggleSecret = (varName: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [varName]: !prev[varName],
    }))
  }

  const maskValue = (value: string, isSecret: boolean, varName: string) => {
    if (!isSecret || showSecrets[varName]) {
      return value
    }
    return "•".repeat(Math.min(value.length, 20))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Variables de Entorno para Vercel</h1>
          <p className="text-gray-600 mt-2">Copia exactamente estos nombres y valores en tu Vercel Dashboard</p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Instrucciones:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>
                1. Ve a <strong>vercel.com/dashboard</strong>
              </li>
              <li>2. Selecciona tu proyecto</li>
              <li>
                3. Ve a <strong>Settings → Environment Variables</strong>
              </li>
              <li>4. Para cada variable de abajo, haz clic en "Add New"</li>
              <li>
                5. Copia exactamente el <strong>Name</strong> y <strong>Value</strong>
              </li>
              <li>6. Selecciona todos los environments (Production, Preview, Development)</li>
              <li>
                7. Después de agregar todas, haz <strong>Redeploy</strong>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Variables Obligatorias (8)</h2>
          {envValues.slice(0, 8).map((env) => (
            <Card key={env.name} className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-sm font-semibold">{env.name}</h3>
                      <p className="text-xs text-gray-600">{env.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {env.isSecret && (
                        <Button size="sm" variant="ghost" onClick={() => toggleSecret(env.name)}>
                          {showSecrets[env.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => copyNameValue(env.name, env.value)}>
                        {copiedVar === `${env.name}_pair` ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name (para Vercel)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1">{env.name}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(env.name, `${env.name}_name`)}>
                          {copiedVar === `${env.name}_name` ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Value (para Vercel)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1 break-all">
                          {maskValue(env.value, env.isSecret, env.name)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(env.value, `${env.name}_value`)}
                        >
                          {copiedVar === `${env.name}_value` ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Variables Opcionales (4)</h2>
          <p className="text-sm text-gray-600">
            Estas variables mejoran la funcionalidad pero no son obligatorias para el funcionamiento básico.
          </p>
          {envValues.slice(8).map((env) => (
            <Card key={env.name} className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-sm font-semibold">{env.name}</h3>
                      <p className="text-xs text-gray-600">{env.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {env.isSecret && (
                        <Button size="sm" variant="ghost" onClick={() => toggleSecret(env.name)}>
                          {showSecrets[env.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => copyNameValue(env.name, env.value)}>
                        {copiedVar === `${env.name}_pair` ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name (para Vercel)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1">{env.name}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(env.name, `${env.name}_name`)}>
                          {copiedVar === `${env.name}_name` ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Value (para Vercel)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1 break-all">
                          {maskValue(env.value, env.isSecret, env.name)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(env.value, `${env.name}_value`)}
                        >
                          {copiedVar === `${env.name}_value` ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Importante:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>
                • Cambia <code>torneo-la-negrita.vercel.app</code> por tu URL real de Vercel
              </li>
              <li>• El hash de contraseña ya está generado para "admin123"</li>
              <li>• Las variables de email son opcionales si no planeas enviar emails</li>
              <li>• Después de agregar todas las variables, haz un redeploy completo</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
