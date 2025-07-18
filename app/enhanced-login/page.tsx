"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { ChangePasswordModal } from "@/components/change-password-modal"

export default function EnhancedLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/enhanced-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success) {
        if (result.mustChangePassword) {
          setMustChangePassword(true)
          setIsFirstLogin(result.user?.isFirstLogin || false)
        } else {
          router.push("/admin")
        }
      } else {
        setError(result.error || "Error de autenticación")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChangeSuccess = () => {
    setMustChangePassword(false)
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative flex items-center justify-center">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/images/tournament-logo-bg.png')`,
            backgroundSize: "200px 150px",
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/country-club-logo-transparent.png"
                  alt="Country Club Costa Rica"
                  width={80}
                  height={80}
                  className="brightness-0"
                />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="w-6 h-6 text-blue-600" />
              Acceso Administrativo
            </CardTitle>
            <p className="text-gray-600">Torneo La Negrita 2025</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Ingrese su usuario"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Ingrese su contraseña"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
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
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !credentials.username || !credentials.password}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Volver al sitio principal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials Info for Demo */}
        <Card className="mt-4 bg-blue-50/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4">
            <div className="text-center text-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <p className="font-semibold text-blue-800">Credenciales de Demostración:</p>
              </div>
              <div className="space-y-1 text-blue-700">
                <p>
                  <strong>Usuario:</strong> admin
                </p>
                <p>
                  <strong>Contraseña:</strong> TorneoLaNegrita2025!
                </p>
              </div>
              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>Importante:</strong> Deberá cambiar esta contraseña en el primer acceso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={mustChangePassword}
        onOpenChange={setMustChangePassword}
        onSuccess={handlePasswordChangeSuccess}
        isFirstLogin={isFirstLogin}
      />
    </div>
  )
}
