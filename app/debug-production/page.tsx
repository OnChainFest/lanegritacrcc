"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Users, TestTube } from "lucide-react"

interface SystemStatus {
  database: {
    status: "success" | "error" | "loading"
    message: string
    details?: string
  }
  players: {
    status: "success" | "error" | "loading"
    count: number
    message: string
  }
  registration: {
    status: "success" | "error" | "loading"
    message: string
    details?: string
  }
}

export default function DebugProductionPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: { status: "loading", message: "Checking..." },
    players: { status: "loading", count: 0, message: "Loading..." },
    registration: { status: "loading", message: "Testing..." },
  })
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    console.log("🔍 Checking system status...")

    // Reset status
    setSystemStatus({
      database: { status: "loading", message: "Checking..." },
      players: { status: "loading", count: 0, message: "Loading..." },
      registration: { status: "loading", message: "Testing..." },
    })

    // Check database connection
    try {
      const dbResponse = await fetch("/api/debug-registration")
      const dbResult = await dbResponse.json()

      setSystemStatus((prev) => ({
        ...prev,
        database: {
          status: dbResult.success ? "success" : "error",
          message: dbResult.success ? "Connected" : "Connection failed",
          details: dbResult.error || dbResult.message,
        },
      }))
    } catch (error: any) {
      setSystemStatus((prev) => ({
        ...prev,
        database: {
          status: "error",
          message: "Connection failed",
          details: error.message,
        },
      }))
    }

    // Check players
    try {
      const playersResponse = await fetch("/api/players")
      const playersResult = await playersResponse.json()

      setSystemStatus((prev) => ({
        ...prev,
        players: {
          status: playersResult.success ? "success" : "error",
          count: playersResult.count || 0,
          message: playersResult.success ? `${playersResult.count || 0} players found` : "Failed to load players",
        },
      }))
    } catch (error: any) {
      setSystemStatus((prev) => ({
        ...prev,
        players: {
          status: "error",
          count: 0,
          message: "Failed to load players",
        },
      }))
    }

    // Test registration endpoint
    try {
      const regResponse = await fetch("/api/register-player")
      const regResult = await regResponse.json()

      setSystemStatus((prev) => ({
        ...prev,
        registration: {
          status: "success",
          message: "Registration endpoint active",
          details: regResult.message,
        },
      }))
    } catch (error: any) {
      setSystemStatus((prev) => ({
        ...prev,
        registration: {
          status: "error",
          message: "Registration endpoint failed",
          details: error.message,
        },
      }))
    }
  }

  const testRegistration = async () => {
    setTesting(true)
    console.log("🧪 Testing registration...")

    try {
      const response = await fetch("/api/debug-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("🧪 Test result:", result)

      if (result.success) {
        alert(`✅ Test registration successful!\nPlayer ID: ${result.player?.id}\nEmail: ${result.player?.email}`)
        // Refresh system status
        checkSystemStatus()
      } else {
        alert(`❌ Test registration failed:\n${result.error}\n${result.details || ""}`)
      }
    } catch (error: any) {
      console.error("Test registration error:", error)
      alert(`❌ Test registration error:\n${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status: "success" | "error" | "loading") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: "success" | "error" | "loading") => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">ERROR</Badge>
      case "loading":
        return <Badge className="bg-blue-100 text-blue-800">LOADING</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sistema de Debug - Producción</h1>
          <p className="text-blue-300">Estado del sistema y pruebas de funcionalidad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Database Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Conexión a Base de Datos
                </div>
                {getStatusBadge(systemStatus.database.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(systemStatus.database.status)}
                <span className="text-slate-300">{systemStatus.database.message}</span>
              </div>
              {systemStatus.database.details && (
                <p className="text-sm text-slate-400">{systemStatus.database.details}</p>
              )}
            </CardContent>
          </Card>

          {/* Players Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Jugadores
                </div>
                {getStatusBadge(systemStatus.players.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(systemStatus.players.status)}
                <span className="text-slate-300">{systemStatus.players.message}</span>
              </div>
              <p className="text-2xl font-bold text-white">{systemStatus.players.count}</p>
            </CardContent>
          </Card>

          {/* Registration Status */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Registro
                </div>
                {getStatusBadge(systemStatus.registration.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(systemStatus.registration.status)}
                <span className="text-slate-300">{systemStatus.registration.message}</span>
              </div>
              {systemStatus.registration.details && (
                <p className="text-sm text-slate-400">{systemStatus.registration.details}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={checkSystemStatus} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Database className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>

          <Button onClick={testRegistration} disabled={testing} className="bg-green-600 hover:bg-green-700 text-white">
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Probar Registro
              </>
            )}
          </Button>

          <Button
            onClick={() => window.open("/admin", "_blank")}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Ver Admin Panel
          </Button>
        </div>

        {/* Environment Info */}
        <Card className="bg-slate-800/90 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-white ml-2">{new Date().toISOString()}</span>
              </div>
              <div>
                <span className="text-slate-400">Environment:</span>
                <span className="text-white ml-2">Production</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
