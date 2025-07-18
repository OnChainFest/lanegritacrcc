"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, AlertTriangle, Github, Shield, FolderOpen } from "lucide-react"

export default function GitHubSetupPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, commandName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandName)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const mainCommands = [
    {
      name: "init",
      title: "1. Inicializar Git",
      command: "git init",
      description: "Inicializa el repositorio Git en tu proyecto",
    },
    {
      name: "add-specific",
      title: "2. Agregar archivos específicos (SOLUCIÓN)",
      command:
        "git add app/ components/ lib/ public/ scripts/ docs/ package.json tailwind.config.ts next.config.mjs tsconfig.json .gitignore",
      description: "Agrega solo las carpetas y archivos del proyecto",
    },
    {
      name: "commit",
      title: "3. Primer commit",
      command: 'git commit -m "Initial commit: Torneo La Negrita CRCC 2025"',
      description: "Crea el primer commit con tu código",
    },
    {
      name: "remote",
      title: "4. Conectar con GitHub",
      command: "git remote add origin https://github.com/TU-USUARIO/lanegritacrcc.git",
      description: "Reemplaza TU-USUARIO con tu username de GitHub",
    },
    {
      name: "branch",
      title: "5. Configurar rama principal",
      command: "git branch -M main",
      description: "Establece main como rama principal",
    },
    {
      name: "push",
      title: "6. Subir código",
      command: "git push -u origin main",
      description: "Sube tu código a GitHub",
    },
  ]

  const alternativeCommands = [
    {
      name: "add-one-by-one",
      title: "Opción A: Agregar carpeta por carpeta",
      commands: [
        "git add app/",
        "git add components/",
        "git add lib/",
        "git add public/",
        "git add scripts/",
        "git add docs/",
        "git add package.json",
        "git add tailwind.config.ts",
        "git add next.config.mjs",
        "git add tsconfig.json",
        "git add .gitignore",
      ],
      description: "Si el comando largo no funciona, ejecuta estos uno por uno",
    },
    {
      name: "add-essential",
      title: "Opción B: Solo archivos esenciales",
      commands: [
        "git add app/",
        "git add components/",
        "git add lib/",
        "git add public/images/",
        "git add package.json",
      ],
      description: "Versión mínima que incluye lo más importante",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Github className="h-8 w-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-900">Solución: Error de Permisos Git</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comandos alternativos para subir tu proyecto "lanegritacrcc" sin errores de permisos
          </p>
        </div>

        {/* Error Explanation */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Problema:</strong> Windows está bloqueando el acceso a carpetas del sistema.
            <strong> Solución:</strong> Agregar solo las carpetas de tu proyecto, no todo el directorio.
          </AlertDescription>
        </Alert>

        {/* Repository Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Repositorio: lanegritacrcc
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre:</label>
              <code className="bg-gray-100 px-3 py-2 rounded block">lanegritacrcc</code>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción:</label>
              <code className="bg-gray-100 px-3 py-2 rounded block text-xs">
                Sistema de gestión para Torneo de Boliche La Negrita CRCC 2025
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Main Solution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              Solución Principal (Recomendada)
            </CardTitle>
            <CardDescription>Comandos que evitan el error de permisos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainCommands.map((cmd, index) => (
              <div key={cmd.name} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{cmd.title}</h3>
                  <Badge variant={index === 1 ? "default" : "outline"}>{index + 1}</Badge>
                </div>
                <p className="text-sm text-gray-600">{cmd.description}</p>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-900 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1 break-all">
                    {cmd.command}
                  </code>
                  <Button size="sm" onClick={() => copyToClipboard(cmd.command, cmd.name)}>
                    {copiedCommand === cmd.name ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {index === 1 && (
                  <Alert className="border-green-200 bg-green-50 mt-2">
                    <AlertDescription className="text-green-800 text-sm">
                      <strong>Este comando reemplaza "git add ."</strong> - Solo agrega las carpetas de tu proyecto,
                      evitando carpetas del sistema con permisos restringidos.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alternative Solutions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Alternativas si la Solución Principal Falla
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {alternativeCommands.map((alt) => (
              <div key={alt.name} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">{alt.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alt.description}</p>
                </div>
                <div className="space-y-2">
                  {alt.commands.map((cmd, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <code className="bg-gray-900 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1">
                        {cmd}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(cmd, `${alt.name}-${index}`)}>
                        {copiedCommand === `${alt.name}-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* What Gets Uploaded */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              ¿Qué se sube a GitHub?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Se INCLUYE:
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>
                    • <code>app/</code> - Todas las páginas
                  </li>
                  <li>
                    • <code>components/</code> - Componentes React
                  </li>
                  <li>
                    • <code>lib/</code> - Utilidades y servicios
                  </li>
                  <li>
                    • <code>public/images/</code> - Imágenes del torneo
                  </li>
                  <li>
                    • <code>scripts/</code> - Scripts SQL
                  </li>
                  <li>
                    • <code>docs/</code> - Documentación
                  </li>
                  <li>
                    • <code>package.json</code> - Dependencias
                  </li>
                  <li>
                    • <code>tailwind.config.ts</code> - Configuración
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  NO se incluye:
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>
                    • <code>.env</code> - Credenciales (protegido)
                  </li>
                  <li>
                    • <code>node_modules/</code> - Dependencias
                  </li>
                  <li>
                    • <code>.next/</code> - Build temporal
                  </li>
                  <li>
                    • <code>AppData/</code> - Carpetas del sistema
                  </li>
                  <li>• Archivos de Windows con permisos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Guarantee */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold text-green-800">100% Seguro</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-green-800">Base de Datos</div>
                  <div className="text-green-700">Funciona igual</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-800">Credenciales</div>
                  <div className="text-green-700">Protegidas</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-800">Admin Panel</div>
                  <div className="text-green-700">Sin cambios</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              Crear "lanegritacrcc" en GitHub
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              copyToClipboard(
                "git add app/ components/ lib/ public/ scripts/ docs/ package.json tailwind.config.ts next.config.mjs tsconfig.json .gitignore",
                "main-solution",
              )
            }
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedCommand === "main-solution" ? "¡Copiado!" : "Copiar Comando Principal"}
          </Button>
        </div>
      </div>
    </div>
  )
}
