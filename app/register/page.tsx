"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  nationality: string
  passport: string
  league: string
  played_in_2024: boolean
  gender: "M" | "F"
  country: "national" | "international"
  categories: {
    handicap: boolean
    scratch: boolean
    seniorM: boolean
    seniorF: boolean
    marathon: boolean
    desperate: boolean
    reenganche3: boolean
    reenganche4: boolean
    reenganche5: boolean
    reenganche8: boolean
  }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    nationality: "",
    passport: "",
    league: "",
    played_in_2024: false,
    gender: "M",
    country: "national",
    categories: {
      handicap: false,
      scratch: false,
      seniorM: false,
      seniorF: false,
      marathon: false,
      desperate: false,
      reenganche3: false,
      reenganche4: false,
      reenganche5: false,
      reenganche8: false,
    },
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    if (!formData.nationality.trim()) newErrors.nationality = "La nacionalidad es requerida"
    if (!formData.passport.trim()) newErrors.passport = "El pasaporte es requerido"
    if (!formData.league.trim()) newErrors.league = "La liga es requerida"

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }

    // Check if at least one category is selected
    const hasCategory = Object.values(formData.categories).some(Boolean)
    if (!hasCategory) {
      newErrors.categories = "Selecciona al menos una categoría"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateCost = () => {
    const selectedCategories = Object.values(formData.categories).filter(Boolean).length
    const baseCost = formData.country === "national" ? 25 : 50
    return baseCost * selectedCategories
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      console.log("📝 Submitting registration:", {
        name: formData.name,
        email: formData.email,
        nationality: formData.nationality,
      })

      const registrationData = {
        ...formData,
        total_cost: calculateCost(),
        currency: "USD",
        payment_status: "pending",
      }

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()
      console.log("📝 Registration result:", result)

      if (!response.ok) {
        if (result.duplicate) {
          setErrors({ email: "Este email ya está registrado" })
          toast({
            title: "Email duplicado",
            description: "Este email ya está registrado en el torneo",
            variant: "destructive",
          })
        } else {
          throw new Error(result.error || `HTTP ${response.status}`)
        }
        return
      }

      if (result.success) {
        setSuccess(true)
        toast({
          title: "¡Registro exitoso!",
          description: `Bienvenido al torneo, ${formData.name}`,
        })
      } else {
        throw new Error(result.error || "Error desconocido")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Error de registro",
        description: error.message || "No se pudo completar el registro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
            <p className="text-white/80 mb-4">Te has registrado correctamente para el Torneo La Negrita 2025</p>
            <p className="text-sm text-white/60">Recibirás un email de confirmación con los detalles del pago</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Registro - Torneo La Negrita 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Información Personal</h3>

                <div>
                  <Label htmlFor="name" className="text-white">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationality" className="text-white">
                      Nacionalidad *
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Costa Rica"
                    />
                    {errors.nationality && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.nationality}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="passport" className="text-white">
                      Pasaporte/Cédula *
                    </Label>
                    <Input
                      id="passport"
                      value={formData.passport}
                      onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="123456789"
                    />
                    {errors.passport && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.passport}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="league" className="text-white">
                    Liga/Club *
                  </Label>
                  <Input
                    id="league"
                    value={formData.league}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Tu liga o club"
                  />
                  {errors.league && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.league}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Género</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: "M" | "F") => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Tipo</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value: "national" | "international") =>
                        setFormData({ ...formData, country: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">Nacional</SelectItem>
                        <SelectItem value="international">Internacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="played_2024"
                      checked={formData.played_in_2024}
                      onCheckedChange={(checked) => setFormData({ ...formData, played_in_2024: !!checked })}
                    />
                    <Label htmlFor="played_2024" className="text-white text-sm">
                      Jugué en 2024
                    </Label>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Categorías *</h3>
                {errors.categories && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.categories}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    handicap: "Handicap",
                    scratch: "Scratch",
                    seniorM: "Senior Masculino",
                    seniorF: "Senior Femenino",
                    marathon: "Maratón",
                    desperate: "Desesperados",
                    reenganche3: "Reenganche 3",
                    reenganche4: "Reenganche 4",
                    reenganche5: "Reenganche 5",
                    reenganche8: "Reenganche 8",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData.categories[key as keyof typeof formData.categories]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            categories: {
                              ...formData.categories,
                              [key]: !!checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor={key} className="text-white">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Resumen de Costos</h3>
                <div className="text-white/80">
                  <p>Categorías seleccionadas: {Object.values(formData.categories).filter(Boolean).length}</p>
                  <p>Costo por categoría: ${formData.country === "national" ? 25 : 50} USD</p>
                  <p className="text-xl font-bold text-white">Total: ${calculateCost()} USD</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
