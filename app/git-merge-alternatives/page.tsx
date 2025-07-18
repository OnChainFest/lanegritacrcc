"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Copy, Terminal, AlertTriangle } from "lucide-react"

export default function GitMergeAlternativesPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, commandName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandName)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Editor Git Alternativo</h1>
          </div>
          <p className="text-lg text-gray-600">Ctrl+X no funciona - Probemos otras opciones</p>
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Diferentes editores:</strong> Git puede usar nano, vim, o VSCode como editor. Cada uno tiene
            comandos diferentes.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Opción 1: Editor Vim (Más Común)
            </CardTitle>
            <CardDescription>Si ves texto con colores y ":" en la parte inferior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <p className="mb-2">En Vim:</p>
              <div className="space-y-2">
                <p>
                  1. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Esc</kbd> (para salir del modo edición)
                </p>
                <p>
                  2. Escribe <kbd className="bg-gray-700 px-2 py-1 rounded">:wq</kbd> (dos puntos, w, q)
                </p>
                <p>
                  3. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 text-green-400 px-3 py-2 rounded font-mono text-sm">:wq</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(":wq", "vim-command")}>
                {copiedCommand === "vim-command" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Opción 2: Editor Nano
            </CardTitle>
            <CardDescription>Si ves comandos como ^X en la parte inferior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <p className="mb-2">En Nano:</p>
              <div className="space-y-2">
                <p>
                  1. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl + O</kbd> (para escribir)
                </p>
                <p>
                  2. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd> (para confirmar)
                </p>
                <p>
                  3. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl + X</kbd> (para salir)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Opción 3: VSCode como Editor
            </CardTitle>
            <CardDescription>Si se abrió VSCode con un archivo temporal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <p className="mb-2">En VSCode:</p>
              <div className="space-y-2">
                <p>1. Deja el mensaje como está (o escribe uno nuevo)</p>
                <p>
                  2. Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl + S</kbd> (para guardar)
                </p>
                <p>3. Cierra la pestaña o VSCode</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Opción 4: Cancelar y Usar Comando Directo
            </CardTitle>
            <CardDescription>Si nada funciona, cancela y usa un comando más simple</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-900 text-red-200 p-4 rounded font-mono text-sm">
              <p className="mb-2">Para cancelar el merge actual:</p>
              <div className="space-y-2">
                <p>
                  1. Presiona <kbd className="bg-red-700 px-2 py-1 rounded">Ctrl + C</kbd> (para cancelar)
                </p>
                <p>2. Si no funciona, cierra la terminal completamente</p>
                <p>3. Abre nueva terminal y ejecuta:</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1">
                  git merge --abort
                </code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard("git merge --abort", "abort-merge")}>
                  {copiedCommand === "abort-merge" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <p className="text-sm text-gray-600">Luego ejecuta:</p>

              <div className="flex items-center gap-2">
                <code className="bg-gray-800 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1">
                  git pull origin main --no-edit
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("git pull origin main --no-edit", "pull-no-edit")}
                >
                  {copiedCommand === "pull-no-edit" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Qué Editor Tienes?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">Para identificar tu editor, mira la pantalla:</p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded p-3">
                  <h4 className="font-semibold text-blue-600 mb-2">Vim</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Texto con colores</li>
                    <li>• ":" en la parte inferior</li>
                    <li>• Modo comando/inserción</li>
                  </ul>
                </div>

                <div className="border rounded p-3">
                  <h4 className="font-semibold text-green-600 mb-2">Nano</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ^X, ^O en la parte inferior</li>
                    <li>• Comandos con Ctrl</li>
                    <li>• Interfaz simple</li>
                  </ul>
                </div>

                <div className="border rounded p-3">
                  <h4 className="font-semibold text-purple-600 mb-2">VSCode</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Se abre VSCode</li>
                    <li>• Archivo temporal</li>
                    <li>• Interfaz gráfica</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Después de completar el merge:</strong> Ejecuta <code>git push origin main</code> para subir todos
            los cambios.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
