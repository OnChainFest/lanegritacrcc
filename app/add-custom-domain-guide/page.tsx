"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Globe, Copy, CheckCircle, Plus, Settings, Shield, Eye, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AddCustomDomainGuidePage() {
  const [copied, setCopied] = useState("")
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast({
      title: "✅ Copiado",
      description: `${label} copiado al portapapeles`,
      duration: 2000,
    })
    setTimeout(() => setCopied(""), 2000)
  }

  const currentDomains = [
    {
      name: "lanegritacroc.vercel.app",
      status: "Valid Configuration",
      type: "Vercel Subdomain",
      purpose: "Dominio principal actual",
      keep: true,
    },
    {
      name: "v0-bowling-tournament-sooty.vercel.app",
      status: "Valid Configuration",
      type: "Vercel Subdomain",
      purpose: "Dominio de desarrollo/backup",
      keep: true,
    },
  ]

  const newDomains = [
    {
      name: "torneolanegrita.xyz",
      status: "Por agregar",
      type: "Custom Domain",
      purpose: "Dominio personalizado principal",
      priority: "PRINCIPAL",
    },
    {
      name: "www.torneolanegrita.xyz",
      status: "Por agregar",
      type: "Custom Domain",
      purpose: "Versión con www",
      priority: "SECUNDARIO",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-500 rounded-full">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Agregar Dominio Personalizado</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantén tus dominios actuales y agrega torneolanegrita.xyz como dominio principal
          </p>
        </div>

        {/* Estado Actual */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Eye className="w-5 h-5" />
              Tu Configuración Actual (Perfecta)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <Image
                src="/images/vercel-domains-current.png"
                alt="Dominios actuales en Vercel"
                width={800}
                height={200}
                className="w-full rounded border"
              />
            </div>

            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>✅ Excelente:</strong> Tus dominios actuales están funcionando perfectamente. NO los elimines.
                Vamos a agregar tu dominio personalizado junto a estos.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDomains.map((domain, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {domain.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800">{domain.name}</h3>
                  <p className="text-xs text-green-600 font-medium">{domain.status}</p>
                  <p className="text-xs text-gray-600 mt-1">{domain.purpose}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800 text-xs">MANTENER</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendación */}
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Zap className="w-5 h-5" />
              Mi Recomendación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-bold text-lg text-orange-800 mb-3">
                ✅ MANTENER todo y AGREGAR tu dominio personalizado
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">✅ Ventajas de mantener los actuales:</h4>
                  <ul className="text-sm space-y-1 text-green-600">
                    <li>• Siempre tendrás URLs de respaldo</li>
                    <li>• Útiles para pruebas y desarrollo</li>
                    <li>• No pierdes el trabajo ya hecho</li>
                    <li>• Cero riesgo de romper algo</li>
                    <li>• Múltiples formas de acceder</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700">🚀 Beneficios del dominio personalizado:</h4>
                  <ul className="text-sm space-y-1 text-blue-600">
                    <li>• Imagen más profesional</li>
                    <li>• Fácil de recordar y compartir</li>
                    <li>• Mejor para marketing</li>
                    <li>• Control total del dominio</li>
                    <li>• Perfecto para el torneo</li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Estrategia recomendada:</strong> Agrega torneolanegrita.xyz como dominio principal, pero
                mantén los otros como backup. Así tienes lo mejor de ambos mundos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Plan de Acción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Plan de Acción (Simple y Seguro)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Pasos a seguir:</h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong>NO toques</strong> los dominios actuales (déjalos como están)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Haz clic en <strong>"Add Domain"</strong> en la misma página
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Agrega <strong>torneolanegrita.xyz</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    Agrega <strong>www.torneolanegrita.xyz</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    5
                  </span>
                  <div>Configura DNS en GoDaddy (como te expliqué antes)</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    6
                  </span>
                  <div>Actualiza NEXT_PUBLIC_APP_URL a https://torneolanegrita.xyz</div>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">Dominios a agregar:</h4>
                {newDomains.map((domain, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Plus className="w-3 h-3 text-green-600" />
                      <code className="bg-white px-2 py-1 rounded border text-sm font-mono">{domain.name}</code>
                      <Badge variant={domain.priority === "PRINCIPAL" ? "default" : "secondary"} className="text-xs">
                        {domain.priority}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(domain.name, domain.name)}
                      className="w-full mt-1"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copied === domain.name ? "¡Copiado!" : "Copiar"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-700 mb-2">Variable a actualizar:</h4>
                <div className="space-y-2">
                  <Label className="text-xs text-yellow-600">NEXT_PUBLIC_APP_URL</Label>
                  <code className="block bg-white px-3 py-2 rounded border font-mono text-sm">
                    https://torneolanegrita.xyz
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("https://torneolanegrita.xyz", "URL Variable")}
                    className="w-full"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copied === "URL Variable" ? "¡Copiado!" : "Copiar URL"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultado Final */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Resultado Final (Lo que tendrás)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-green-800 mb-3">Todos estos dominios funcionando:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">🎯 Dominios Principales (Nuevos):</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-green-600" />
                      <code className="bg-green-100 px-2 py-1 rounded text-xs">https://torneolanegrita.xyz</code>
                      <Badge className="text-xs bg-green-600">PRINCIPAL</Badge>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-green-600" />
                      <code className="bg-green-100 px-2 py-1 rounded text-xs">https://www.torneolanegrita.xyz</code>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-blue-700 mb-2">🔧 Dominios de Respaldo (Actuales):</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-blue-600" />
                      <code className="bg-blue-100 px-2 py-1 rounded text-xs">lanegritacroc.vercel.app</code>
                      <Badge variant="outline" className="text-xs">
                        BACKUP
                      </Badge>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-blue-600" />
                      <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                        v0-bowling-tournament-sooty.vercel.app
                      </code>
                      <Badge variant="outline" className="text-xs">
                        DEV
                      </Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert className="border-green-500 bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>🎉 Perfecto:</strong> Tendrás 4 dominios funcionando. Los usuarios usarán torneolanegrita.xyz
                (profesional), pero siempre tendrás los otros como respaldo para desarrollo y emergencias.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Mantén lo que funciona y agrega lo que necesitas 🚀</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <Plus className="w-5 h-5 mr-2" />
                Agregar Dominio en Vercel
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://sso.godaddy.com" target="_blank" rel="noopener noreferrer">
                <Settings className="w-5 h-5 mr-2" />
                Configurar DNS en GoDaddy
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
