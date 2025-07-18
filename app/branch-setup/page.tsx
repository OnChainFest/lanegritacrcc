"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, GitBranch, Star, Zap, Trophy } from "lucide-react"

export default function BranchSetupPage() {
  const [copiedBranch, setCopiedBranch] = useState<string | null>(null)

  const copyToClipboard = (text: string, branchName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBranch(branchName)
    setTimeout(() => setCopiedBranch(null), 2000)
  }

  const branchSuggestions = [
    {
      name: "main",
      description: "Rama principal estándar (recomendada)",
      type: "standard",
      icon: <Star className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      name: "torneo-2025",
      description: "Específica para el torneo de este año",
      type: "themed",
      icon: <Trophy className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      name: "la-negrita-main",
      description: "Incluye el nombre del torneo",
      type: "themed",
      icon: <Trophy className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    {
      name: "crcc-production",
      description: "Identifica el club y ambiente",
      type: "professional",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-orange-500",
    },
    {
      name: "bowling-system",
      description: "Describe el tipo de sistema",
      type: "descriptive",
      icon: <GitBranch className="h-4 w-4" />,
      color: "bg-teal-500",
    },
    {
      name: "negrita-crcc-2025",
      description: "Combinación completa",
      type: "complete",
      icon: <Trophy className="h-4 w-4" />,
      color: "bg-red-500",
    },
  ]

  const gitCommands = (branchName: string) => [
    {
      command: `git branch -M ${branchName}`,
      description: "Renombrar rama actual",
    },
    {
      command: `git push -u origin ${branchName}`,
      description: "Subir y establecer como principal",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <GitBranch className="h-8 w-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-900">Nombres de Branch para "lanegritacrcc"</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Elige el nombre perfecto para la rama principal de tu repositorio del torneo
          </p>
        </div>

        {/* Current Default */}
        <Alert className="border-blue-200 bg-blue-50">
          <GitBranch className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Por defecto:</strong> Git y GitHub usan "main" como rama principal. Es la opción más estándar y
            recomendada para la mayoría de proyectos.
          </AlertDescription>
        </Alert>

        {/* Branch Suggestions */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Nombres de Branch</CardTitle>
              <CardDescription>Opciones organizadas por categoría y propósito</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {branchSuggestions.map((branch) => (
                <div key={branch.name} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${branch.color} text-white rounded-full flex items-center justify-center`}
                      >
                        {branch.icon}
                      </div>
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-gray-900">{branch.name}</h3>
                        <p className="text-sm text-gray-600">{branch.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={branch.name === "main" ? "default" : "outline"}>{branch.type}</Badge>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(branch.name, branch.name)}>
                        {copiedBranch === branch.name ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Git Commands for this branch */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Comandos para usar esta rama:</h4>
                    {gitCommands(branch.name).map((cmd, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <code className="bg-gray-900 text-green-400 px-3 py-1 rounded font-mono text-sm flex-1">
                          {cmd.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(cmd.command, `${branch.name}-cmd-${index}`)}
                        >
                          {copiedBranch === `${branch.name}-cmd-${index}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Más Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">1. main</h4>
                <p className="text-sm text-green-600">
                  ✅ Estándar universal
                  <br />✅ Reconocido por todos
                  <br />✅ Compatible con todas las herramientas
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">2. torneo-2025</h4>
                <p className="text-sm text-green-600">
                  ✅ Específico del proyecto
                  <br />✅ Incluye el año
                  <br />✅ Fácil de identificar
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Consideraciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Longitud</h4>
                <p className="text-sm text-orange-600">Nombres cortos son más fáciles de escribir</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Caracteres</h4>
                <p className="text-sm text-orange-600">Usa guiones (-) en lugar de espacios o símbolos especiales</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Consistencia</h4>
                <p className="text-sm text-orange-600">Mantén el mismo estilo si creas más ramas después</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Branch Creator */}
        <Card>
          <CardHeader>
            <CardTitle>Crear Nombre Personalizado</CardTitle>
            <CardDescription>Combina elementos para crear tu propio nombre de rama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Proyecto:</h4>
                <div className="space-y-1">
                  <Badge variant="outline">torneo</Badge>
                  <Badge variant="outline">bowling</Badge>
                  <Badge variant="outline">negrita</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Lugar:</h4>
                <div className="space-y-1">
                  <Badge variant="outline">crcc</Badge>
                  <Badge variant="outline">club</Badge>
                  <Badge variant="outline">country</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Tiempo:</h4>
                <div className="space-y-1">
                  <Badge variant="outline">2025</Badge>
                  <Badge variant="outline">enero</Badge>
                  <Badge variant="outline">current</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Tipo:</h4>
                <div className="space-y-1">
                  <Badge variant="outline">main</Badge>
                  <Badge variant="outline">prod</Badge>
                  <Badge variant="outline">live</Badge>
                </div>
              </div>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>Ejemplos de combinaciones:</strong> torneo-crcc, bowling-2025, negrita-main, crcc-live
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Final Recommendation */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Star className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-800">Recomendación Final</h3>
              <p className="text-blue-700 max-w-md mx-auto">
                Para tu proyecto "lanegritacrcc", recomiendo usar <strong>"main"</strong> como rama principal. Es el
                estándar actual y funcionará perfectamente con Vercel y GitHub.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => copyToClipboard("main", "final-recommendation")}>
                  {copiedBranch === "final-recommendation" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar "main"
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard("torneo-2025", "alternative")}>
                  {copiedBranch === "alternative" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Alternativa: "torneo-2025"
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
