"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"

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
    error?: string
    count?: number
    hasData?: boolean
  } | null
  sampleData: any[]
}

export default function DebugProductionPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/debug-registration", {
        method: "GET",
        cache: "no-cache",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (err: any) {
      console.error("Debug fetch error:", err)
      setError(err.message || "Failed to fetch debug info")
    } finally {
      setLoading(false)
    }
  }

  const runTestRegistration = async () => {
    try {
      setTestLoading(true)
      setTestResult(null)

      const response = await fetch("/api/debug-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      setTestResult(result)
    } catch (err: any) {
      console.error("Test registration error:", err)
      setTestResult({
        success: false,
        error: "Test failed",
        details: err.message,
      })
    } finally {
      setTestLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white">Cargando información del sistema...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-red-900/20 border-red-500">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error de conexión</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <Button onClick={fetchDebugInfo} className="bg-red-600 hover:bg-red-700">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Debug de Producción</h1>
          <p className="text-slate-400">Estado del sistema de registro del torneo</p>
          <Button onClick={fetchDebugInfo} variant="outline" className="mt-4 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Environment Info */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Información del Entorno</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Entorno:</strong> {debugInfo?.environment || "unknown"}
              </div>
              <div>
                <strong>Timestamp:</strong> {debugInfo?.timestamp || "unknown"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Configuration */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${debugInfo?.supabase?.url && debugInfo?.supabase?.key ? "bg-green-500" : "bg-red-500"}`}
              />
              Configuración de Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {debugInfo?.supabase?.url ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-slate-300">URL: {debugInfo?.supabase?.url ? "Configurada" : "Faltante"}</span>
            </div>
            <div className="flex items-center gap-2">
              {debugInfo?.supabase?.key ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-slate-300">API Key: {debugInfo?.supabase?.key ? "Configurada" : "Faltante"}</span>
            </div>
            {debugInfo?.supabase?.urlValue && (
              <div className="text-sm text-slate-400">URL Preview: {debugInfo.supabase.urlValue}</div>
            )}
          </CardContent>
        </Card>

        {/* Database Connection */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${debugInfo?.connection?.success ? "bg-green-500" : "bg-red-500"}`}
              />
              Conexión a Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debugInfo?.connection?.success ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Conexión exitosa</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>Error de conexión</span>
                </div>
                {debugInfo?.connection?.error && (
                  <div className="bg-red-900/20 border border-red-500 rounded p-3">
                    <p className="text-red-300 text-sm">{debugInfo.connection.error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table Access */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${debugInfo?.tableAccess?.success ? "bg-green-500" : "bg-red-500"}`}
              />
              Acceso a Tabla de Jugadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debugInfo?.tableAccess?.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Acceso exitoso</span>
                </div>
                <div className="text-slate-300">
                  <p>Jugadores registrados: {debugInfo.tableAccess.count || 0}</p>
                  <p>Tiene datos: {debugInfo.tableAccess.hasData ? "Sí" : "No"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>Error de acceso</span>
                </div>
                {debugInfo?.tableAccess?.error && (
                  <div className="bg-red-900/20 border border-red-500 rounded p-3">
                    <p className="text-red-300 text-sm">{debugInfo.tableAccess.error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Data */}
        {debugInfo?.sampleData && debugInfo.sampleData.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Datos de Muestra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {debugInfo.sampleData.map((player, index) => (
                  <div key={index} className="bg-slate-700 rounded p-3">
                    <div className="text-slate-300">
                      <p>
                        <strong>Nombre:</strong> {player.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {player.email}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {new Date(player.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Registration */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Prueba de Registro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTestRegistration} disabled={testLoading} className="bg-blue-600 hover:bg-blue-700">
              {testLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                "Ejecutar Prueba de Registro"
              )}
            </Button>

            {testResult && (
              <div
                className={`border rounded p-3 ${testResult.success ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={testResult.success ? "text-green-400" : "text-red-400"}>
                    {testResult.success ? "Prueba exitosa" : "Prueba fallida"}
                  </span>
                </div>
                {testResult.error && <p className="text-red-300 text-sm">{testResult.error}</p>}
                {testResult.details && <p className="text-slate-400 text-sm">{testResult.details}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
