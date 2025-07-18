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
import { Loader2, CheckCircle, AlertCircle, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
            <p className="text-sm text-white/60 mb-6">Recibirás un email de confirmación con los detalles del pago</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md shadow-2xl border-b border-gray-600/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/country-club-logo-transparent.png"
                alt="Country Club Costa Rica"
                width={55}
                height={55}
                className="brightness-0 invert"
              />
              <div>
                <h1 className="text-xl font-heading font-bold text-white tracking-tight">Torneo La Negrita 2025</h1>
                <p className="text-sm text-gray-300 font-body font-medium">Registro de Participantes</p>
              </div>
            </div>

            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <User className="w-6 h-6" />
                Registro al Torneo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                        placeholder="Tu nombre completo"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nationality" className="text-gray-700 font-medium">
                        Nacionalidad *
                      </Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        className="mt-1"
                        placeholder="Tu nacionalidad"
                      />
                      {errors.nationality && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.nationality}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passport" className="text-gray-700 font-medium">
                        Pasaporte/Cédula *
                      </Label>
                      <Input
                        id="passport"
                        value={formData.passport}
                        onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                        className="mt-1"
                        placeholder="Número de identificación"
                      />
                      {errors.passport && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.passport}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="league" className="text-gray-700 font-medium">
                        Liga *
                      </Label>
                      <Input
                        id="league"
                        value={formData.league}
                        onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                        className="mt-1"
                        placeholder="Tu liga"
                      />
                      {errors.league && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.league}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-gray-700 font-medium">
                        Género *
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: "M" | "F") => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="country" className="text-gray-700 font-medium">
                        Tipo de Participante *
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value: "national" | "international") =>
                          setFormData({ ...formData, country: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">Nacional ($25 por categoría)</SelectItem>
                          <SelectItem value="international">Internacional ($50 por categoría)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="played_2024"
                        checked={formData.played_in_2024}
                        onCheckedChange={(checked) => setFormData({ ...formData, played_in_2024: !!checked })}
                      />
                      <Label htmlFor="played_2024" className="text-gray-700 font-medium">
                        ¿Jugó en 2024?
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Selección de Categorías *</h3>
                  {errors.categories && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.categories}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div key={key} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
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
                        <Label htmlFor={key} className="text-gray-700 font-medium cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Resumen de Costos</h3>
                  <div className="text-blue-800">
                    <p className="mb-2">
                      Categorías seleccionadas: {Object.values(formData.categories).filter(Boolean).length}
                    </p>
                    <p className="mb-2">Costo por categoría: ${formData.country === "national" ? 25 : 50} USD</p>
                    <p className="text-xl font-bold text-blue-900">Total: ${calculateCost()} USD</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrarse al Torneo"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
