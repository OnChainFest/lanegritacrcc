"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  Globe,
  Users,
  Trophy,
  Settings,
  ExternalLink,
  Copy,
  Shield,
  Database,
  Smartphone,
  GitBranch,
  Zap,
} from "lucide-react"

export default function ProductionReadyPage() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [copied, setCopied] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.origin)
  }, [])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(""), 2000)
  }

  const deploymentInfo = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Auto-Deployment",
      description: "Cada cambio se despliega automáticamente",
      status: "Activo",
    },
    {
      icon: <GitBranch className="w-6 h-6 text-blue-500" />,
      title: "Git Integration",
      description: "Conectado con tu repositorio",
      status: "Configurado",
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "CDN Global",
      description: "Disponible mundialmente",
      status: "Funcionando",
    },
  ]

  const features = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Registro de Jugadores",
      description: "Los jugadores pueden registrarse online",
      url: "/register",
      status: "ready",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Panel de Administración",
      description: "Gestión completa del torneo",
      url: "/admin",
      status: "ready",
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      title: "Sistema de Brackets",
      description: "Visualización de llaves del torneo",
      url: "/brackets",
      status: "ready",
    },
    {
      icon: <Database className="w-6 h-6 text-purple-500" />,
      title: "Resultados en Tiempo Real",
      description: "Seguimiento de puntuaciones y estadísticas",
      url: "/admin/results",
      status: "ready",
    },
  ]

  const productionUrls = [
    {
      name: "Página Principal",
      url: currentUrl,
      description: "Landing page del torneo",
    },
    {
      name: "Registro de Jugadores",
      url: `${currentUrl}/register`,
      description: "Para que los jugadores se inscriban",
    },
    {
      name: "Panel de Admin",
      url: `${currentUrl}/admin`,
      description: "Para gestionar el torneo",
    },
    {
      name: "Brackets",
      url: `${currentUrl}/brackets`,
      description: "Para ver las llaves del torneo",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Globe className="w-12 h-12 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-900">¡Tu App Está en Producción! 🎉</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu aplicación del Torneo La Negrita está completamente configurada y funcionando en Vercel. Los usuarios ya
            pueden acceder desde cualquier dispositivo.
          </p>
        </div>

        {/* Estado de Deployment */}
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-green-700">Deployment Automático Activo</h2>
                <p className="text-green-600">
                  ✅ No necesitas hacer deployment manual
                  <br />✅ Vercel despliega automáticamente cada cambio
                  <br />✅ Tu app está disponible 24/7
                  <br />✅ CDN global para máxima velocidad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Deployment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Estado del Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deploymentInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                  {item.icon}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* URLs de Producción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              URLs de tu Aplicación en Producción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productionUrls.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">{item.url}</code>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.url, item.name)}>
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === item.name ? "¡Copiado!" : "Copiar"}
                  </Button>
                  <Button size="sm" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Abrir
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Funciones Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Funciones Disponibles en Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                  {feature.icon}
                  <div className="flex-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Funcionando
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <a href={feature.url}>
                          Probar <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cómo Funciona el Deployment */}
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo Funciona el Deployment Automático?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full min-w-[24px] text-center">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Cambios Detectados</h3>
                  <p className="text-sm text-gray-600">
                    Cuando haces cambios en v0, se actualiza automáticamente el código
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full min-w-[24px] text-center">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Build Automático</h3>
                  <p className="text-sm text-gray-600">Vercel construye la aplicación automáticamente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full min-w-[24px] text-center">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Deploy Instantáneo</h3>
                  <p className="text-sm text-gray-600">Los cambios se publican en segundos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full min-w-[24px] text-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Disponible Globalmente</h3>
                  <p className="text-sm text-gray-600">Tu app está disponible en todo el mundo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Pasos */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué Puedes Hacer Ahora?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Usar la Aplicación:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Compartir link de registro con jugadores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Gestionar torneo desde panel admin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Configurar brackets y resultados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Monitorear estadísticas en tiempo real</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Mejoras Opcionales:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Agregar dominio personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-500" />
                    <span>Configurar como PWA (app móvil)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Configurar notificaciones por email</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="/admin">
              <Settings className="w-5 h-5 mr-2" />
              Ir al Panel de Admin
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/register">
              <Users className="w-5 h-5 mr-2" />
              Probar Registro
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/brackets">
              <Trophy className="w-5 h-5 mr-2" />
              Ver Brackets
            </a>
          </Button>
        </div>

        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>¡No necesitas hacer deployment!</strong> Vercel maneja todo automáticamente. Cada cambio que hagas
            se despliega en segundos sin intervención manual.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
