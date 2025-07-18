"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react"

export default function DebugAuthPage() {
  const [tests, setTests] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runAuthTests = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: Verificar que la API de login básica funciona
      console.log("🔍 Testing basic login API...")
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "TorneoLaNegrita2025!" }),
        })
        const result = await response.json()
        results.basicLogin = { success: response.ok, data: result, status: response.status }
      } catch (error) {
        results.basicLogin = { success: false, error: error.message }
      }

      // Test 2: Verificar enhanced login
      console.log("🔍 Testing enhanced login API...")
      try {
        const response = await fetch("/api/auth/enhanced-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "TorneoLaNegrita2025!" }),
        })
        const result = await response.json()
        results.enhancedLogin = { success: response.ok, data: result, status: response.status }
      } catch (error) {
        results.enhancedLogin = { success: false, error: error.message }
      }

      // Test 3: Verificar que las rutas existen
      console.log("🔍 Testing route availability...")
      const routes = ["/api/auth/login", "/api/auth/enhanced-login", "/api/auth/verify", "/login", "/enhanced-login"]

      for (const route of routes) {
        try {
          const response = await fetch(route, { method: "GET" })
          results[`route_${route.replace(/[^a-zA-Z0-9]/g, "_")}`] = {
            exists: response.status !== 404,
            status: response.status,
          }
        } catch (error) {
          results[`route_${route.replace(/[^a-zA-Z0-9]/g, "_")}`] = {
            exists: false,
            error: error.message,
          }
        }
      }

      // Test 4: Verificar variables de entorno
      console.log("🔍 Testing environment...")
      results.environment = {
        nodeEnv: typeof window !== "undefined" ? "client" : "server",
        hasJWT: !!process.env.JWT_SECRET,
        hasAdminUser: !!process.env.ADMIN_USERNAME,
      }

      setTests(results)
    } catch (error) {
      console.error("Test error:", error)
      setTests({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testDirectLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: "TorneoLaNegrita2025!",
        }),
      })

      const result = await response.json()
      console.log("Direct login test:", result)

      if (result.success) {
        alert("✅ Login exitoso! Redirigiendo...")
        window.location.href = "/admin"
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Error de conexión: ${error.message}`)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Diagnóstico de Autenticación</h1>
          <p className="text-gray-600">Vamos a revisar por qué no puedes acceder</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button onClick={runAuthTests} disabled={loading} className="h-16">
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Ejecutar Diagnóstico</div>
            </div>
          </Button>

          <Button onClick={testDirectLogin} className="h-16 bg-green-600 hover:bg-green-700">
            <div className="text-center">
              <Eye className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Probar Login Directo</div>
            </div>
          </Button>

          <Button onClick={() => (window.location.href = "/login")} className="h-16 bg-blue-600 hover:bg-blue-700">
            <div className="text-center">
              <div className="text-sm">Ir a Login Original</div>
            </div>
          </Button>
        </div>

        {/* Test Results */}
        {Object.keys(tests).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Resultados del Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Login Test */}
                {tests.basicLogin && (
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">API Login Básica</span>
                      <div className="text-sm text-gray-600">
                        Status: {tests.basicLogin.status} | {tests.basicLogin.data?.message || tests.basicLogin.error}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tests.basicLogin.success)}
                      <Badge variant={tests.basicLogin.success ? "default" : "destructive"}>
                        {tests.basicLogin.success ? "OK" : "ERROR"}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Enhanced Login Test */}
                {tests.enhancedLogin && (
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">API Login Mejorada</span>
                      <div className="text-sm text-gray-600">
                        Status: {tests.enhancedLogin.status} |{" "}
                        {tests.enhancedLogin.data?.message || tests.enhancedLogin.error}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tests.enhancedLogin.success)}
                      <Badge variant={tests.enhancedLogin.success ? "default" : "destructive"}>
                        {tests.enhancedLogin.success ? "OK" : "ERROR"}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Routes Test */}
                {Object.keys(tests)
                  .filter((key) => key.startsWith("route_"))
                  .map((key) => {
                    const route = key.replace("route_", "").replace(/_/g, "/")
                    const test = tests[key]
                    return (
                      <div key={key} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">Ruta: {route}</span>
                          <div className="text-sm text-gray-600">Status: {test.status}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.exists)}
                          <Badge variant={test.exists ? "default" : "destructive"}>
                            {test.exists ? "EXISTE" : "NO EXISTE"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Test Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">🧪 Pruebas Manuales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">1. Probar Login Original:</h4>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm">
                  <strong>URL:</strong> <code>/login</code>
                </p>
                <p className="text-sm">
                  <strong>Usuario:</strong> admin
                </p>
                <p className="text-sm">
                  <strong>Contraseña:</strong> TorneoLaNegrita2025!
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">2. Probar Login Mejorado:</h4>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm">
                  <strong>URL:</strong> <code>/enhanced-login</code>
                </p>
                <p className="text-sm">Mismas credenciales, pero con detección de primer acceso</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">3. Acceso Directo al Admin:</h4>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm">
                  <strong>URL:</strong> <code>/admin</code>
                </p>
                <p className="text-sm">Debería redirigir al login si no estás autenticado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            🔐 Login Original
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/enhanced-login")}>
            🔐 Login Mejorado
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
            👤 Panel Admin
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            🏠 Inicio
          </Button>
        </div>

        {/* Debug Info */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">🔍 Información de Debug:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>URL actual:</strong> {typeof window !== "undefined" ? window.location.href : "N/A"}
              </p>
              <p>
                <strong>Entorno:</strong> {process.env.NODE_ENV || "development"}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date().toISOString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
