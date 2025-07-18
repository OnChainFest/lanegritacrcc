"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Settings, Play, ExternalLink } from "lucide-react"

interface SystemStatus {
  success: boolean
  timestamp: string
  status: {
    overall: "READY" | "NEEDS_SETUP"
    environment: {
      total: number
      configured: number
      missing: number
    }
    database: {
      connected: boolean
      tablesWorking: number
      totalTables: number
    }
  }
  details: {
    environment: Record<string, boolean | string>
    supabase: {
      connected: boolean
      error: string | null
      tablesExist: boolean
    }
    tables: Record<string, boolean>
  }
  nextSteps: string[]
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkSystem = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/system-check")
      const data = await response.json()

      if (data.success) {
        setStatus(data)
      } else {
        setError(data.error || "Error desconocido")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystem()
  }, [])

  const getStatusColor = (isReady: boolean) => {
    return isReady ? "text-green-600" : "text-red-600"
  }

  const getStatusIcon = (isReady: boolean) => {
    return isReady ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Verificando sistema...</p>
        </div>
      </div>
    )
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error de Sistema</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={checkSystem}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Estado del Sistema</h1>
            <p className="text-gray-600 mt-2">Verificación completa de la configuración</p>
          </div>
          <Button onClick={checkSystem} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Verificando..." : "Actualizar"}
          </Button>
        </div>

        {status && (
          <>
            {/* Estado General */}
            <Card
              className={`border-l-4 ${
                status.status.overall === "READY" ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {status.status.overall === "READY" ? (
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  )}
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        status.status.overall === "READY" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {status.status.overall === "READY" ? "🎉 Sistema Listo" : "⚠️ Configuración Pendiente"}
                    </h2>
                    <p className="text-gray-600">
                      {status.status.overall === "READY"
                        ? "Tu aplicación está completamente configurada y lista para usar"
                        : "Algunos componentes necesitan configuración adicional"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {status.status.environment.configured}/{status.status.environment.total}
                  </div>
                  <div className="text-sm text-gray-600">Variables de Entorno</div>
                  {status.status.environment.missing > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      {status.status.environment.missing} faltantes
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{status.details.supabase.connected ? "✅" : "❌"}</div>
                  <div className="text-sm text-gray-600">Conexión Supabase</div>
                  <Badge variant={status.details.supabase.connected ? "default" : "destructive"} className="mt-1">
                    {status.details.supabase.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Play className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">
                    {status.status.database.tablesWorking}/{status.status.database.totalTables}
                  </div>
                  <div className="text-sm text-gray-600">Tablas Funcionando</div>
                  {status.status.database.tablesWorking < status.status.database.totalTables && (
                    <Badge variant="destructive" className="mt-1">
                      Incompleto
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detalles de Variables de Entorno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Variables de Entorno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(status.details.environment).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <code className="text-sm font-mono">{key}</code>
                      <div className="flex items-center gap-2">
                        {typeof value === "boolean" ? (
                          value ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )
                        ) : (
                          <Badge variant={value === "NOT_SET" ? "destructive" : "default"}>
                            {value === "NOT_SET" ? "Falta" : value}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detalles de Base de Datos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Conexión a Supabase</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.details.supabase.connected)}
                      <Badge variant={status.details.supabase.connected ? "default" : "destructive"}>
                        {status.details.supabase.connected ? "Conectado" : "Error"}
                      </Badge>
                    </div>
                  </div>

                  {status.details.supabase.error && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error de conexión:</strong> {status.details.supabase.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(status.details.tables).map(([table, exists]) => (
                      <div key={table} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm font-mono">{table}</code>
                        {getStatusIcon(exists)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Pasos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {status.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>

                {status.status.overall === "READY" && (
                  <div className="mt-6 flex gap-4">
                    <Button asChild>
                      <a href="/admin">
                        Ir al Panel de Administración
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/register">
                        Registrar Jugadores
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-500">
              Última verificación: {new Date(status.timestamp).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
