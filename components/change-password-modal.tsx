"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  isFirstLogin?: boolean
}

export function ChangePasswordModal({ open, onOpenChange, onSuccess, isFirstLogin = false }: ChangePasswordModalProps) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
          confirmPassword: passwords.confirm,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPasswords({ current: "", new: "", confirm: "" })
        onSuccess()
        onOpenChange(false)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ]

    strength = checks.filter(Boolean).length

    if (strength < 3) return { level: "Débil", color: "text-red-600", bg: "bg-red-100" }
    if (strength < 5) return { level: "Media", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Fuerte", color: "text-green-600", bg: "bg-green-100" }
  }

  const passwordStrength = getPasswordStrength(passwords.new)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isFirstLogin ? "Configurar Nueva Contraseña" : "Cambiar Contraseña"}
          </DialogTitle>
        </DialogHeader>

        {isFirstLogin && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Primer acceso detectado.</strong> Por seguridad, debe cambiar la contraseña por defecto.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">{isFirstLogin ? "Contraseña Actual (por defecto)" : "Contraseña Actual"}</Label>
            <div className="relative">
              <Input
                id="current"
                type={showPasswords.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder={isFirstLogin ? "TorneoLaNegrita2025!" : "Contraseña actual"}
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="new"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Nueva contraseña segura"
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {passwords.new && (
              <div className={`text-xs p-2 rounded ${passwordStrength.bg}`}>
                <span className={passwordStrength.color}>Fortaleza: {passwordStrength.level}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirmar nueva contraseña"
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {passwords.new && passwords.confirm && (
              <div className="flex items-center gap-2 text-xs">
                {passwords.new === passwords.confirm ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Las contraseñas coinciden</span>
                  </>
                ) : (
                  <span className="text-red-600">Las contraseñas no coinciden</span>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
            <p className="font-semibold">Requisitos de contraseña:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Mínimo 8 caracteres</li>
              <li>• Al menos una mayúscula (A-Z)</li>
              <li>• Al menos una minúscula (a-z)</li>
              <li>• Al menos un número (0-9)</li>
              <li>• Al menos un carácter especial (!@#$%^&*)</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cambiando...
              </>
            ) : (
              "Cambiar Contraseña"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
