"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, CheckCircle, AlertTriangle, ExternalLink, Copy, Settings, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DomainSetupPage() {
  const [currentDomain, setCurrentDomain] = useState("")
  const [isProduction, setIsProduction] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setCurrentDomain(window.location.hostname)
    setIsProduction(window.location.hostname !== "localhost")
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "✅ Copiado",
      description: "Texto copiado al portapapeles",
      duration: 2000,
    })
  }

  const adminUrls = [
    {
      label: "Panel Principal",
      path: "/admin",
      description: "Dashboard principal con jugadores y estadísticas",
    },
    {
      label: "Login Directo",
      path: "/login",
      description: "Página de inicio de sesión administrativa",
    },
    {
      label: "Registro de Jugadores",
      path: "/register",
      description: "Formulario público de registro",
    },
    {
      label: "Resultados",
      path: "/admin/results",
      description: "Gestión de resultados del torneo",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <Globe className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Configuración de Dominio</h1>
          <p className="text-xl text-slate-300">Guía completa para configurar tu dominio personalizado</p>
        </div>

        {/* Estado Actual */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Estado Actual del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Dominio Actual:</label>
                <div className="flex items-center gap-2">
                  <Badge variant={isProduction ? "default" : "secondary"} className="font-mono">
                    {currentDomain}
                  </Badge>
                  {isProduction ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Entorno:</label>
                <Badge variant={isProduction ? "default" : "outline"}>
                  {isProduction ? "Producción" : "Desarrollo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceso Admin */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              Acceso Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                <strong>✅ Sí, podrás acceder al admin con tu dominio personalizado.</strong>
                <br />
                El sistema de autenticación funciona independientemente del dominio.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">URLs de Acceso Admin:</h4>
              {adminUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-white">{url.label}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{url.description}</p>
                    <code className="text-xs text-blue-300 bg-slate-800/50 px-2 py-1 rounded mt-2 inline-block">
                      {currentDomain === "localhost" ? "localhost:3000" : currentDomain}
                      {url.path}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`https://${currentDomain}${url.path}`)}
                      className="bg-slate-600/50 border-slate-500 text-slate-300 hover:bg-slate-500"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(url.path, "_blank")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credenciales */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5" />
              Credenciales de Acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <AlertTriangle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Las credenciales de admin funcionarán igual con el dominio personalizado.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Credenciales Actuales:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Usuario:</span>
                    <code className="text-green-300 bg-slate-800/50 px-2 py-1 rounded">admin</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Contraseña:</span>
                    <code className="text-green-300 bg-slate-800/50 px-2 py-1 rounded">admin123</code>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                <h4 className="font-semibold text-amber-300 mb-2">⚠️ Recomendación:</h4>
                <p className="text-sm text-amber-200">
                  Cambia las credenciales por defecto antes de usar el dominio en producción.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pasos para Configurar Dominio */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5" />
              Pasos para Configurar Dominio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Comprar Dominio",
                  description: "Adquiere un dominio en Namecheap, Cloudflare, o Google Domains",
                  cost: "$8-15/año",
                },
                {
                  step: 2,
                  title: "Agregar en Vercel",
                  description: "Ve a Settings → Domains en tu proyecto de Vercel",
                  cost: "Gratis",
                },
                {
                  step: 3,
                  title: "Configurar DNS",
                  description: "Agrega registros A y CNAME en tu proveedor de dominio",
                  cost: "Gratis",
                },
                {
                  step: 4,
                  title: "Actualizar Variables",
                  description: "Cambia NEXT_PUBLIC_APP_URL a tu nuevo dominio",
                  cost: "Gratis",
                },
                {
                  step: 5,
                  title: "Verificar Acceso",
                  description: "Prueba todas las URLs admin con el nuevo dominio",
                  cost: "Gratis",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-slate-300 text-sm mt-1">{item.description}</p>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {item.cost}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuración DNS */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Configuración DNS Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left p-3 text-slate-300 font-semibold">Tipo</th>
                    <th className="text-left p-3 text-slate-300 font-semibold">Nombre</th>
                    <th className="text-left p-3 text-slate-300 font-semibold">Valor</th>
                    <th className="text-left p-3 text-slate-300 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700">
                    <td className="p-3 text-white font-mono">A</td>
                    <td className="p-3 text-white font-mono">@</td>
                    <td className="p-3 text-blue-300 font-mono">76.76.19.61</td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("76.76.19.61")}
                        className="bg-slate-600/50 border-slate-500 text-slate-300 hover:bg-slate-500"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-mono">CNAME</td>
                    <td className="p-3 text-white font-mono">www</td>
                    <td className="p-3 text-blue-300 font-mono">cname.vercel-dns.com</td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("cname.vercel-dns.com")}
                        className="bg-slate-600/50 border-slate-500 text-slate-300 hover:bg-slate-500"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card className="bg-green-900/20 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-300 text-lg mb-2">
                  ✅ Confirmación: El Admin Funcionará Perfectamente
                </h3>
                <ul className="space-y-2 text-green-200 text-sm">
                  <li>• Las credenciales admin funcionarán igual</li>
                  <li>• Todas las rutas /admin/* estarán disponibles</li>
                  <li>• El sistema de autenticación es independiente del dominio</li>
                  <li>• HTTPS se configurará automáticamente</li>
                  <li>• No necesitas cambiar código, solo variables de entorno</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
