"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calculator, CreditCard, CheckCircle, FileText, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { RegulationModal } from "@/components/regulation-modal"
import { useRouter } from "next/navigation"

type RegistrationStep = "user-info" | "country" | "categories" | "payment" | "confirmation"

interface UserData {
  name: string
  nationality: string
  email: string
  passport: string
  league: string
  played_in_2024: boolean
  gender: "M" | "F" | ""
  country: "national" | "international" | ""
  phone: string
  emergency_contact: string
  emergency_phone: string
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

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<RegistrationStep>("user-info")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [userData, setUserData] = useState<UserData>({
    name: "",
    nationality: "",
    email: "",
    passport: "",
    league: "",
    played_in_2024: false,
    gender: "",
    country: "",
    phone: "",
    emergency_contact: "",
    emergency_phone: "",
  })
  const [categories, setCategories] = useState<Categories>({
    handicap: true, // Always included
    scratch: false,
    seniorM: false,
    seniorF: false,
    marathon: false,
    desperate: false,
    reenganche3: false,
    reenganche4: false,
    reenganche5: false,
    reenganche8: false,
  })
  const [acceptedRegulations, setAcceptedRegulations] = useState(false)
  const [registrationId, setRegistrationId] = useState<string>("")

  const calculateTotal = () => {
    const isEarlyBird = new Date() < new Date("2025-07-20")
    const basePrice =
      userData.country === "national"
        ? isEarlyBird
          ? 36000
          : 42000 // CRC
        : isEarlyBird
          ? 70
          : 80 // USD

    let additionalCost = 0
    const currency = userData.country === "national" ? "CRC" : "USD"
    const additionalRate = userData.country === "national" ? 11000 : 22 // CRC vs USD

    if (categories.scratch) additionalCost += additionalRate
    if (categories.marathon) additionalCost += additionalRate
    if (categories.desperate) additionalCost += additionalRate

    // Reenganche packages
    if (categories.reenganche3) additionalCost += additionalRate * 3
    if (categories.reenganche4) additionalCost += additionalRate * 4
    if (categories.reenganche5) additionalCost += additionalRate * 5
    if (categories.reenganche8) additionalCost += additionalRate * 8

    return {
      base: basePrice,
      additional: additionalCost,
      total: basePrice + additionalCost,
      currency,
    }
  }

  const handleRegistration = async () => {
    setLoading(true)
    setError("")

    try {
      const pricing = calculateTotal()

      const playerData = {
        name: userData.name,
        nationality: userData.nationality,
        email: userData.email,
        passport: userData.passport,
        league: userData.league,
        played_in_2024: userData.played_in_2024,
        gender: userData.gender as "M" | "F",
        country: userData.country as "national" | "international",
        categories,
        total_cost: pricing.total,
        currency: pricing.currency,
        payment_status: "pending" as const,
        handicap_average: null,
        assigned_bracket: null,
        position: null,
        phone: userData.phone,
        emergency_contact: userData.emergency_contact,
        emergency_phone: userData.emergency_phone,
      }

      console.log("🎯 Sending registration data:", playerData)

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      })

      const result = await response.json()
      console.log("📝 Registration response:", result)

