"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Trophy,
  Target,
  AlertCircle,
} from "lucide-react"
import { TournamentResults } from "@/components/tournament-results"
import { TournamentBrackets } from "@/components/tournament-brackets"
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
  qr_validated: boolean
  wallet_address?: string
}

interface TournamentStats {
  total_players: number
  verified_players: number
  pending_players: number
  total_revenue: number
}

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [stats, setStats] = useState<TournamentStats>({
    total_players: 0,
    verified_players: 0,
    pending_players: 0,
    total_revenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showPlayerDetails, setShowPlayerDetails] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const safeJson = async (res: Response) => {
        const txt = await res.text()
        try {
          return JSON.parse(txt)
        } catch {
          console.error("↩️  Non-JSON response:", txt)
          return null
        }
      }

      const [playersRes, statsRes] = await Promise.all([fetch("/api/players"), fetch("/api/tournament-stats")])

      let playersData: any = { players: [] }
      let statsData: any = null

      if (playersRes.ok) {
        const data = await safeJson(playersRes)
        if (data) playersData = data
      } else {
        console.error("🚨 /api/players HTTP", playersRes.status)
      }

      if (statsRes.ok) {
        const data = await safeJson(statsRes)
        if (data) statsData = data
      } else {
        console.error("🚨 /api/tournament-stats HTTP", statsRes.status)
      }

      setPlayers(playersData.players || [])
      setStats(
        statsData || {
          total_players: 0,
          verified_players: 0,
          pending_players: 0,
          total_revenue: 0,
        },
      )
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (playerId: string, status: "pending" | "verified") => {
    try {
      console.log(`Actualizando pago para jugador ${playerId} a ${status}`)

      const response = await fetch("/api/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId, status }),
      })

      const result = await response.json()
      console.log("Respuesta de API:", result)

      if (result.success) {
        // Actualizar el estado local inmediatamente
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player.id === playerId ? { ...player, payment_status: status } : player)),
        )

        // Refrescar datos completos
        await fetchData()

        // Mostrar notificación elegante
        toast({
          title: "✅ Estado actualizado",
          description: `El pago de ${result.playerName} ha sido marcado como ${status === "verified" ? "Verificado" : "Pendiente"}`,
          duration: 3000,
        })
      } else {
        console.error("Error en respuesta:", result.error)
        toast({
          title: "❌ Error",
          description: result.error || "No se pudo actualizar el estado de pago",
          variant: "destructive",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "🔌 Error de conexión",
        description: "Verifica tu internet e intenta de nuevo",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  // Fix the undefined error by adding proper null/undefined checks
  const filteredPlayers = players.filter((player) => {
    if (!player) return false

    const name = player.name || ""
    const email = player.email || ""
    const phone = player.phone || ""
    const search = searchTerm.toLowerCase()

    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search) || phone.includes(searchTerm)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-300 font-body">Cargando datos del torneo...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-900 relative"
      style={{
        backgroundImage: `url('/images/admin-bowling-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay translúcido */}
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"></div>

      {/* Header como el landing */}
      <header className="relative z-50 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-600/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Image
                  src="/images/country-club-logo-transparent.png"
                  alt="Country Club Costa Rica"
                  width={55}
                  height={55}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-white tracking-tight">Torneo La Negrita 2025</h1>
                <p className="text-sm text-gray-300 font-body font-medium">Panel de Administración</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchData}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-gray-600/30 font-accent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-accent font-medium text-slate-300">Total Jugadores</CardTitle>
              <div className="p-2 bg-blue-900/50 rounded-full">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-white">{stats.total_players}</div>
              <div className="flex items-center mt-2 text-sm text-slate-400">
                <TrendingUp className="h-4 w-4 mr-1 text-green-400" />
                <span className="font-body">Registrados</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-accent font-medium text-slate-300">Verificados</CardTitle>
              <div className="p-2 bg-green-900/50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-green-400">{stats.verified_players}</div>
              <div className="flex items-center mt-2 text-sm text-slate-400">
                <UserCheck className="h-4 w-4 mr-1 text-green-400" />
                <span className="font-body">Pagos confirmados</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-accent font-medium text-slate-300">Pendientes</CardTitle>
              <div className="p-2 bg-amber-900/50 rounded-full">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-amber-400">{stats.pending_players}</div>
              <div className="flex items-center mt-2 text-sm text-slate-400">
                <Clock className="h-4 w-4 mr-1 text-amber-400" />
                <span className="font-body">Por verificar</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-accent font-medium text-slate-300">Ingresos Totales</CardTitle>
              <div className="p-2 bg-blue-900/50 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-white">{formatCurrency(stats.total_revenue || 0)}</div>
              <div className="flex items-center mt-2 text-sm text-slate-400">
                <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                <span className="font-body">Recaudado</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="players" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/90 backdrop-blur-sm border-slate-700">
              <TabsTrigger
                value="players"
                className="font-accent text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Jugadores
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="font-accent text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Resultados
              </TabsTrigger>
              <TabsTrigger
                value="brackets"
                className="font-accent text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Llaves
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="players" className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-white">
                  <div className="p-2 bg-blue-900/50 rounded-full">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                  Buscar Jugadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md h-12 bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 font-body"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="font-heading text-white">Jugadores Registrados ({filteredPlayers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-700">
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Nombre</th>
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Email</th>
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Teléfono</th>
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Estado Pago</th>
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Fecha Registro</th>
                        <th className="text-left p-4 font-heading font-semibold text-slate-300">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player, index) => (
                        <tr
                          key={player.id}
                          className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                            index % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"
                          }`}
                        >
                          <td className="p-4 font-body font-medium text-white">{player.name}</td>
                          <td className="p-4 text-sm text-slate-300 font-body">{player.email}</td>
                          <td className="p-4 text-sm text-slate-300 font-body">{player.phone}</td>
                          <td className="p-4">
                            <Badge
                              variant={player.payment_status === "verified" ? "default" : "secondary"}
                              className={
                                player.payment_status === "verified"
                                  ? "bg-green-900/50 text-green-300 border-green-700 font-accent"
                                  : "bg-amber-900/50 text-amber-300 border-amber-700 font-accent"
                              }
                            >
                              {player.payment_status === "verified" ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verificado
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Pendiente
                                </>
                              )}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-slate-300 font-body">
                            {new Date(player.created_at).toLocaleDateString("es-CR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPlayer(player)
                                  setShowPlayerDetails(true)
                                }}
                                className="bg-slate-700/80 hover:bg-slate-600 border-slate-600 text-slate-300 hover:text-white font-accent backdrop-blur-sm"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {player.payment_status === "pending" ? (
                                <Button
                                  size="sm"
                                  onClick={() => updatePaymentStatus(player.id, "verified")}
                                  className="bg-green-700/80 hover:bg-green-600 text-white border-0 font-accent backdrop-blur-sm"
                                  title="Verificar pago"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => updatePaymentStatus(player.id, "pending")}
                                  className="bg-red-700/80 hover:bg-red-600 text-white border-0 font-accent backdrop-blur-sm"
                                  title="Marcar como pendiente"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredPlayers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 font-body">
                        {searchTerm ? "No se encontraron jugadores con ese criterio" : "No hay jugadores registrados"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <TournamentResults />
          </TabsContent>

          <TabsContent value="brackets">
            <TournamentBrackets />
          </TabsContent>
        </Tabs>
      </div>

      {showPlayerDetails && selectedPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-md border-slate-700">
            <CardHeader className="bg-gradient-to-r from-slate-700/95 to-slate-800/95 text-white border-b border-slate-600">
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detalles del Jugador
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPlayerDetails(false)}
                  className="text-slate-300 hover:text-white hover:bg-slate-600"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-heading font-semibold text-slate-300">Nombre Completo</Label>
                  <Input
                    value={selectedPlayer.name}
                    readOnly
                    className="font-body bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="font-heading font-semibold text-slate-300">Email</Label>
                  <Input
                    value={selectedPlayer.email}
                    readOnly
                    className="font-body bg-\
