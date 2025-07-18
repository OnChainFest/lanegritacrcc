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

interface UserData {
  name: string
  nationality: string
  email: string
  passport: string
  league: string
  played_in_2024: boolean
  gender: "M" | "F" | ""
  country: "national" | "international" | ""
}

interface Categories {
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

interface PlayerData {
  name: string
  nationality: string
  email: string
  passport: string
  league: string
  played_in_2024: boolean
  gender: "M" | "F" | ""
  country: "national" | "international" | ""
  categories: Categories
  total_cost: number
  currency: string
  payment_status: "pending"
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
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
    total_cost: 0,
    currency: "USD",
    payment_status: "pending",
  })

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setPlayerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryChange = (category: keyof Categories, value: boolean) => {
    setPlayerData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value,
      },
    }))
  }

  const calculateTotal = () => {
    let total = 50 // Base price

    // Early bird discount until December 31, 2024
    const now = new Date()
    const earlyBirdDeadline = new Date("2024-12-31")
    if (now <= earlyBirdDeadline) {
      total = 40
    }

    // Category add-ons
    if (playerData.categories.handicap) total += 10
    if (playerData.categories.scratch) total += 15
    if (playerData.categories.seniorM) total += 20
    if (playerData.categories.seniorF) total += 20
    if (playerData.categories.marathon) total += 25
    if (playerData.categories.desperate) total += 30
    if (playerData.categories.reenganche3) total += 35
    if (playerData.categories.reenganche4) total += 40
    if (playerData.categories.reenganche5) total += 45
    if (playerData.categories.reenganche8) total += 50

    setPlayerData((prev) => ({
      ...prev,
      total_cost: total,
    }))

    return total
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("🚀 Submitting registration:", playerData.email)

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
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

  const renderForm = () => {
    switch (step) {
      case 1:
        return <Step1 playerData={playerData} handleInputChange={handleInputChange} nextStep={nextStep} />
      case 2:
        return (
          <Step2
            playerData={playerData}
            handleInputChange={handleInputChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )
      case 3:
        return (
          <Step3
            playerData={playerData}
            handleCategoryChange={handleCategoryChange}
            calculateTotal={calculateTotal}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )
      case 4:
        return (
          <Step4
            playerData={playerData}
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
            <CardContent className="p-8">{renderForm()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface Step1Props {
  playerData: PlayerData
  handleInputChange: (field: keyof UserData, value: string | boolean) => void
  nextStep: () => void
}

const Step1: React.FC<Step1Props> = ({ playerData, handleInputChange, nextStep }) => {
  return (
    <div className="space-y-6">
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
          <Input
            id="nationality"
            type="text"
            required
            value={playerData.nationality}
            onChange={(e) => handleInputChange("nationality", e.target.value)}
            className="font-body"
            placeholder="Tu nacionalidad"
          />
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

      <div>
        <Label htmlFor="played_in_2024" className="font-body font-medium">
          ¿Jugó en 2024? *
        </Label>
        <Checkbox
          id="played_in_2024"
          checked={playerData.played_in_2024}
          onCheckedChange={(checked) => handleInputChange("played_in_2024", checked as boolean)}
        />
      </div>

      <Button onClick={nextStep} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading">
        Siguiente
      </Button>
    </div>
  )
}

interface Step2Props {
  playerData: PlayerData
  handleInputChange: (field: keyof UserData, value: string | boolean) => void
  prevStep: () => void
  nextStep: () => void
}

const Step2: React.FC<Step2Props> = ({ playerData, handleInputChange, prevStep, nextStep }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">País de Residencia</h3>

      <div>
        <Label htmlFor="country" className="font-body font-medium">
          Tipo de Participante *
        </Label>
        <Select value={playerData.country} onValueChange={(value) => handleInputChange("country", value)}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">Nacional</SelectItem>
            <SelectItem value="international">Internacional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading">
          Siguiente
        </Button>
      </div>
    </div>
  )
}

interface Step3Props {
  playerData: PlayerData
  handleCategoryChange: (category: keyof Categories, value: boolean) => void
  calculateTotal: () => number
  prevStep: () => void
  nextStep: () => void
}

const Step3: React.FC<Step3Props> = ({ playerData, handleCategoryChange, calculateTotal, prevStep, nextStep }) => {
  const total = calculateTotal()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">Selección de Categorías</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="handicap" className="font-body font-medium">
            Handicap
          </Label>
          <Checkbox
            id="handicap"
            checked={playerData.categories.handicap}
            onCheckedChange={(checked) => handleCategoryChange("handicap", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="scratch" className="font-body font-medium">
            Scratch
          </Label>
          <Checkbox
            id="scratch"
            checked={playerData.categories.scratch}
            onCheckedChange={(checked) => handleCategoryChange("scratch", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="seniorM" className="font-body font-medium">
            Senior Masculino
          </Label>
          <Checkbox
            id="seniorM"
            checked={playerData.categories.seniorM}
            onCheckedChange={(checked) => handleCategoryChange("seniorM", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="seniorF" className="font-body font-medium">
            Senior Femenino
          </Label>
          <Checkbox
            id="seniorF"
            checked={playerData.categories.seniorF}
            onCheckedChange={(checked) => handleCategoryChange("seniorF", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="marathon" className="font-body font-medium">
            Maratón
          </Label>
          <Checkbox
            id="marathon"
            checked={playerData.categories.marathon}
            onCheckedChange={(checked) => handleCategoryChange("marathon", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="desperate" className="font-body font-medium">
            Desesperado
          </Label>
          <Checkbox
            id="desperate"
            checked={playerData.categories.desperate}
            onCheckedChange={(checked) => handleCategoryChange("desperate", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="reenganche3" className="font-body font-medium">
            Reenganche 3
          </Label>
          <Checkbox
            id="reenganche3"
            checked={playerData.categories.reenganche3}
            onCheckedChange={(checked) => handleCategoryChange("reenganche3", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="reenganche4" className="font-body font-medium">
            Reenganche 4
          </Label>
          <Checkbox
            id="reenganche4"
            checked={playerData.categories.reenganche4}
            onCheckedChange={(checked) => handleCategoryChange("reenganche4", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="reenganche5" className="font-body font-medium">
            Reenganche 5
          </Label>
          <Checkbox
            id="reenganche5"
            checked={playerData.categories.reenganche5}
            onCheckedChange={(checked) => handleCategoryChange("reenganche5", checked as boolean)}
          />
        </div>

        <div>
          <Label htmlFor="reenganche8" className="font-body font-medium">
            Reenganche 8
          </Label>
          <Checkbox
            id="reenganche8"
            checked={playerData.categories.reenganche8}
            onCheckedChange={(checked) => handleCategoryChange("reenganche8", checked as boolean)}
          />
        </div>
      </div>

      <div className="text-lg font-heading font-semibold text-gray-900">Total a pagar: ${total} USD</div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-heading">
          Siguiente
        </Button>
      </div>
    </div>
  )
}

interface Step4Props {
  playerData: PlayerData
  handleRegistration: (e: React.FormEvent) => Promise<void>
  loading: boolean
  prevStep: () => void
}

const Step4: React.FC<Step4Props> = ({ playerData, handleRegistration, loading, prevStep }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 border-b pb-2">Información de Pago</h3>

      <p className="font-body">
        Por favor, realice el pago a la siguiente cuenta bancaria:
        <br />
        Banco: Banco de Costa Rica
        <br />
        Cuenta: 1234567890
        <br />A nombre de: Country Club Costa Rica
      </p>

      <p className="font-body">
        Una vez realizado el pago, por favor adjunte el comprobante al correo torneolanegrita@gmail.com
      </p>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
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
              Registrarse al Torneo
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