      if (result.success) {
        setRegistrationId(result.data.id)
        setStep("confirmation")

        // Store registration ID in localStorage for dashboard access
        localStorage.setItem("lastRegistrationId", result.data.id)

        console.log("✅ Registration successful, ID:", result.data.id)
      } else {
        if (response.status === 409) {
          // Error de duplicado
          setError(result.error)
        } else {
          setError(`Error en el registro: ${result.error}`)
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Error inesperado durante el registro")
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    if (registrationId) {
      console.log("🎯 Navigating to dashboard with ID:", registrationId)
      router.push(`/dashboard/${registrationId}`)
    } else {
      console.error("❌ No registration ID available")
      setError("Error: No se pudo obtener el ID de registro")
    }
  }

  const renderUserInfoStep = () => (
    <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nacionalidad *</Label>
            <Input
              id="nationality"
              value={userData.nationality}
              onChange={(e) => setUserData({ ...userData, nationality: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="passport">Número de Pasaporte/Cédula *</Label>
            <Input
              id="passport"
              value={userData.passport}
              onChange={(e) => setUserData({ ...userData, passport: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="league">Liga Actual *</Label>
            <Input
              id="league"
              value={userData.league}
              onChange={(e) => setUserData({ ...userData, league: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Género *</Label>
            <Select
              value={userData.gender}
              onValueChange={(value: "M" | "F") => setUserData({ ...userData, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="emergency_contact">Contacto de Emergencia *</Label>
            <Input
              id="emergency_contact"
              value={userData.emergency_contact}
              onChange={(e) => setUserData({ ...userData, emergency_contact: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="emergency_phone">Teléfono de Emergencia *</Label>
            <Input
              id="emergency_phone"
              value={userData.emergency_phone}
              onChange={(e) => setUserData({ ...userData, emergency_phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="played2024"
            checked={userData.played_in_2024}
            onCheckedChange={(checked) => setUserData({ ...userData, played_in_2024: checked as boolean })}
          />
          <Label htmlFor="played2024">¿Jugó en la edición 2024?</Label>
        </div>

        <Button
          onClick={() => setStep("country")}
          className="w-full"
          disabled={
            !userData.name ||
            !userData.email ||
            !userData.passport ||
            !userData.gender ||
            !userData.phone ||
            !userData.emergency_contact ||
            !userData.emergency_phone
          }
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  )

  const renderCountryStep = () => (
    <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>Selección de País</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Button
            variant={userData.country === "national" ? "default" : "outline"}
            onClick={() => setUserData({ ...userData, country: "national" })}
            className="h-16 text-left"
          >
            <div>
              <div className="font-semibold">Jugador Nacional</div>
              <div className="text-sm opacity-70">Pagos en colones (CRC)</div>
            </div>
          </Button>
          <Button
            variant={userData.country === "international" ? "default" : "outline"}
            onClick={() => setUserData({ ...userData, country: "international" })}
            className="h-16 text-left"
          >
            <div>
              <div className="font-semibold">Jugador Internacional</div>
              <div className="text-sm opacity-70">Pagos en dólares (USD)</div>
            </div>
          </Button>
        </div>

        <Button onClick={() => setStep("categories")} className="w-full" disabled={!userData.country}>
          Continuar
        </Button>
      </CardContent>
    </Card>
  )

  const renderCategoriesStep = () => {
    const pricing = calculateTotal()

    return (
      <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Selección de Categorías
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Categorías Principales</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={true} disabled />
                    <Label>Hándicap (Incluido)</Label>
                  </div>
                  <Badge variant="secondary">Incluido</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.scratch}
                      onCheckedChange={(checked) => setCategories({ ...categories, scratch: checked as boolean })}
                    />
                    <Label>Scratch</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡11,000" : "$22"}</Badge>
                </div>

                {userData.gender === "M" && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={categories.seniorM}
                        onCheckedChange={(checked) => setCategories({ ...categories, seniorM: checked as boolean })}
                      />
                      <Label>Senior Masculino</Label>
                    </div>
                    <Badge variant="outline">Incluido</Badge>
                  </div>
                )}

                {userData.gender === "F" && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={categories.seniorF}
                        onCheckedChange={(checked) => setCategories({ ...categories, seniorF: checked as boolean })}
                      />
                      <Label>Senior Femenino</Label>
                    </div>
                    <Badge variant="outline">Incluido</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.marathon}
                      onCheckedChange={(checked) => setCategories({ ...categories, marathon: checked as boolean })}
                    />
                    <Label>Maratón de Strikes</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡11,000" : "$22"}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.desperate}
                      onCheckedChange={(checked) => setCategories({ ...categories, desperate: checked as boolean })}
                    />
                    <Label>Desesperado</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡11,000" : "$22"}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Paquetes de Reenganches</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.reenganche3}
                      onCheckedChange={(checked) => setCategories({ ...categories, reenganche3: checked as boolean })}
                    />
                    <Label>3 Reenganches</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡33,000" : "$66"}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.reenganche4}
                      onCheckedChange={(checked) => setCategories({ ...categories, reenganche4: checked as boolean })}
                    />
                    <Label>4 Reenganches</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡44,000" : "$88"}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.reenganche5}
                      onCheckedChange={(checked) => setCategories({ ...categories, reenganche5: checked as boolean })}
                    />
                    <Label>5 Reenganches</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡55,000" : "$110"}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={categories.reenganche8}
                      onCheckedChange={(checked) => setCategories({ ...categories, reenganche8: checked as boolean })}
                    />
                    <Label>8 Reenganches</Label>
                  </div>
                  <Badge variant="outline">+{userData.country === "national" ? "₡88,000" : "$176"}</Badge>
                </div>
              </div>

              <Separator />

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resumen de Costos</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Inscripción base:</span>
                    <span>
                      {userData.country === "national" ? "₡" : "$"}
                      {calculateTotal().base.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adicionales:</span>
                    <span>
                      {userData.country === "national" ? "₡" : "$"}
                      {calculateTotal().additional.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      {userData.country === "national" ? "₡" : "$"}
                      {calculateTotal().total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regulation Button */}
          <div className="flex justify-center py-4 border-t border-gray-200">
            <RegulationModal />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regulations"
                checked={acceptedRegulations}
                onCheckedChange={(checked) => setAcceptedRegulations(checked as boolean)}
              />
              <Label htmlFor="regulations">Acepto el reglamento del torneo</Label>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  "https://acrobat.adobe.com/id/urn:aaid:sc:us:f8e1e12e-6b07-45ab-8257-66d490b2b06e",
                  "_blank",
                )
              }
              className="flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Ver el reglamento
            </Button>
          </div>

          <Button onClick={() => setStep("payment")} className="w-full" disabled={!acceptedRegulations}>
            Proceder al Pago
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderPaymentStep = () => {
    const pricing = calculateTotal()

    return (
      <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Total a Pagar</h4>
            <div className="text-2xl font-bold text-green-600">
              {pricing.currency === "CRC" ? "₡" : "$"}
              {pricing.total.toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Información Bancaria</h4>

            {userData.country === "national" ? (
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <h5 className="font-semibold">Para pagos en Colones (CRC):</h5>
                <p>
                  <strong>Beneficiario:</strong> Costa Rica Country Club, S.A.
                </p>
                <p>
                  <strong>Cédula Jurídica:</strong> 3-101-002477
                </p>
                <p>
                  <strong>Banco:</strong> BAC San José
                </p>
                <p>
                  <strong>SWIFT:</strong> BSNJCRSJ
                </p>
                <p>
                  <strong>Cuenta IBAN:</strong> CR81010200009090951681
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <h5 className="font-semibold">Para pagos en Dólares (USD):</h5>
                <p>
                  <strong>Beneficiario:</strong> Costa Rica Country Club, S.A.
                </p>
                <p>
                  <strong>Cédula Jurídica:</strong> 3-101-002477
                </p>
                <p>
                  <strong>Banco:</strong> BAC San José
                </p>
                <p>
                  <strong>SWIFT:</strong> BSNJCRSJ
                </p>
                <p>
                  <strong>Cuenta IBAN:</strong> CR61010200009090951847
                </p>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Instrucciones Importantes:</h5>
              <ul className="text-sm space-y-1">
                <li>• Incluir en el detalle: {userData.name}</li>
                <li>• Liga: {userData.league}</li>
                <li>• Enviar comprobante a: boliche@country.co.cr</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleRegistration} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              "Completar Registro"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderConfirmationStep = () => (
    <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="w-6 h-6" />
          ¡Registro Completado!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p>Tu registro ha sido enviado exitosamente.</p>
        <p className="text-sm text-gray-600">
          ID de Registro: <code className="bg-gray-100 px-2 py-1 rounded">{registrationId}</code>
        </p>
        <p className="text-sm text-gray-600">Recibirás un correo de confirmación una vez que se verifique tu pago.</p>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button onClick={handleGoToDashboard} className="w-full">
            Ver Mi Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            Volver al Inicio
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 font-semibold shadow-lg border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </Button>
          </Link>
        </div>

        {step === "user-info" && renderUserInfoStep()}
        {step === "country" && renderCountryStep()}
        {step === "categories" && renderCategoriesStep()}
        {step === "payment" && renderPaymentStep()}
        {step === "confirmation" && renderConfirmationStep()}
      </div>
    </div>
  )
}
