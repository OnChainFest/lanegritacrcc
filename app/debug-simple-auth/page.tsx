"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, TestTube } from "lucide-react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function DebugSimpleAuthPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [testUsername, setTestUsername] = useState("admin")
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    const results: DiagnosticResult[] = []

    try {
      // Test 1: Verificar ruta de login
      try {
        const loginResponse = await fetch("/api/auth/simple-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true }),
        })
        results.push({
          test: "Ruta de login",
          status: "success",
          message: "API de login accesible",
          details: { status: loginResponse.status },
        })
      } catch (error) {
        results.push({
          test: "Ruta de login",
          status: "error",
          message: "No se puede acceder a la API de login",
          details: error,
        })
      }

      // Test 2: Verificar ruta de verificación
      try {
        const verifyResponse = await fetch("/api/auth/simple-verify")
        const verifyResult = await verifyResponse.json()

        results.push({
          test: "Ruta de verificación",
          status: verifyResponse.ok ? "success" : "warning",
          message: verifyResponse.ok ? "API de verificación accesible" : "API responde con error",
          details: verifyResult,
        })

        if (verifyResult.valid) {
          setSessionInfo(verifyResult.user)
        }
      } catch (error) {
        results.push({
          test: "Ruta de verificación",
          status: "error",
          message: "Error al acceder a la API de verificación",
          details: error,
        })
      }

      // Test 3: Verificar cookies
      const cookies = document.cookie
      const hasSession = cookies.includes("simple-admin-session")
      results.push({
        test: "Estado de cookies",
        status: hasSession ? "warning" : "success",
        message: hasSession ? "Hay una sesión activa" : "No hay sesión activa",
        details: { cookies: cookies || "No cookies" },
      })

      // Test 4: Verificar acceso a admin
      try {
        const adminResponse = await fetch("/admin")
        results.push({
          test: "Acceso a /admin",
          status: adminResponse.ok ? "success" : "warning",
          message: adminResponse.ok ? "Página de admin accesible" : `Respuesta ${adminResponse.status}`,
          details: { status: adminResponse.status },
        })
      } catch (error) {
        results.push({
          test: "Acceso a /admin",
          status: "error",
          message: "Error al acceder a /admin",
          details: error,
        })
      }
    } catch (error) {
      results.push({
        test: "Diagnóstico general",
        status: "error",
        message: "Error durante el diagnóstico",
        details: error,
      })
    }

    setDiagnostics(results)
    setLoading(false)
  }

  const testLogin = async () => {
    if (!testUsername.trim()) {
      alert("Por favor ingresa un usuario")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: testUsername }),
      })

      const result = await response.json()

      if (result.success) {
        alert("¡Login exitoso! Redirigiendo...")
        window.location.href = "/admin"
      } else {
        alert(`Error de login: ${result.error}`)
      }
    } catch (error) {
      alert(`Error de conexión: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const clearSession = async () => {
    try {
      await fetch("/api/auth/simple-logout", { method: "POST" })
      document.cookie = "simple-admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      alert("Sesión limpiada")
      await runDiagnostics()
    } catch (error) {
      alert(`Error al limpiar sesión: ${error}`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Shield className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnóstico de Autenticación Simple</h1>
            <p className="text-gray-600">Herramienta para diagnosticar problemas de acceso</p>
          </div>
        </div>

        {/* Información de sesión */}
        {sessionInfo && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sesión activa:</strong> {sessionInfo.username} - Conectado desde:{" "}
              {new Date(sessionInfo.loginTime).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Acciones rápidas */}
        <div className="flex gap-4">
          <Button onClick={runDiagnostics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Ejecutar Diagnóstico
          </Button>
          <Button onClick={clearSession} variant="outline">
            <XCircle className="w-4 h-4 mr-2" />
            Limpiar Sesión
          </Button>
          <Button onClick={() => (window.location.href = "/admin")} variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Ir a Admin
          </Button>
        </div>

        {/* Test de login */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test de Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                placeholder="Usuario (admin)"
                className="flex-1"
              />
              <Button onClick={testLogin} disabled={loading}>
                <TestTube className="w-4 h-4 mr-2" />
                Probar Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Ejecutando diagnóstico...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diagnostics.map((result, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">{getStatusIcon(result.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{result.test}</h3>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{result.message}</p>
                      {result.details && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600">Ver detalles</summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de ayuda */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Ayuda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Credenciales:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>
                  <strong>Usuario:</strong> admin (solo se requiere usuario)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rutas disponibles:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>
                  <strong>/admin</strong> - Panel de administración
                </li>
                <li>
                  <strong>/api/auth/simple-login</strong> - API de login
                </li>
                <li>
                  <strong>/api/auth/simple-verify</strong> - API de verificación
                </li>
                <li>
                  <strong>/api/auth/simple-logout</strong> - API de logout
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
