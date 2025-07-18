"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, RefreshCw, Database, Users, TestTube, Activity, AlertTriangle } from "lucide-react"

interface DebugInfo {
  timestamp: string
  environment: string
  supabase: {
    url: boolean
    key: boolean
    urlValue: string
  }
  connection: {
    success: boolean
    error?: string
    data?: any
  } | null
  tableAccess: {
    success: boolean
    count?: number
    hasData?: boolean
    error?: string
  } | null
  sampleData?: any[]
}

export default function DebugProductionPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const runDebug = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔧 Running debug check...")

      const response = await fetch("/api/debug-registration", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("🔧 Debug response:", data)

      setDebugInfo(data)

      if (data.connection?.success) {
        toast({
          title: "✅ Conexión exitosa",
          description: "La base de datos está funcionando correctamente",
        })
      } else {
        toast({
          title: "❌ Error de conexión",
          description: data.connection?.error || "No se pudo conectar a la base de datos",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Debug error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: `No se pudo ejecutar el diagnóstico: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runTestRegistration = async () => {
    setTestLoading(true)
    try {
      console.log("🧪 Running test registration...")

      const response = await fetch("/api/debug-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("🧪 Test result:", result)

      if (result.success) {
        toast({
          title: "✅ Prueba exitosa",
          description: "El registro de prueba funcionó correctamente",
        })
        // Refresh debug info
        await runDebug()
      } else {
        toast({
          title: "❌ Prueba fallida",
          description: result.error || "La prueba de registro falló",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Test error:", error)
      toast({
        title: "Error",
        description: `No se pudo ejecutar la prueba: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setTestLoading(false)
    }
  }

  useEffect(() => {
    runDebug()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Diagnóstico de Producción - Torneo La Negrita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={runDebug} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Diagnosticando...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Ejecutar Diagnóstico
                  </>
                )}
              </Button>

              <Button
                onClick={runTestRegistration}
                disabled={testLoading || !debugInfo?.connection?.success}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
              >
                {testLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Probar Registro
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-medium">Error de Diagnóstico</span>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {debugInfo && (
          <>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">Entorno:</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {debugInfo.environment || "unknown"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">URL Supabase:</span>
                    {debugInfo.supabase?.url ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">API Key:</span>
                    {debugInfo.supabase?.key ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>

                {debugInfo.supabase?.urlValue && (
                  <div className="text-xs text-slate-500">URL: {debugInfo.supabase.urlValue}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Conexión a Base de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {debugInfo.connection?.success ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Conexión exitosa</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Error de conexión</span>
                    </>
                  )}
                </div>

                {debugInfo.connection?.error && (
                  <div className="bg-red-900/20 border border-red-700 rounded p-3">
                    <p className="text-red-300 text-sm">{debugInfo.connection.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Acceso a Tabla de Jugadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {debugInfo.tableAccess?.success ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Acceso exitoso</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        <Users className="w-3 h-3 mr-1" />
                        {debugInfo.tableAccess.count || 0} registros
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Error de acceso</span>
                    </>
                  )}
                </div>

                {debugInfo.tableAccess?.error && (
                  <div className="bg-red-900/20 border border-red-700 rounded p-3">
                    <p className="text-red-300 text-sm">{debugInfo.tableAccess.error}</p>
                  </div>
                )}

                {debugInfo.sampleData && debugInfo.sampleData.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-slate-300 font-medium mb-2">Últimos registros:</h4>
                    <div className="space-y-2">
                      {debugInfo.sampleData.map((player, index) => (
                        <div key={index} className="bg-slate-700/50 rounded p-2 text-sm">
                          <div className="text-white">{player.name}</div>
                          <div className="text-slate-400">{player.email}</div>
                          <div className="text-slate-500 text-xs">
                            {player.created_at ? new Date(player.created_at).toLocaleString() : "No date"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Información de Diagnóstico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400">
                  Última actualización:{" "}
                  {debugInfo.timestamp ? new Date(debugInfo.timestamp).toLocaleString() : "No disponible"}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!debugInfo && !loading && !error && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <p className="text-slate-400">Haz clic en "Ejecutar Diagnóstico" para comenzar</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
