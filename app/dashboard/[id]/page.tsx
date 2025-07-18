"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, CreditCard, Trophy, Calendar } from "lucide-react"
import Link from "next/link"
import { TournamentDatabase } from "@/lib/database"
import type { Player } from "@/lib/supabase"

interface DashboardPageProps {
  params: {
    id: string
  }
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data: players } = await TournamentDatabase.getPlayers()
        const foundPlayer = players?.find((p) => p.id === params.id)
        setPlayer(foundPlayer || null)
      } catch (error) {
        console.error("Error fetching player:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Jugador no encontrado</h2>
            <p className="text-gray-600 mb-4">No se pudo encontrar la información del registro.</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verificado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      default:
        return "Desconocido"
    }
  }

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

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6" />
                Dashboard Personal - {player.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${getStatusColor(player.payment_status)}`}>
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Estado de Pago
                  </h4>
                  <p className="font-medium">{getStatusText(player.payment_status)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Categorías
                  </h4>
                  <p className="text-green-600">
                    {Object.entries(player.categories).filter(([_, value]) => value).length} seleccionadas
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Registro
                  </h4>
                  <p className="text-purple-600">{new Date(player.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Información Personal</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> {player.email}
                    </p>
                    <p>
                      <strong>Nacionalidad:</strong> {player.nationality}
                    </p>
                    <p>
                      <strong>Liga:</strong> {player.league}
                    </p>
                    <p>
                      <strong>Género:</strong> {player.gender === "M" ? "Masculino" : "Femenino"}
                    </p>
                    <p>
                      <strong>Jugó en 2024:</strong> {player.played_in_2024 ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Participación</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Hándicap</Badge>
                      <span className="text-green-600">✓</span>
                    </div>
                    {player.categories.scratch && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Scratch</Badge>
                        <span className="text-green-600">✓</span>
                      </div>
                    )}
                    {player.categories.seniorM && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Senior Masculino</Badge>
                        <span className="text-green-600">✓</span>
                      </div>
                    )}
                    {player.categories.seniorF && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Senior Femenino</Badge>
                        <span className="text-green-600">✓</span>
                      </div>
                    )}
                    {player.categories.marathon && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Maratón de Strikes</Badge>
                        <span className="text-green-600">✓</span>
                      </div>
                    )}
                    {player.categories.desperate && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Desesperado</Badge>
                        <span className="text-green-600">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Información de Pago</h4>
                <p className="text-blue-700">
                  Total: {player.currency === "CRC" ? "₡" : "$"}
                  {player.total_cost.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  ID de Registro: <code className="bg-white px-2 py-1 rounded">{player.id}</code>
                </p>
              </div>

              {player.assigned_bracket && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Llave Asignada</h4>
                  <p className="text-yellow-700">{player.assigned_bracket}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
