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
import { ArrowLeft, User, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface PlayerData {
  name: string
  email: string
  phone: string
  passport: string
  nationality: string
  address: string
  city: string
  country: string
  birth_date: string
  gender: string
  shirt_size: string
  payment_method: string
  payment_status: "pending"
  terms_accepted: boolean
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<PlayerData>({
    name: "",
    email: "",
    phone: "",
    passport: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    birth_date: "",
    gender: "",
    shirt_size: "",
    payment_method: "",
    payment_status: "pending",
    terms_accepted: false,
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: keyof PlayerData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.terms_accepted) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("🚀 Submitting registration:", formData.email)

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("📝 Registration response:", result)

      if (result.success) {
        toast({
          title: "¡Registro exitoso!",
          description: "Te has registrado correctamente al torneo",
        })

        // Redirect to dashboard with player ID
        if (result.data?.id) {
          console.log("🎯 Redirecting to dashboard with ID:", result.data.id)
          router.push(`/dashboard/${result.data.id}`)
        } else {
          // Fallback to home page
          router.push("/")
        }
      } else {
        console.error("❌ Registration failed:", result.error)
        toast({
          title: "Error en el registro",
          description: result.error || "No se pudo completar el registro",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 Registration error:", error)
      toast({
        title: "Error de conexión",
        description: "Verifica tu internet e intenta de nuevo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <User className="w-6 h-6" />
                Registro al Torneo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">
                    Información Personal
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-body font-medium">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="font-body"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-body font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="font-body"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="font-body font-medium">
                        Teléfono *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="font-body"
                        placeholder="+506 8888-8888"
                      />
                    </div>

                    <div>
                      <Label htmlFor="passport" className="font-body font-medium">
                        Pasaporte/Cédula *
                      </Label>
                      <Input
                        id="passport"
                        type="text"
                        required
                        value={formData.passport}
                        onChange={(e) => handleInputChange("passport", e.target.value)}
                        className="font-body"
                        placeholder="Número de identificación"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birth_date" className="font-body font-medium">
                        Fecha de Nacimiento *
                      </Label>
                      <Input
                        id="birth_date"
                        type="date"
                        required
                        value={formData.birth_date}
                        onChange={(e) => handleInputChange("birth_date", e.target.value)}
                        className="font-body"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="font-body font-medium">
                        Género *
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">
                    Información de Ubicación
                  </h3>

                  <div>
                    <Label htmlFor="address" className="font-body font-medium">
                      Dirección *
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="font-body"
                      placeholder="Tu dirección completa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="font-body font-medium">
                        Ciudad *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="font-body"
                        placeholder="Tu ciudad"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" className="font-body font-medium">
                        País *
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="font-body"
                        placeholder="Tu país"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nationality" className="font-body font-medium">
                      Nacionalidad *
                    </Label>
                    <Input
                      id="nationality"
                      type="text"
                      required
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className="font-body"
                      placeholder="Tu nacionalidad"
                    />
                  </div>
                </div>

                {/* Tournament Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">
                    Información del Torneo
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shirt_size" className="font-body font-medium">
                        Talla de Camisa *
                      </Label>
                      <Select
                        value={formData.shirt_size}
                        onValueChange={(value) => handleInputChange("shirt_size", value)}
                      >
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Seleccionar talla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="payment_method" className="font-body font-medium">
                        Método de Pago *
                      </Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) => handleInputChange("payment_method", value)}
                      >
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Seleccionar método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                          <SelectItem value="sinpe">SINPE Móvil</SelectItem>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) => handleInputChange("terms_accepted", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-body">
                      Acepto los términos y condiciones del torneo *
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Registrarse al Torneo
                    </>
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
