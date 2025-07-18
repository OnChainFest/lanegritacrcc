"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Github, Settings, GitBranch, ArrowRight, ExternalLink } from "lucide-react"

export default function VercelGitHubSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Conectar desde Vercel",
      description: "Vercel creará automáticamente el repositorio",
      status: "active",
    },
    {
      id: 2,
      title: "Cambiar nombre del repositorio",
      description: "Renombrar a 'lanegritacrcc' en GitHub",
      status: "pending",
    },
    {
      id: 3,
      title: "Verificar conexión",
      description: "Confirmar que todo funciona correctamente",
      status: "pending",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Github className="h-8 w-8 text-gray-800" />
            <ArrowRight className="h-6 w-6 text-gray-400" />
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-sm font-bold">
              ▲
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Vercel → GitHub</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conecta tu proyecto desde Vercel y después renómbralo a "lanegritacrcc"
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Proceso de Conexión</CardTitle>
            <CardDescription>Sigue estos pasos en orden para conectar GitHub sin errores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {step.id === currentStep && <Badge variant="default">Paso Actual</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Connect from Vercel */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-sm font-bold">
                ▲
              </div>
              Paso 1: Conectar desde Vercel
            </CardTitle>
            <CardDescription className="text-blue-700">
              Vercel creará automáticamente el repositorio en GitHub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border space-y-3">
              <h4 className="font-semibold text-gray-900">Instrucciones detalladas:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Ve a tu{" "}
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Vercel Dashboard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Selecciona tu proyecto del torneo</li>
                <li>
                  Ve a <strong>Settings</strong> → <strong>Git</strong>
                </li>
                <li>
                  Haz clic en <strong>"Connect Git Repository"</strong>
                </li>
                <li>
                  Selecciona <strong>GitHub</strong> como proveedor
                </li>
                <li>Autoriza la conexión si es necesario</li>
                <li>Vercel creará automáticamente un repositorio con el nombre de tu proyecto</li>
              </ol>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Ventaja:</strong> Vercel sube automáticamente todo tu código sin errores de permisos. No
                necesitas usar comandos Git manualmente.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button asChild>
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <div className="w-4 h-4 bg-white text-black rounded flex items-center justify-center text-xs font-bold mr-2">
                    ▲
                  </div>
                  Ir a Vercel Dashboard
                </a>
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Completé este paso
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Rename Repository */}
        {currentStep >= 2 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Github className="h-5 w-5" />
                Paso 2: Cambiar Nombre a "lanegritacrcc"
              </CardTitle>
              <CardDescription className="text-orange-700">
                Renombra el repositorio en GitHub para que tenga el nombre que quieres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border space-y-3">
                <h4 className="font-semibold text-gray-900">Cómo cambiar el nombre:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>
                    Ve a tu repositorio en{" "}
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    Haz clic en la pestaña <strong>"Settings"</strong> del repositorio
                  </li>
                  <li>
                    Baja hasta la sección <strong>"Repository name"</strong>
                  </li>
                  <li>
                    Cambia el nombre a: <code className="bg-gray-100 px-2 py-1 rounded">lanegritacrcc</code>
                  </li>
                  <li>
                    Haz clic en <strong>"Rename"</strong>
                  </li>
                  <li>Confirma el cambio</li>
                </ol>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Settings className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Importante:</strong> Vercel se actualizará automáticamente con el nuevo nombre. No necesitas
                  reconfigurar nada.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Ir a GitHub
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Cambié el nombre
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verify Connection */}
        {currentStep >= 3 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Paso 3: Verificar que Todo Funciona
              </CardTitle>
              <CardDescription className="text-green-700">
                Confirma que la conexión GitHub ↔ Vercel funciona correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border space-y-3">
                <h4 className="font-semibold text-gray-900">Verificaciones:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-700">✅ En GitHub deberías ver:</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Repositorio llamado "lanegritacrcc"</li>
                      <li>• Todas las carpetas del proyecto</li>
                      <li>• Archivos como package.json</li>
                      <li>• NO archivos .env (protegidos)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-700">✅ En Vercel deberías ver:</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Conexión con GitHub activa</li>
                      <li>• Deploy automático habilitado</li>
                      <li>• Tu aplicación funcionando igual</li>
                      <li>• Panel admin accesible</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>¡Perfecto!</strong> Ahora cada cambio que hagas en GitHub se desplegará automáticamente en
                  Vercel. Tu aplicación del torneo está completamente respaldada.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              Beneficios de esta Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">🚀 Deploy Automático</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Cambios en GitHub → Deploy automático</li>
                  <li>• No necesitas comandos manuales</li>
                  <li>• Historial completo de versiones</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">🔒 Seguridad Total</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Credenciales protegidas en Vercel</li>
                  <li>• Código respaldado en GitHub</li>
                  <li>• Base de datos intacta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Status */}
        {currentStep >= 3 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <h3 className="text-2xl font-bold text-green-800">¡Configuración Completa!</h3>
                <p className="text-green-700 max-w-md mx-auto">
                  Tu proyecto "lanegritacrcc" está ahora conectado entre Vercel y GitHub. Todo funciona automáticamente.
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <Button asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      Ver en GitHub
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                      Ver en Vercel
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
