"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, Globe, Clock, Eye, AlertTriangle, ExternalLink } from "lucide-react"

export default function EnvExplanationPage() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  useEffect(() => {
    // Detectar la URL actual
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin)
    }
  }, [])

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const jwtOptions = [
    { value: "1h", description: "1 hora - Muy seguro, pero incómodo", security: "Alta", usability: "Baja" },
    { value: "8h", description: "8 horas - Perfecto para jornada laboral", security: "Alta", usability: "Media" },
    { value: "24h", description: "24 horas - Balance perfecto (RECOMENDADO)", security: "Media", usability: "Alta" },
    { value: "7d", description: "7 días - Cómodo pero menos seguro", security: "Baja", usability: "Alta" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explicación de Variables de Entorno</h1>
          <p className="text-gray-600 mt-2">Entendiendo JWT_EXPIRES_IN, NEXT_PUBLIC_ y URLs</p>
        </div>

        {/* URL Actual */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Tu URL Actual de Vercel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Esta es la URL que debes usar para NEXT_PUBLIC_APP_URL:</p>
                <div className="flex items-center gap-2 p-3 bg-white rounded border">
                  <code className="flex-1 font-mono text-sm">{currentUrl || "Cargando..."}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(currentUrl, "current-url")}
                    disabled={!currentUrl}
                  >
                    {copiedItem === "current-url" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  <strong>Para Vercel:</strong> Usa exactamente esta URL en la variable NEXT_PUBLIC_APP_URL. Más tarde
                  puedes agregar un dominio personalizado en Settings → Domains.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* JWT_EXPIRES_IN Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              JWT_EXPIRES_IN - Duración de Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Esta variable controla <strong>cuánto tiempo dura la sesión del administrador</strong> después de hacer
                login.
              </p>

              <div className="grid gap-3">
                {jwtOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 rounded-lg border-2 ${
                      option.value === "24h" ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{option.value}</code>
                        {option.value === "24h" && <Badge variant="default">RECOMENDADO</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            option.security === "Alta"
                              ? "default"
                              : option.security === "Media"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          Seguridad: {option.security}
                        </Badge>
                        <Badge
                          variant={
                            option.usability === "Alta"
                              ? "default"
                              : option.usability === "Media"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          Usabilidad: {option.usability}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendación:</strong> Usa "24h" para empezar. Es un balance perfecto entre seguridad y
                  comodidad. El administrador solo necesitará hacer login una vez al día.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* NEXT_PUBLIC_ Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-600" />
              NEXT_PUBLIC_ - Variables Públicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Advertencia de Vercel:</strong> "NEXT_PUBLIC_ exposes this value to the browser. Verify it is
                  safe to share publicly."
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800 text-lg">❌ Variables PRIVADAS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-700 mb-3">Estas NUNCA deben ser NEXT_PUBLIC_:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• JWT_SECRET</li>
                      <li>• ADMIN_PASSWORD_HASH</li>
                      <li>• API Keys de servicios</li>
                      <li>• Contraseñas</li>
                      <li>• Tokens privados</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-lg">✅ Variables PÚBLICAS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 mb-3">Estas SÍ pueden ser NEXT_PUBLIC_:</p>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                      <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                      <li>• NEXT_PUBLIC_APP_URL</li>
                      <li>• URLs públicas</li>
                      <li>• Configuraciones del cliente</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">¿Por qué Supabase es seguro siendo público?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • La URL y clave anónima están <strong>diseñadas</strong> para ser públicas
                  </li>
                  <li>
                    • La seguridad real está en las <strong>políticas RLS</strong> de la base de datos
                  </li>
                  <li>• Solo permiten operaciones que tú autorices explícitamente</li>
                  <li>• Es como la dirección de un edificio: es pública, pero necesitas llaves para entrar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Configuración de Dominio Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Sí, puedes agregar un dominio propio después.</strong> Aquí te explico cómo:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🚀 Ahora (Empezar)</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">Usa la URL automática de Vercel:</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border block">
                      https://tu-proyecto-abc123.vercel.app
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🎯 Después (Personalizar)</h4>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm mb-2">Agrega tu dominio personalizado:</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border block">
                      https://torneo-la-negrita.com
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 Pasos para dominio personalizado:</h4>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Ve a Vercel Dashboard → tu proyecto</li>
                  <li>2. Settings → Domains</li>
                  <li>3. Add Domain → escribe tu dominio</li>
                  <li>4. Configura los DNS según las instrucciones</li>
                  <li>5. Actualiza NEXT_PUBLIC_APP_URL con la nueva URL</li>
                  <li>6. Redeploy el proyecto</li>
                </ol>
              </div>

              <Button className="w-full" asChild>
                <a href="https://vercel.com/docs/projects/domains" target="_blank" rel="noopener noreferrer">
                  Ver Guía Completa de Dominios en Vercel
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Copy Section */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🚀 Valores Listos para Copiar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-semibold text-green-700">JWT_EXPIRES_IN (recomendado)</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-white px-3 py-2 rounded border flex-1">24h</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard("24h", "jwt-expires")}>
                    {copiedItem === "jwt-expires" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">NEXT_PUBLIC_APP_URL (tu URL actual)</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-white px-3 py-2 rounded border flex-1">{currentUrl || "Cargando..."}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(currentUrl, "app-url")}
                    disabled={!currentUrl}
                  >
                    {copiedItem === "app-url" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
