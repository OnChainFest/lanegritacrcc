"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertCircle, Users, Database, Server } from "lucide-react"

interface SystemStatus {
  database: {
    status: "connected" | "error" | "loading"
    error?: string
    playerCount?: number
  }
  api: {
    status: "working" | "error" | "loading"
    error?: string
  }
  registration: {
    status: "working" | "error" | "loading"
    error?: string
    recentCount?: number
  }
}

export default function DebugProductionPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: { status: "loading" },
    api: { status: "loading" },
    registration: { status: "loading" },
  })
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    console.log("🔍 Checking system status...")

    // Reset status
    setSystemStatus({
      database: { status: "loading" },
      api: { status: "loading" },
      registration: { status: "loading" },
    })

    try {
      // Check database connection
      const dbResponse = await fetch("/api/debug-registration")
      const dbResult = await dbResponse.json()

      // Check players API
      const playersResponse = await fetch("/api/players?limit=1")
      const playersResult = await playersResponse.json()

      // Check tournament stats
      const statsResponse = await fetch("/api/tournament-stats")
      const statsResult = await statsResponse.json()

      setSystemStatus({
        database: {
          status: dbResult.success ? "connected" : "error",
          error: dbResult.success ? undefined : dbResult.error,
          playerCount: dbResult.data?.totalPlayers || 0,
        },
        api: {
          status: playersResult.success && statsResult.success ? "working" : "error",
          error: playersResult.success ? undefined : playersResult.error || statsResult.error,
        },
        registration: {
          status: dbResult.success ? "working" : "error",
          error: dbResult.success ? undefined : dbResult.error,
          recentCount: dbResult.data?.recentRegistrations?.length || 0,
        },
      })
    } catch (error: any) {
      console.error("System check error:", error)
      setSystemStatus({
        database: { status: "error", error: error.message },
        api: { status: "error", error: error.message },
        registration: { status: "error", error: error.message },
      })
    }
  }

  const runTestRegistration = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/debug-registration", {
        method: "POST",
      })
      const result = await response.json()
      setTestResult(result)
    } catch (error: any) {
      setTestResult({
        success: false,
        error: "Test failed",
        details: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  const StatusIcon = ({ status }: { status: "connected" | "working" | "error" | "loading" }) => {
    switch (status) {
      case "connected":
      case "working":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const StatusBadge = ({ status }: { status: "connected" | "working" | "error" | "loading" }) => {
    const variants = {
      connected: "bg-green-100 text-green-800",
      working: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      loading: "bg-blue-100 text-blue-800",
    }

    return (
      <Badge className={variants[status]}>
        {status === "connected"
          ? "Conectado"
          : status === "working"
            ? "Funcionando"
            : status === "error"
              ? "Error"
              : "Cargando"}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Debug de Producción</h1>
          <p className="text-xl text-blue-300">Estado del Sistema - Torneo La Negrita 2025</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Database Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Conexión a Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <StatusIcon status={systemStatus.database.status} />
                <StatusBadge status={systemStatus.database.status} />
              </div>
              {systemStatus.database.error && (
                <p className="text-red-400 text-sm mt-2">{systemStatus.database.error}</p>
              )}
              {systemStatus.database.playerCount !== undefined && (
                <p className="text-slate-300 text-sm mt-2">
                  Jugadores registrados: {systemStatus.database.playerCount}
                </p>
              )}
            </CardContent>
          </Card>

          {/* API Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5" />
                APIs del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <StatusIcon status={systemStatus.api.status} />
                <StatusBadge status={systemStatus.api.status} />
              </div>
              {systemStatus.api.error && <p className="text-red-400 text-sm mt-2">{systemStatus.api.error}</p>}
            </CardContent>
          </Card>

          {/* Registration Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Sistema de Registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <StatusIcon status={systemStatus.registration.status} />
                <StatusBadge status={systemStatus.registration.status} />
              </div>
              {systemStatus.registration.error && (
                <p className="text-red-400 text-sm mt-2">{systemStatus.registration.error}</p>
              )}
              {systemStatus.registration.recentCount !== undefined && (
                <p className="text-slate-300 text-sm mt-2">
                  Registros recientes: {systemStatus.registration.recentCount}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Section */}
        <Card className="bg-slate-800/90 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Pruebas del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={checkSystemStatus} className="bg-blue-600 hover:bg-blue-700">
                Verificar Estado
              </Button>
              <Button onClick={runTestRegistration} disabled={testing} className="bg-green-600 hover:bg-green-700">
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  "Probar Registro"
                )}
              </Button>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg ${testResult.success ? "bg-green-900/20 border border-green-700" : "bg-red-900/20 border border-red-700"}`}
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
                {testResult.error && <p className="text-red-400 text-sm">{testResult.error}</p>}
                {testResult.details && <p className="text-slate-400 text-sm mt-1">{testResult.details}</p>}
                {testResult.data && (
                  <p className="text-green-400 text-sm mt-1">Jugador de prueba creado: {testResult.data.name}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Información del Entorno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Entorno:</p>
                <p className="text-white">Producción</p>
              </div>
              <div>
                <p className="text-slate-400">Timestamp:</p>
                <p className="text-white">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
