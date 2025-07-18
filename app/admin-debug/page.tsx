"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, XCircle, AlertTriangle, Key, User, Clock, RefreshCw, Eye, EyeOff } from "lucide-react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function AdminDebugPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [testCredentials, setTestCredentials] = useState({
    username: "admin",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    const results: DiagnosticResult[] = []

    try {
      // Test 1: Verificar rutas de autenticación
      try {
        const authResponse = await fetch("/api/auth/verify")
        results.push({
          test: "Ruta de verificación",
          status: authResponse.ok ? "success" : "error",
          message: authResponse.ok ? "Ruta /api/auth/verify accesible" : `Error ${authResponse.status}`,
          details: { status: authResponse.status },
        })
      } catch (error) {
        results.push({
          test: "Ruta de verificación",
          status: "error",
          message: "No se puede acceder a /api/auth/verify",
          details: error,
        })
      }

      // Test 2: Verificar cookies existentes
      const cookies = document.cookie
      const hasAdminSession = cookies.includes("admin-session")
      results.push({
        test: "Sesión existente",
        status: hasAdminSession ? "warning" : "success",
        message: hasAdminSession ? "Hay una sesión activa (puede estar expirada)" : "No hay sesión activa",
        details: { cookies: cookies || "No cookies found" },
      })

      // Test 3: Verificar estado de la sesión actual
      if (hasAdminSession) {
        try {
          const verifyResponse = await fetch("/api/auth/verify")
          const verifyResult = await verifyResponse.json()

          results.push({
            test: "Validación de sesión",
            status: verifyResult.valid ? "success" : "error",
            message: verifyResult.valid ? "Sesión válida" : verifyResult.error || "Sesión inválida",
            details: verifyResult,
          })

          if (verifyResult.valid) {
            setSessionInfo(verifyResult.user)
          }
        } catch (error) {
          results.push({
            test: "Validación de sesión",
            status: "error",
            message: "Error al validar sesión",
            details: error,
          })
        }
      }

      // Test 4: Verificar acceso a página de admin
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

      // Test 5: Verificar variables de entorno (lado cliente)
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      results.push({
        test: "Variables de entorno",
        status: hasSupabaseUrl && hasSupabaseKey ? "success" : "error",
        message: `Supabase URL: ${hasSupabaseUrl ? "✓" : "✗"}, Supabase Key: ${hasSupabaseKey ? "✓" : "✗"}`,
        details: {
          NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasSupabaseKey,
        },
      })
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
    if (!testCredentials.username || !testCredentials.password) {
      alert("Por favor ingresa usuario y contraseña")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCredentials),
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
      await fetch("/api/auth/logout", { method: "POST" })
      document.cookie = "admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      alert("Sesión limpiada. Ejecutando diagnóstico nuevamente...")
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
        return <Clock className="w-5 h-5 text-gray-600" />
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
            <h1 className="text-3xl font-bold text-gray-900">Diagnóstico de Acceso Admin</h1>
            <p className="text-gray-600">Herramienta para diagnosticar problemas de autenticación</p>
          </div>
        </div>

        {/* Información de sesión actual */}
        {sessionInfo && (
          <Alert>
            <User className="h-4 w-4" />
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
              <Key className="w-5 h-5" />
              Test de Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Usuario</label>
                <Input
                  value={testCredentials.username}
                  onChange={(e) => setTestCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Ingresa la contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={testLogin} disabled={loading} className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Probar Login
            </Button>
          </CardContent>
        </Card>

        {/* Resultados del diagnóstico */}
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
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Ver detalles</summary>
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
              <h4 className="font-medium mb-2">Credenciales por defecto:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Usuario:</strong> admin
                </li>
                <li>
                  <strong>Contraseña:</strong> TorneoLaNegrita2025!
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rutas disponibles:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  <strong>/login</strong> - Página de login
                </li>
                <li>
                  <strong>/admin</strong> - Panel de administración
                </li>
                <li>
                  <strong>/api/auth/login</strong> - API de login
                </li>
                <li>
                  <strong>/api/auth/verify</strong> - API de verificación
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Problemas comunes:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Sesión expirada - Limpiar sesión y volver a hacer login</li>
                <li>Contraseña incorrecta - Verificar credenciales</li>
                <li>Variables de entorno faltantes - Verificar configuración</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
