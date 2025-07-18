"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

interface EnvVar {
  required: boolean
  description: string
  example: string
  currentValue: string
}

interface SetupData {
  success: boolean
  timestamp: string
  summary: {
    total: number
    obligatory: number
    optional: number
    missing: number
    set: number
  }
  variables: Record<string, EnvVar>
  categorized: {
    obligatory: [string, EnvVar][]
    optional: [string, EnvVar][]
    missing: [string, EnvVar][]
    set: [string, EnvVar][]
  }
  instructions: {
    vercel: string[]
    supabase: string[]
  }
}

export default function SetupGuidePage() {
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedVar, setCopiedVar] = useState<string | null>(null)

  const loadSetupData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/required-env-vars")
      const data = await response.json()
      setSetupData(data)
    } catch (error) {
      console.error("Error loading setup data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSetupData()
  }, [])

  const copyToClipboard = async (text: string, varName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedVar(varName)
      setTimeout(() => setCopiedVar(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getStatusIcon = (value: string, required: boolean) => {
    if (value === "NOT_SET") {
      return required ? (
        <XCircle className="w-4 h-4 text-red-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
      )
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getStatusBadge = (value: string, required: boolean) => {
    if (value === "NOT_SET") {
      return required ? <Badge variant="destructive">Falta</Badge> : <Badge variant="secondary">Opcional</Badge>
    } else {
      return <Badge variant="default">Configurada</Badge>
    }
  }

  if (!setupData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Guía de Configuración - Variables de Entorno</h1>
            <p className="text-gray-600 mt-2">
              Configura estas variables en Vercel para que tu aplicación funcione correctamente
            </p>
          </div>
          <Button onClick={loadSetupData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{setupData.summary.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{setupData.summary.missing}</div>
              <div className="text-sm text-gray-600">Faltan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{setupData.summary.set}</div>
              <div className="text-sm text-gray-600">Configuradas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{setupData.summary.obligatory}</div>
              <div className="text-sm text-gray-600">Obligatorias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{setupData.summary.optional}</div>
              <div className="text-sm text-gray-600">Opcionales</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta si faltan variables */}
        {setupData.summary.missing > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Atención!</strong> Faltan {setupData.summary.missing} variables obligatorias. Tu aplicación no
              funcionará correctamente hasta que las configures.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="missing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="missing">Faltan ({setupData.summary.missing})</TabsTrigger>
            <TabsTrigger value="obligatory">Obligatorias ({setupData.summary.obligatory})</TabsTrigger>
            <TabsTrigger value="optional">Opcionales ({setupData.summary.optional})</TabsTrigger>
            <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
          </TabsList>

          <TabsContent value="missing" className="space-y-4">
            <h3 className="text-xl font-semibold text-red-600">Variables que faltan</h3>
            {setupData.categorized.missing.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600">¡Perfecto!</h3>
                  <p className="text-gray-600">Todas las variables obligatorias están configuradas.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {setupData.categorized.missing.map(([varName, config]) => (
                  <Card key={varName} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(config.currentValue, config.required)}
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{varName}</code>
                            {getStatusBadge(config.currentValue, config.required)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Ejemplo:</span>
                            <code className="text-xs bg-gray-50 px-2 py-1 rounded border">{config.example}</code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(config.example, varName)}>
                              {copiedVar === varName ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="obligatory" className="space-y-4">
            <h3 className="text-xl font-semibold">Variables obligatorias</h3>
            <div className="grid gap-4">
              {setupData.categorized.obligatory.map(([varName, config]) => (
                <Card key={varName}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(config.currentValue, config.required)}
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{varName}</code>
                          {getStatusBadge(config.currentValue, config.required)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Ejemplo:</span>
                          <code className="text-xs bg-gray-50 px-2 py-1 rounded border">{config.example}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(config.example, varName)}>
                            {copiedVar === varName ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optional" className="space-y-4">
            <h3 className="text-xl font-semibold">Variables opcionales</h3>
            <p className="text-gray-600">
              Estas variables mejoran la funcionalidad pero no son obligatorias para el funcionamiento básico.
            </p>
            <div className="grid gap-4">
              {setupData.categorized.optional.map(([varName, config]) => (
                <Card key={varName}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(config.currentValue, config.required)}
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{varName}</code>
                          {getStatusBadge(config.currentValue, config.required)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Ejemplo:</span>
                          <code className="text-xs bg-gray-50 px-2 py-1 rounded border">{config.example}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(config.example, varName)}>
                            {copiedVar === varName ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Configurar en Vercel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {setupData.instructions.vercel.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Button className="w-full mt-4" asChild>
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                      Ir a Vercel Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Obtener datos de Supabase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {setupData.instructions.supabase.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Button className="w-full mt-4" asChild>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                      Ir a Supabase Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Después de agregar las variables en Vercel, debes hacer un redeploy de tu
                aplicación para que los cambios tomen efecto.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
