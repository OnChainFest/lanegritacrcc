"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SimpleLoginTestPage() {
  const [credentials, setCredentials] = useState({
    username: "admin",
    password: "TorneoLaNegrita2025!",
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log("🔍 Testing login with:", credentials)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log("📦 Response data:", data)

      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (data.success) {
        alert("✅ ¡Login exitoso! Revisa la consola para más detalles.")

        // Intentar ir al admin
        setTimeout(() => {
          window.location.href = "/admin"
        }, 2000)
      }
    } catch (error) {
      console.error("❌ Error:", error)
      setResult({
        error: error.message,
        stack: error.stack,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Prueba Simple de Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Usuario</Label>
              <Input
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>

            <Button onClick={testLogin} disabled={loading} className="w-full">
              {loading ? "Probando..." : "🔐 Probar Login"}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>API:</strong> /api/auth/login
              </p>
              <p>
                <strong>Método:</strong> POST
              </p>
              <p>
                <strong>Credenciales por defecto cargadas</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-2">
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            🔐 Ir a Login Original
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/enhanced-login")}>
            🔐 Ir a Login Mejorado
          </Button>
        </div>
      </div>
    </div>
  )
}
