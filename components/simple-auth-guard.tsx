"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface SimpleAuthGuardProps {
  children: React.ReactNode
}

export function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState("admin")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("🔐 SimpleAuthGuard: Verificando autenticación...")

      const response = await fetch("/api/auth/simple-verify", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("🔐 SimpleAuthGuard: Response status:", response.status)

      if (!response.ok) {
        console.log("🔐 SimpleAuthGuard: Response not ok")
        setIsAuthenticated(false)
        setShowLogin(true)
        setIsLoading(false)
        return
      }

      const result = await response.json()
      console.log("🔐 SimpleAuthGuard: Resultado:", result)

      if (result?.valid && result?.authenticated) {
        console.log("🔐 SimpleAuthGuard: Usuario autenticado")
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        console.log("🔐 SimpleAuthGuard: Usuario no autenticado")
        setIsAuthenticated(false)
        setShowLogin(true)
      }
    } catch (error) {
      console.error("🔐 SimpleAuthGuard: Error verificando:", error)
      setIsAuthenticated(false)
      setShowLogin(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      console.log("🔐 SimpleAuthGuard: Intentando login con:", username)

      const response = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      })

      console.log("🔐 SimpleAuthGuard: Login response status:", response.status)

      if (!response.ok) {
        const text = await response.text()
        console.log("🔐 SimpleAuthGuard: Error response:", text)
        setError("Error del servidor")
        return
      }

      const result = await response.json()
      console.log("🔐 SimpleAuthGuard: Login result:", result)

      if (result?.success) {
        console.log("🔐 SimpleAuthGuard: Login exitoso")
        setIsAuthenticated(true)
        setShowLogin(false)
        setError("")
        // Forzar recarga para asegurar estado limpio
        window.location.reload()
      } else {
        console.log("🔐 SimpleAuthGuard: Login fallido:", result?.error)
        setError(result?.error || "Credenciales incorrectas")
      }
    } catch (error: any) {
      console.error("🔐 SimpleAuthGuard: Error en login:", error)
      setError("Error de conexión: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Inter']">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Mostrar formulario de login
  if (!isAuthenticated || showLogin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/tournament-logo-bg.png')`,
            backgroundSize: "300px 225px",
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          }}
        >
          <div className="absolute inset-0 bg-white/60"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/country-club-logo-transparent.png"
                  alt="Costa Rica Country Club"
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white font-['Montserrat'] drop-shadow-lg">
                Acceso Administrativo
              </CardTitle>
              <p className="text-white/80 font-['Inter'] drop-shadow">Panel de administración del torneo</p>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium font-['Inter'] drop-shadow">
                  Usuario Administrativo
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ingresa tu usuario"
                  className="w-full h-12 bg-white/20 border-2 border-white/30 focus:border-yellow-400 rounded-lg font-['Inter'] text-white placeholder:text-white/60 backdrop-blur-sm"
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-300 bg-red-500/20 backdrop-blur-sm">
                  <AlertDescription className="text-red-100 font-['Inter']">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all duration-200 font-['Inter'] shadow-lg"
                disabled={isSubmitting || !username.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            {/* Credenciales de prueba */}
            <Card className="bg-blue-50/20 backdrop-blur-sm border-blue-200/30">
              <CardContent className="p-4">
                <div className="text-center text-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <p className="font-semibold text-white">Credenciales de Acceso:</p>
                  </div>
                  <div className="space-y-1 text-white/90">
                    <p>
                      <strong>Usuario:</strong> admin
                    </p>
                  </div>
                  <div className="mt-2 p-2 bg-yellow-400/20 rounded border border-yellow-400/30">
                    <p className="text-xs text-yellow-200">
                      💡 <strong>Tip:</strong> Solo necesitas ingresar el usuario "admin"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-xs text-white/70 font-['Inter'] drop-shadow">
                Torneo La Negrita 2025 • Costa Rica Country Club
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
