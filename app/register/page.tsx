"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2, User, Mail, Phone, Globe, Trophy } from "lucide-react"
import Image from "next/image"

const countries = [
  "Costa Rica",
  "Nicaragua",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Panamá",
  "México",
  "Estados Unidos",
  "Canadá",
  "Colombia",
  "Venezuela",
  "Ecuador",
  "Perú",
  "Brasil",
  "Argentina",
  "Chile",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "España",
  "Otro",
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    average_score: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("🎳 Submitting registration:", formData)

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("🎳 Registration response:", result)

      if (result.success) {
        setSuccess(true)
        toast({
          title: "¡Registro exitoso!",
          description: "Te has registrado correctamente para el torneo. Recibirás información sobre el pago pronto.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          nationality: "",
          average_score: "",
        })
      } else {
        // Handle specific error cases
        if (result.error === "Email already registered") {
          toast({
            title: "Email ya registrado",
            description: "Este email ya está registrado en el torneo. Si tienes problemas, contacta al organizador.",
            variant: "destructive",
          })
        } else if (result.missingFields) {
          toast({
            title: "Campos requeridos",
            description: `Por favor completa: ${result.missingFields.join(", ")}`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error en el registro",
            description: result.details || result.error || "Hubo un problema al registrarte. Intenta de nuevo.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
            <p className="text-slate-300 mb-6">
              Te has registrado correctamente para el Torneo La Negrita 2025. Recibirás información sobre el proceso de
              pago por email.
            </p>
            <Button onClick={() => setSuccess(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Registrar otro jugador
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Image
              src="/images/country-club-logo-transparent.png"
              alt="Country Club Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <Image
              src="/images/tournament-logo.png"
              alt="Tournament Logo"
              width={100}
              height={80}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Torneo La Negrita 2025</h1>
          <p className="text-xl text-blue-300">Registro de Participantes</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Jugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="+506 8888-8888"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-slate-200 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Nacionalidad *
                  </Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange("nationality", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country} className="text-white hover:bg-slate-600">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="average_score" className="text-slate-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Promedio de Bolos (opcional)
                  </Label>
                  <Input
                    id="average_score"
                    type="number"
                    min="0"
                    max="300"
                    value={formData.average_score}
                    onChange={(e) => handleInputChange("average_score", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Ej: 150"
                  />
                  <p className="text-sm text-slate-400">
                    Tu promedio actual de bolos (esto nos ayuda a organizar mejor el torneo)
                  </p>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">Información Importante:</h3>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• El torneo se realizará del 15-16 de febrero de 2025</li>
                  <li>• Costo de inscripción: $50 USD</li>
                  <li>• Recibirás información de pago por email</li>
                  <li>• Cupos limitados - ¡regístrate pronto!</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarme en el Torneo"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400">
          <p>¿Tienes preguntas? Contacta al organizador del torneo</p>
        </div>
      </div>
    </div>
  )
}
