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
import { ArrowLeft, User, CreditCard, Loader2, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface PlayerData {
  name: string
  nationality: string
  email: string
  passport: string
  league: string
  played_in_2024: boolean
  gender: "M" | "F" | ""
  country: "national" | "international" | ""
  categories: {
    handicap: boolean
    senior: boolean
    scratch: boolean
  }
  extras: {
    reenganche: boolean
    marathon: boolean
    desperate: boolean
  }
  total_cost: number
  currency: string
  payment_status: "pending"
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registeredPlayer, setRegisteredPlayer] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [playerData, setPlayerData] = useState<PlayerData>({
    name: "",
    nationality: "",
    email: "",
    passport: "",
    league: "",
    played_in_2024: false,
    gender: "",
    country: "",
    categories: {
      handicap: false,
      senior: false,
      scratch: false,
    },
    extras: {
      reenganche: false,
      marathon: false,
      desperate: false,
    },
    total_cost: 0,
    currency: "USD",
    payment_status: "pending",
  })

  const nextStep = () => {
    console.log("Moving to next step:", step + 1)
    setStep(step + 1)
  }

  const prevStep = () => {
    console.log("Moving to previous step:", step - 1)
    setStep(step - 1)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log("Input change:", field, value)
    setPlayerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryChange = (category: string, value: boolean) => {
    console.log("Category change:", category, value)
    setPlayerData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value,
      },
    }))
  }

  const handleExtraChange = (extra: string, value: boolean) => {
    console.log("Extra change:", extra, value)
    setPlayerData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        [extra]: value,
      },
    }))
  }

  const calculateTotal = () => {
    const now = new Date()
    const earlyBirdDeadline = new Date("2025-07-19")

    // Base price
    let total = now <= earlyBirdDeadline ? 70 : 80

    // Scratch category
    if (playerData.categories.scratch) {
      total += 22
    }

    // Extras
    if (playerData.extras.reenganche) total += 22
    if (playerData.extras.marathon) total += 22
    if (playerData.extras.desperate) total += 22

    return total
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const finalData = {
        ...playerData,
        total_cost: calculateTotal(),
      }

      console.log("🚀 Submitting registration:", finalData)

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()
      console.log("📝 Registration response:", result)

      if (result.success) {
        setRegisteredPlayer(result.data)
        setSuccess(true)
        toast({
          title: "¡Registro exitoso!",
          description: "Te has registrado correctamente al torneo",
        })
      } else {
        console.error("❌ Registration failed:", result.error)

        if (result.duplicate) {
          toast({
            title: "Email ya registrado",
            description: `El email ${playerData.email} ya está registrado en el torneo`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error en el registro",
            description: result.error || "No se pudo completar el registro",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("💥 Registration error:", error)
      toast({
        title: "Error de conexión",
        description: "Verifica tu internet e intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Información copiada al portapapeles",
    })
  }

  if (success && registeredPlayer) {
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
                  <p className="text-sm text-gray-300 font-body font-medium">Registro Completado</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0 mb-6">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-heading flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  ¡Registro Exitoso!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Bienvenido al Torneo La Negrita 2025, {registeredPlayer.name}!
                  </h3>
                  <p className="text-gray-600">Total a pagar: ${registeredPlayer.total_cost} USD</p>
                </div>

                {/* Payment Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Información para Realizar el Pago
                  </h3>

                  {playerData.country === "national" ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        💴 Para Nacionales - Pagos en Colones (CRC)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Beneficiario:</strong>
                          <p className="flex items-center gap-2">
                            Costa Rica Country Club, S.A.
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard("Costa Rica Country Club, S.A.")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cédula Jurídica:</strong>
                          <p className="flex items-center gap-2">
                            3-101-002477
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("3-101-002477")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Banco:</strong>
                          <p>BAC San José</p>
                        </div>
                        <div>
                          <strong>SWIFT:</strong>
                          <p className="flex items-center gap-2">
                            BSNJCRSJ
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("BSNJCRSJ")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cuenta Cliente:</strong>
                          <p className="flex items-center gap-2">
                            10200009090951681
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("10200009090951681")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cuenta Corriente:</strong>
                          <p className="flex items-center gap-2">
                            909095168
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("909095168")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <strong>Cuenta IBAN:</strong>
                          <p className="flex items-center gap-2">
                            CR81010200009090951681
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("CR81010200009090951681")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Moneda:</strong>
                          <p>CRC (Colones)</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                        💵 Para Extranjeros - Pagos en Dólares (USD)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Beneficiario:</strong>
                          <p className="flex items-center gap-2">
                            Costa Rica Country Club, S.A.
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard("Costa Rica Country Club, S.A.")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cédula Jurídica:</strong>
                          <p className="flex items-center gap-2">
                            3-101-002477
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("3-101-002477")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Banco:</strong>
                          <p>BAC San José</p>
                        </div>
                        <div>
                          <strong>SWIFT:</strong>
                          <p className="flex items-center gap-2">
                            BSNJCRSJ
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("BSNJCRSJ")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cuenta Cliente:</strong>
                          <p className="flex items-center gap-2">
                            10200009090951847
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("10200009090951847")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Cuenta Corriente:</strong>
                          <p className="flex items-center gap-2">
                            909095184
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("909095184")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <strong>Cuenta IBAN:</strong>
                          <p className="flex items-center gap-2">
                            CR61010200009090951847
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard("CR61010200009090951847")}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </p>
                        </div>
                        <div>
                          <strong>Moneda:</strong>
                          <p>USD (Dólar)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Important Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-yellow-900 mb-4">📌 Instrucciones Importantes</h4>
                    <div className="space-y-3 text-sm text-yellow-800">
                      <p>
                        <strong>Al realizar el pago incluir en el detalle de la transferencia:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Nombre completo del jugador: {registeredPlayer.name}</li>
                        <li>Liga en la que participa: {playerData.league}</li>
                      </ul>
                      <p className="mt-4">
                        <strong>Una vez realizado el pago, enviar el comprobante al correo:</strong>{" "}
                        <a href="mailto:boliche@country.co.cr" className="text-blue-600 underline">
                          boliche@country.co.cr
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="/">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Volver al Inicio</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    switch (step) {
      case 1:
        return <Step1 playerData={playerData} handleInputChange={handleInputChange} nextStep={nextStep} />
      case 2:
        return (
          <Step2
            playerData={playerData}
            handleCategoryChange={handleCategoryChange}
            handleExtraChange={handleExtraChange}
            calculateTotal={calculateTotal}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )
      case 3:
        return (
          <Step3
            playerData={playerData}
            calculateTotal={calculateTotal}
            handleRegistration={handleRegistration}
            loading={loading}
            prevStep={prevStep}
          />
        )
      default:
        return null
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
                <p className="text-sm text-gray-300 font-body font-medium">2 al 9 de Agosto 2025</p>
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
                Registro al Torneo - Paso {step} de 3
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">{renderForm()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Step 1: Personal Information
interface Step1Props {
  playerData: PlayerData
  handleInputChange: (field: string, value: string | boolean) => void
  nextStep: () => void
}

const Step1: React.FC<Step1Props> = ({ playerData, handleInputChange, nextStep }) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !playerData.name ||
      !playerData.email ||
      !playerData.nationality ||
      !playerData.passport ||
      !playerData.league ||
      !playerData.gender ||
      !playerData.country
    ) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    nextStep()
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">Información Personal</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="font-body font-medium">
            Nombre Completo *
          </Label>
          <Input
            id="name"
            type="text"
            required
            value={playerData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="font-body"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <Label htmlFor="nationality" className="font-body font-medium">
            Nacionalidad *
          </Label>
          <Select
            value={playerData.nationality}
            onValueChange={(value) => {
              handleInputChange("nationality", value)
              // Automatically set country based on nationality
              if (value === "Nacional") {
                handleInputChange("country", "national")
              } else if (value === "Extranjero") {
                handleInputChange("country", "international")
              }
            }}
          >
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Seleccionar nacionalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nacional">Nacional</SelectItem>
              <SelectItem value="Extranjero">Extranjero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="font-body font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={playerData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="font-body"
            placeholder="tu@email.com"
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
            value={playerData.passport}
            onChange={(e) => handleInputChange("passport", e.target.value)}
            className="font-body"
            placeholder="Número de identificación"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="league" className="font-body font-medium">
            Liga *
          </Label>
          <Input
            id="league"
            type="text"
            required
            value={playerData.league}
            onChange={(e) => handleInputChange("league", e.target.value)}
            className="font-body"
            placeholder="Tu liga"
          />
        </div>

        <div>
          <Label htmlFor="gender" className="font-body font-medium">
            Género *
          </Label>
          <Select value={playerData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="played_in_2024"
          checked={playerData.played_in_2024}
          onCheckedChange={(checked) => handleInputChange("played_in_2024", checked as boolean)}
        />
        <Label htmlFor="played_in_2024" className="font-body font-medium">
          ¿Jugó en 2024?
        </Label>
      </div>

      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading">
        Siguiente
      </Button>
    </form>
  )
}

// Step 2: Categories and Extras
interface Step2Props {
  playerData: PlayerData
  handleCategoryChange: (category: string, value: boolean) => void
  handleExtraChange: (extra: string, value: boolean) => void
  calculateTotal: () => number
  prevStep: () => void
  nextStep: () => void
}

const Step2: React.FC<Step2Props> = ({
  playerData,
  handleCategoryChange,
  handleExtraChange,
  calculateTotal,
  prevStep,
  nextStep,
}) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if at least one category is selected
    const hasCategory = Object.values(playerData.categories).some(Boolean)
    if (!hasCategory) {
      alert("Por favor selecciona al menos una categoría")
      return
    }

    nextStep()
  }

  const now = new Date()
  const earlyBirdDeadline = new Date("2025-07-19")
  const isEarlyBird = now <= earlyBirdDeadline

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">Categorías y Extras</h3>

      {/* Price Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Información de Precios</h4>
        <p className="text-blue-800 text-sm">
          {isEarlyBird ? (
            <>
              Precio hasta el 19 de julio: <strong>$70</strong> (incluye 2 series)
            </>
          ) : (
            <>
              Precio después del 19 de julio: <strong>$80</strong> (incluye 2 series)
            </>
          )}
        </p>
        <p className="text-blue-800 text-sm">Modalidad 700, series de 3 juegos</p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Categorías (selecciona al menos una) *</h4>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="handicap"
              checked={playerData.categories.handicap}
              onCheckedChange={(checked) => handleCategoryChange("handicap", checked as boolean)}
            />
            <Label htmlFor="handicap" className="font-body font-medium">
              Hándicap
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="senior"
              checked={playerData.categories.senior}
              onCheckedChange={(checked) => handleCategoryChange("senior", checked as boolean)}
            />
            <Label htmlFor="senior" className="font-body font-medium">
              Senior
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="scratch"
              checked={playerData.categories.scratch}
              onCheckedChange={(checked) => handleCategoryChange("scratch", checked as boolean)}
            />
            <Label htmlFor="scratch" className="font-body font-medium">
              Scratch (+$22)
            </Label>
          </div>
        </div>
      </div>

      {/* Extras */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Extras (opcionales)</h4>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reenganche"
              checked={playerData.extras.reenganche}
              onCheckedChange={(checked) => handleExtraChange("reenganche", checked as boolean)}
            />
            <Label htmlFor="reenganche" className="font-body font-medium">
              Reenganche (+$22)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marathon"
              checked={playerData.extras.marathon}
              onCheckedChange={(checked) => handleExtraChange("marathon", checked as boolean)}
            />
            <Label htmlFor="marathon" className="font-body font-medium">
              Maratón de Strikes (+$22)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="desperate"
              checked={playerData.extras.desperate}
              onCheckedChange={(checked) => handleExtraChange("desperate", checked as boolean)}
            />
            <Label htmlFor="desperate" className="font-body font-medium">
              Desesperado (+$22) - un juego
            </Label>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-lg font-heading font-semibold text-green-900">Total a pagar: ${calculateTotal()} USD</div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading">
          Siguiente
        </Button>
      </div>
    </form>
  )
}

// Step 3: Confirmation
interface Step3Props {
  playerData: PlayerData
  calculateTotal: () => number
  handleRegistration: (e: React.FormEvent) => Promise<void>
  loading: boolean
  prevStep: () => void
}

const Step3: React.FC<Step3Props> = ({ playerData, calculateTotal, handleRegistration, loading, prevStep }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">Confirmación de Registro</h3>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900">Información Personal</h4>
          <p className="text-gray-700">{playerData.name}</p>
          <p className="text-gray-700">{playerData.email}</p>
          <p className="text-gray-700">{playerData.nationality}</p>
          <p className="text-gray-700">Liga: {playerData.league}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">Categorías Seleccionadas</h4>
          <ul className="text-gray-700">
            {playerData.categories.handicap && <li>• Hándicap</li>}
            {playerData.categories.senior && <li>• Senior</li>}
            {playerData.categories.scratch && <li>• Scratch (+$22)</li>}
          </ul>
        </div>

        {(playerData.extras.reenganche || playerData.extras.marathon || playerData.extras.desperate) && (
          <div>
            <h4 className="font-semibold text-gray-900">Extras</h4>
            <ul className="text-gray-700">
              {playerData.extras.reenganche && <li>• Reenganche (+$22)</li>}
              {playerData.extras.marathon && <li>• Maratón de Strikes (+$22)</li>}
              {playerData.extras.desperate && <li>• Desesperado (+$22)</li>}
            </ul>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="text-xl font-bold text-gray-900">Total: ${calculateTotal()} USD</div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button
          onClick={handleRegistration}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Confirmar Registro
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
