"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, User, Mail, Phone, MapPin, Calendar, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  emergency_contact: string
  emergency_phone: string
  payment_status: "pending" | "verified"
  created_at: string
  wallet_address?: string
}

export default function PlayerDashboard() {
  const params = useParams()
  const playerId = params.id as string
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId) {
      fetchPlayerData()
    }
  }, [playerId])

  const fetchPlayerData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to get player data from the players API
      const response = await fetch(`/api/players?id=${playerId}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.players) {
        const foundPlayer = data.players.find((p: Player) => p.id === playerId)
        if (foundPlayer) {
          setPlayer(foundPlayer)
        } else {
          setError("Jugador no encontrado")
        }
      } else {
        setError(data.error || "Error al cargar datos del jugador")
      }
    } catch (err) {
      console.error("Error fetching player data:", err)
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-300">Cargando tu información...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <Button onClick={fetchPlayerData} className="bg-blue-600 hover:bg-blue-700">
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Jugador no encontrado</h2>
            <p className="text-slate-300">No se pudo encontrar la información del jugador.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-bowling.png')`,
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" />

      <header className="relative z-50 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-600/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/country-club-logo-transparent.png"
              alt="Country Club Costa Rica"
              width={50}
              height={50}
              className="brightness-0 invert"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Mi Dashboard</h1>
              <p className="text-sm text-gray-300">Torneo La Negrita 2025</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Info Card */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Información del Jugador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Nombre Completo</label>
                    <p className="text-white font-medium">{player.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <p className="text-white">{player.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Teléfono</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <p className="text-white">{player.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Contacto de Emergencia</label>
                    <p className="text-white">{player.emergency_contact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Teléfono de Emergencia</label>
                    <p className="text-white">{player.emergency_phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Fecha de Registro</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <p className="text-white">
                        {new Date(player.created_at).toLocaleDateString("es-CR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Card */}
          <div>
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Estado del Registro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {player.payment_status === "verified" ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <Badge className="bg-green-900/50 text-green-300 border-green-700">✅ Verificado</Badge>
                      <p className="text-sm text-slate-300 mt-2">
                        Tu pago ha sido verificado. ¡Estás listo para el torneo!
                      </p>
                    </>
                  ) : (
                    <>
                      <Clock className="h-12 w-12 text-amber-400 mx-auto mb-2" />
                      <Badge className="bg-amber-900/50 text-amber-300 border-amber-700">⏳ Pendiente</Badge>
                      <p className="text-sm text-slate-300 mt-2">Tu registro está pendiente de verificación de pago.</p>
                    </>
                  )}
                </div>

                <Separator className="bg-slate-600" />

                <div className="space-y-2">
                  <h4 className="font-medium text-white">ID de Registro</h4>
                  <p className="text-xs text-slate-400 font-mono bg-slate-700/50 p-2 rounded">{player.id}</p>
                </div>

                {player.wallet_address && (
                  <>
                    <Separator className="bg-slate-600" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Wallet Address</h4>
                      <p className="text-xs text-slate-400 font-mono bg-slate-700/50 p-2 rounded break-all">
                        {player.wallet_address}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tournament Info */}
        <Card className="mt-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Información del Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-medium text-white">Fecha</h4>
                <p className="text-slate-300">25 de Enero, 2025</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-medium text-white">Ubicación</h4>
                <p className="text-slate-300">Country Club Costa Rica</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <h4 className="font-medium text-white">Hora</h4>
                <p className="text-slate-300">8:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
