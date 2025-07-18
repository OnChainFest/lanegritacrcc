"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Copy, Terminal, AlertTriangle, GitBranch } from "lucide-react"

export default function GitConflictFix() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, commandName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandName)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const commands = [
    {
      name: "pull",
      command: "git pull origin main",
      description: "Descargar cambios de GitHub",
    },
    {
      name: "add",
      command: "git add .",
      description: "Agregar todos los cambios",
    },
    {
      name: "commit",
      command: 'git commit -m "fix: resolver conflictos y actualizar dependencias"',
      description: "Crear commit con los cambios",
    },
    {
      name: "push",
      command: "git push origin main",
      description: "Subir cambios a GitHub",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GitBranch className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Resolver Conflicto Git</h1>
          </div>
          <p className="text-lg text-gray-600">
            Solución para el error: "Updates were rejected because the remote contains work..."
          </p>
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Problema:</strong> GitHub tiene un README.md que tu versión local no tiene. Necesitas sincronizar
            antes de hacer push.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Solución Paso a Paso
            </CardTitle>
            <CardDescription>Ejecuta estos comandos en orden en tu terminal de VSCode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {commands.map((cmd, index) => (
              <div key={cmd.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{cmd.description}</p>
                  <code className="text-sm bg-gray-800 text-green-400 px-3 py-1 rounded mt-1 block font-mono">
                    {cmd.command}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(cmd.command, cmd.name)}
                  className="flex items-center gap-2"
                >
                  {copiedCommand === cmd.name ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedCommand === cmd.name ? "Copiado" : "Copiar"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Qué está pasando?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">❌ Tu versión local:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• package.json (modificado)</li>
                  <li>• package-lock.json (nuevo)</li>
                  <li>• Sin README.md</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">✅ GitHub tiene:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• README.md (agregado por ManuelJG1999)</li>
                  <li>• package.json (versión anterior)</li>
                  <li>• package-lock.json (no existe)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Después del git pull:</strong> Tendrás tanto el README.md como tus correcciones de seguridad. Git
            automáticamente combinará los cambios.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Verificación Final</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Después de ejecutar todos los comandos, verifica que todo esté correcto:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">GitHub muestra tus cambios de seguridad</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">README.md está presente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Vercel hace deploy automático</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
