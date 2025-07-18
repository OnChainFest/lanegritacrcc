"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, GitBranch, Upload, Eye } from "lucide-react"
import { useState } from "react"

export default function SecurityUpdateGuide() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Agregar Archivos Modificados",
      command: "git add package.json package-lock.json",
      description: "Incluye tanto el package.json modificado como el nuevo package-lock.json",
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      title: "Crear Commit de Seguridad",
      command: 'git commit -m "fix: corregir vulnerabilidades críticas de seguridad (npm audit fix)"',
      description: "Documenta claramente que es una corrección de seguridad",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Subir Cambios a GitHub",
      command: "git push origin main",
      description: "Actualiza el repositorio remoto con las correcciones",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      title: "Verificar Actualización",
      command: "npm audit",
      description: "Confirma que no quedan vulnerabilidades",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Actualización de Seguridad</h1>
          </div>
          <p className="text-lg text-gray-600">
            Guía paso a paso para actualizar tu repositorio con las correcciones de seguridad
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Estado Actual de Git
            </CardTitle>
            <CardDescription>Tu git status muestra estos cambios pendientes:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-blue-400">On branch main</div>
              <div className="text-blue-400">Your branch is up to date with 'origin/main'.</div>
              <br />
              <div className="text-yellow-400">Changes not staged for commit:</div>
              <div className="ml-4 text-red-400">modified: package.json</div>
              <br />
              <div className="text-yellow-400">Untracked files:</div>
              <div className="ml-4 text-red-400">package-lock.json</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`transition-all duration-300 ${
                currentStep === index ? "ring-2 ring-green-500 shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step.icon}
                  Paso {index + 1}: {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm flex-1">
                    {step.command}
                  </div>
                  <Button onClick={() => copyToClipboard(step.command)} variant="outline" size="sm">
                    Copiar
                  </Button>
                </div>
                <Button onClick={() => setCurrentStep(index + 1)} className="w-full" disabled={currentStep > index}>
                  {currentStep > index ? "✅ Completado" : "Marcar como Completado"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {currentStep >= steps.length && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                ¡Actualización Completada!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-green-700">
                <p>✅ Vulnerabilidades de seguridad corregidas</p>
                <p>✅ Repositorio GitHub actualizado</p>
                <p>✅ Vercel implementará automáticamente la versión segura</p>
                <p>✅ Todos los colaboradores tendrán acceso a las correcciones</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>¿Qué Pasará Después?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-600">
              <p>
                • <strong>Vercel</strong> detectará automáticamente los cambios y iniciará un nuevo deploy
              </p>
              <p>
                • <strong>GitHub</strong> mostrará tu commit de seguridad en el historial
              </p>
              <p>
                • <strong>Tu aplicación</strong> seguirá funcionando normalmente, pero más segura
              </p>
              <p>
                • <strong>Otros desarrolladores</strong> podrán obtener las correcciones con git pull
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
