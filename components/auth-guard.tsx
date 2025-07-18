"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, Shield, TestTube } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState({ username: "admin", password: "admin123" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const router = useRouter()

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("🔐 AuthGuard: Verificando autenticación...")

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("🔐 AuthGuard: Response status:", response.status)
      console.log("🔐 AuthGuard: Response ok:", response.ok)

      if (!response.ok) {
        console.log("🔐 AuthGuard: Response not ok, setting not authenticated")
        setIsAuthenticated(false)
        setShowLogin(true)
        setIsLoading(false)
        return
      }

      let result: any = null
      try {
        result = await response.json()
        console.log("🔐 AuthGuard: Resultado de verificación:", result)
      } catch (jsonError) {
        console.error("🔐 AuthGuard: Error parsing JSON:", jsonError)
        setIsAuthenticated(false)
        setShowLogin(true)
        setIsLoading(false)
        return
      }

      if (result?.valid && result?.authenticated) {
        console.log("🔐 AuthGuard: Usuario autenticado")
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        console.log("🔐 AuthGuard: Usuario no autenticado")
        setIsAuthenticated(false)
        setShowLogin(true)
      }
    } catch (error) {
      console.error("🔐 AuthGuard: Error verificando autenticación:", error)
      setIsAuthenticated(false)
      setShowLogin(true)
    } finally {
      setIsLoading(false)
    }
  }

  const testCredentials = async () => {
    try {
      console.log("🧪 Testing credentials...")
      const response = await fetch("/api/auth/test-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()
      setTestResult(result)
      console.log("🧪 Test result:", result)
    } catch (error) {
      console.error("🧪 Test error:", error)
      setTestResult({ success: false, error: error.message })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setTestResult(null)

    try {
      console.log("🔐 AuthGuard: Intentando login con:", credentials.username)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })

      console.log("🔐 AuthGuard: Login response status:", response.status)
      console.log("🔐 AuthGuard: Login response ok:", response.ok)

      if (!response.ok) {
        console.log("🔐 AuthGuard: Login response not ok")
        const text = await response.text()
        console.log("🔐 AuthGuard: Error response text:", text)
        setError("Error del servidor")
        return
      }

      let result: any = null
      try {
        result = await response.json()
        console.log("🔐 AuthGuard: Resultado de login:", result)
      } catch (jsonError) {
        console.error("🔐 AuthGuard: Error parsing login JSON:", jsonError)
        setError("Error del servidor: respuesta no válida")
        return
      }

      if (result?.success) {
        console.log("🔐 AuthGuard: Login exitoso")
        setIsAuthenticated(true)
        setShowLogin(false)
        setError("")
        // Recargar la página para asegurar que el estado se actualice
        window.location.reload()
      } else {
        console.log("🔐 AuthGuard: Login fallido:", result?.error)
        setError(result?.error || "Credenciales incorrectas")
      }
    } catch (error: any) {
      console.error("🔐 AuthGuard: Error en login:", error)
      setError("Error de conexión: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      setIsAuthenticated(false)
      setShowLogin(true)
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Mostrar formulario de login
  if (!isAuthenticated || showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Acceso Administrativo</CardTitle>
            <p className="text-gray-600">Panel de administración del torneo</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {testResult && (
                <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                    <div className="text-xs">
                      <div>Username match: {testResult.tests?.usernameMatch ? "✅" : "❌"}</div>
                      <div>Password match: {testResult.tests?.passwordMatch ? "✅" : "❌"}</div>
                      <div>Expected: {testResult.tests?.expectedUsername}</div>
                      <div>Has hash: {testResult.tests?.hasPasswordHash ? "Yes" : "No"}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Lock className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
                </Button>
                <Button type="button" variant="outline" onClick={testCredentials} disabled={isSubmitting}>
                  <TestTube className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Credenciales de prueba:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">admin / admin123</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar contenido protegido
  return <>{children}</>
}
