"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Copy, Terminal, GitMerge, Keyboard } from "lucide-react"

export default function GitMergeMessagePage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, commandName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandName)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const mergeMessage = "Merge: combinar README de GitHub con correcciones de seguridad locales"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GitMerge className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Git Merge en Progreso</h1>
          </div>
          <p className="text-lg text-gray-600">Git está esperando que escribas un mensaje para el merge</p>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>¡Perfecto!</strong> El git pull funcionó. Ahora Git está combinando los cambios de GitHub con tus
            cambios locales.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Completar el Merge - Opción 1 (Más Fácil)
            </CardTitle>
            <CardDescription>Usar el mensaje por defecto de Git</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <p className="mb-2">En el editor que se abrió, simplemente:</p>
              <div className="space-y-2">
                <p>
                  1. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl + X</kbd> (para salir)
                </p>
                <p>
                  2. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Y</kbd> (para confirmar)
                </p>
                <p>
                  3. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd> (para guardar)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Completar el Merge - Opción 2 (Personalizado)
            </CardTitle>
            <CardDescription>Escribir tu propio mensaje de merge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Si quieres escribir un mensaje personalizado:</p>

              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium mb-2">1. Borra el texto que aparece</p>
                <p className="font-medium mb-2">2. Escribe este mensaje:</p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-gray-800 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1">
                    {mergeMessage}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(mergeMessage, "merge-message")}>
                    {copiedCommand === "merge-message" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="font-medium mt-2">3. Presiona Ctrl + X, luego Y, luego Enter</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Qué está pasando?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">📥 Cambios de GitHub:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• README.md (nuevo archivo)</li>
                  <li>• Descripción del proyecto</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">🔧 Tus cambios locales:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• package.json (vulnerabilidades corregidas)</li>
                  <li>• package-lock.json (dependencias actualizadas)</li>
                </ul>
              </div>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                Git está combinando ambos cambios automáticamente. ¡No hay conflictos!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Después del Merge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Una vez que completes el merge, continúa con:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded font-mono text-sm">
                  git push origin main
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("git push origin main", "push-command")}
                >
                  {copiedCommand === "push-command" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Resultado final:</strong> Tendrás un repositorio con README.md + correcciones de seguridad + deploy
            automático funcionando.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
