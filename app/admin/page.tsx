"use client"

import { useState, useEffect, useRef } from "react"
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
  Wifi,
  WifiOff,
  Package,
} from "lucide-react"
import { TournamentResults } from "@/components/tournament-results"
import { TournamentBrackets } from "@/components/tournament-brackets"
import Image from "next/image"
import { PaymentModal } from "@/components/payment-modal"
import { determinePackageFromAmount, formatCurrency } from "@/lib/payment-utils"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  emergency_contact: string
  emergency_phone: string
  payment_status: "pending" | "verified" | "partial"
  created_at: string
  qr_validated: boolean
  wallet_address?: string
  nationality?: string
  country?: string
  package_type?: string
  scratch_mode?: boolean
  amount_paid?: number
  currency?: string
  payment_method?: string
  payment_notes?: string
  payment_updated_at?: string
  package_details?: string
  category_details?: string
  payment_display?: string
  payment_details?: {
    package_type: string
    category: string
    amount: number
    currency: string
    formatted_amount: string
  }
  category_a?: boolean
  category_b?: boolean
  category_c?: boolean
  category_senior?: boolean
  category_super_senior?: boolean
  category_master?: boolean
  category_female?: boolean
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
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showPlayerDetails, setShowPlayerDetails] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string>("")
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(60) // 60 segundos por defecto
  const [isOnline, setIsOnline] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    fetchData()
    setupAutoRefresh()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setupAutoRefresh()
  }, [autoRefreshEnabled, refreshInterval])

  const setupAutoRefresh = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Setup new interval if enabled
    if (autoRefreshEnabled && isOnline) {
      intervalRef.current = setInterval(() => {
        // Only auto-refresh if user is not interacting with modals or forms
        if (!showPlayerDetails && document.visibilityState === "visible") {
          silentRefresh()
        }
      }, refreshInterval * 1000)
    }
  }

  const fetchData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      console.log("🔄 Fetching fresh data at:", new Date().toISOString())

      // Add cache-busting timestamp
      const timestamp = Date.now()

      const [playersRes, statsRes] = await Promise.all([
        fetch(`/api/players?t=${timestamp}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }),
        fetch(`/api/tournament-stats?t=${timestamp}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }),
      ])

      console.log("📊 Players API Response:", playersRes.status, playersRes.statusText)
      console.log("📈 Stats API Response:", statsRes.status, statsRes.statusText)

      let playersData: any = { players: [] }
      let statsData: any = null

      if (playersRes.ok) {
        const data = await playersRes.json()
        console.log("👥 Players data received:", data)
        playersData = { players: data.players || [] }
      } else {
        console.error("❌ Players API failed:", playersRes.status, await playersRes.text())
        if (!silent) {
          toast({
            title: "Error cargando jugadores",
            description: `HTTP ${playersRes.status}: ${playersRes.statusText}`,
            variant: "destructive",
          })
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        console.log("📊 Stats data received:", data)
        statsData = data
      } else {
        console.error("❌ Stats API failed:", statsRes.status, await statsRes.text())
        if (!silent) {
          toast({
            title: "Error cargando estadísticas",
            description: `HTTP ${statsRes.status}: ${statsRes.statusText}`,
            variant: "destructive",
          })
        }
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

      setLastRefresh(new Date().toLocaleTimeString())
      console.log("✅ Data updated successfully")

      if (silent) {
        // Show subtle notification for background refresh
        toast({
          title: "📊 Datos actualizados",
          description: "Información sincronizada automáticamente",
          duration: 2000,
        })
      }
    } catch (error) {
      console.error("💥 Error fetching data:", error)
      if (!silent) {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const silentRefresh = () => {
    fetchData(true)
  }

  const forceRefresh = async () => {
    console.log("🔄 Force refresh triggered")

    try {
      setRefreshing(true)

      // Call force refresh endpoint
      const response = await fetch("/api/force-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        console.log("🔄 Force refresh result:", result)
        toast({
          title: "🔄 Conexión refrescada",
          description: "Datos actualizados desde la base de datos",
        })
      }
    } catch (error) {
      console.error("❌ Force refresh failed:", error)
    }

    // Then fetch fresh data
    await fetchData()
  }

  const updatePaymentStatus = async (playerId: string, status: "pending" | "verified") => {
    try {
      console.log(`💳 Updating payment for player ${playerId} to ${status}`)

      const response = await fetch("/api/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId, status }),
      })

      const result = await response.json()
      console.log("💳 Payment update response:", result)

      if (result.success) {
        // Update local state immediately
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player.id === playerId ? { ...player, payment_status: status } : player)),
        )

        // Force refresh data from server
        await fetchData(true)

        toast({
          title: "✅ Estado actualizado",
          description: `El pago de ${result.playerName} ha sido marcado como ${status === "verified" ? "Verificado" : "Pendiente"}`,
          duration: 3000,
        })
      } else {
        console.error("❌ Payment update failed:", result.error)
        toast({
          title: "❌ Error",
          description: result.error || "No se pudo actualizar el estado de pago",
          variant: "destructive",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("💥 Error updating payment status:", error)
      toast({
        title: "🔌 Error de conexión",
        description: "Verifica tu internet e intenta de nuevo",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled)
    toast({
      title: autoRefreshEnabled ? "⏸️ Auto-actualización desactivada" : "▶️ Auto-actualización activada",
      description: autoRefreshEnabled
        ? "Los datos no se actualizarán automáticamente"
        : `Los datos se actualizarán cada ${refreshInterval} segundos`,
      duration: 3000,
    })
  }

  const changeRefreshInterval = (seconds: number) => {
    setRefreshInterval(seconds)
    toast({
      title: "⏱️ Intervalo actualizado",
      description: `Los datos se actualizarán cada ${seconds} segundos`,
      duration: 2000,
    })
  }

  const filteredPlayers = players.filter((player) => {
    if (!player) return false

    const name = player.name || ""
    const email = player.email || ""
    const phone = player.phone || ""
    const search = searchTerm.toLowerCase()

    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search) || phone.includes(searchTerm)
  })

  const formatPaymentAmount = (player: Player) => {
    const amount = player.amount_paid || 0
    if (amount === 0) return "$0.00"
    return formatCurrency(amount)
  }

  // Función para determinar qué paquete pagó realmente la persona
  const getPaidPackageInfo = (player: Player) => {
    const amount = player.amount_paid || 0
    const currency = player.currency || "USD"
    const isNational = player.nationality === "Nacional" || player.country === "national"

    if (amount === 0) {
      return {
        type: "none",
        name: "Sin Pago",
        color: "bg-red-900/50 text-red-300 border-red-700",
        description: "No ha realizado ningún pago",
      }
    }

    const packageInfo = determinePackageFromAmount(amount, currency, isNational, player.created_at)

    let color = "bg-blue-900/50 text-blue-300 border-blue-700"
    if (packageInfo.type === "package8") color = "bg-purple-900/50 text-purple-300 border-purple-700"
    else if (packageInfo.type === "package5") color = "bg-green-900/50 text-green-300 border-green-700"
    else if (packageInfo.type === "package4") color = "bg-amber-900/50 text-amber-300 border-amber-700"
    else if (packageInfo.type === "package3") color = "bg-blue-900/50 text-blue-300 border-blue-700"
    else if (packageInfo.type === "basic") color = "bg-slate-600/50 text-slate-400 border-slate-500"
    else if (packageInfo.type === "custom") color = "bg-orange-900/50 text-orange-300 border-orange-700"

    return { ...packageInfo, color }
  }

  const getRegisteredPackageInfo = (player: Player) => {
    const isNational = player.nationality === "Nacional" || player.country === "national"
    const packageType = player.package_type || "basic"
    const hasScratch = player.scratch_mode || false
    const registrationDate = new Date(player.created_at)
    const earlyBirdDeadline = new Date("2025-07-22T23:59:59.999Z")
    const isEarlyBird = registrationDate <= earlyBirdDeadline

    let packageInfo = {
      name: "Básico",
      description: "Paquete estándar",
      type: "basic",
    }

    if (isNational) {
      // Paquetes nacionales
      switch (packageType) {
        case "package3":
          packageInfo = {
            name: "3 Reenganches",
            description: `Paquete con 3 oportunidades de reenganche (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "package3",
          }
          break
        case "package4":
          packageInfo = {
            name: "4 Reenganches",
            description: `Paquete con 4 oportunidades de reenganche (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "package4",
          }
          break
        default:
          packageInfo = {
            name: "Básico Nacional",
            description: `Paquete básico para jugadores nacionales (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "basic",
          }
      }
    } else {
      // Paquetes internacionales
      switch (packageType) {
        case "package3":
          packageInfo = {
            name: "3 Reenganches",
            description: `Paquete con 3 oportunidades de reenganche (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "package3",
          }
          break
        case "package5":
          packageInfo = {
            name: "5 Reenganches",
            description: `Paquete con 5 oportunidades de reenganche (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "package5",
          }
          break
        case "package8":
          packageInfo = {
            name: "8 Reenganches (Desesperado)",
            description: `Paquete máximo con 8 oportunidades de reenganche (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "package8",
          }
          break
        default:
          packageInfo = {
            name: "Básico Internacional",
            description: `Paquete básico para jugadores internacionales (${isEarlyBird ? "Early Bird" : "Tarifa Regular"})`,
            type: "basic",
          }
      }
    }

    // Agregar scratch si aplica
    if (hasScratch) {
      packageInfo.name += " + Scratch"
      packageInfo.description += " + Modo Scratch"
    }

    return packageInfo
  }

  // Calcular totales localmente para verificar
  const calculateLocalTotals = () => {
    let totalRevenue = 0
    let verifiedRevenue = 0
    let pendingRevenue = 0

    players.forEach((player) => {
      const amount = player.amount_paid || 0
      if (amount > 0) {
        totalRevenue += amount
        if (player.payment_status === "verified") {
          verifiedRevenue += amount
        } else {
          pendingRevenue += amount
        }
      }
    })

    return { totalRevenue, verifiedRevenue, pendingRevenue }
  }

  const localTotals = calculateLocalTotals()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-300 font-body">Cargando datos del torneo...</p>
          <p className="mt-2 text-slate-500 text-sm">Conectando con Supabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
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
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"></div>

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
                  <div className="flex items-center gap-2 mt-1">
                    {lastRefresh && <p className="text-xs text-gray-500">Última actualización: {lastRefresh}</p>}
                    <div className="flex items-center gap-1">
                      {isOnline ? (
                        <Wifi className="w-3 h-3 text-green-400" />
                      ) : (
                        <WifiOff className="w-3 h-3 text-red-400" />
                      )}
                      <span className="text-xs text-gray-500">{isOnline ? "En línea" : "Sin conexión"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Auto-refresh controls */}
                <div className="flex items-center gap-2 mr-4">
                  <Button
                    onClick={toggleAutoRefresh}
                    variant="ghost"
                    size="sm"
                    className={`text-xs px-2 py-1 ${
                      autoRefreshEnabled
                        ? "text-green-300 hover:text-green-200 hover:bg-green-900/20"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/20"
                    }`}
                  >
                    {autoRefreshEnabled ? "🟢 Auto" : "⚫ Manual"}
                  </Button>

                  {autoRefreshEnabled && (
                    <select
                      value={refreshInterval}
                      onChange={(e) => changeRefreshInterval(Number(e.target.value))}
                      className="text-xs bg-slate-800 text-slate-300 border border-slate-600 rounded px-2 py-1"
                    >
                      <option value={30}>30s</option>
                      <option value={60}>1min</option>
                      <option value={120}>2min</option>
                      <option value={300}>5min</option>
                    </select>
                  )}
                </div>

                <Button
                  onClick={forceRefresh}
                  variant="ghost"
                  size="sm"
                  disabled={refreshing}
                  className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-gray-600/30 font-accent"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Actualizando..." : "Actualizar"}
                </Button>

                <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                  <Users className="w-3 h-3 mr-1" />
                  {stats.total_players} Jugadores
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="text-3xl font-heading font-bold text-white">
                  {formatCurrency(stats.total_revenue || localTotals.totalRevenue)}
                </div>
                <div className="flex items-center mt-2 text-sm text-slate-400">
                  <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                  <span className="font-body">Recaudado en USD</span>
                </div>
                {/* Mostrar desglose local si hay diferencia */}
                {Math.abs((stats.total_revenue || 0) - localTotals.totalRevenue) > 0.01 && (
                  <div className="mt-2 text-xs text-amber-400">Local: {formatCurrency(localTotals.totalRevenue)}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mostrar desglose detallado de ingresos */}
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Desglose de Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Total Recaudado</div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(localTotals.totalRevenue)}</div>
                  <div className="text-xs text-slate-500">Todos los pagos</div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                  <div className="text-sm text-green-400">Pagos Verificados</div>
                  <div className="text-2xl font-bold text-green-300">{formatCurrency(localTotals.verifiedRevenue)}</div>
                  <div className="text-xs text-green-500">Confirmados</div>
                </div>
                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                  <div className="text-sm text-amber-400">Pagos Pendientes</div>
                  <div className="text-2xl font-bold text-amber-300">{formatCurrency(localTotals.pendingRevenue)}</div>
                  <div className="text-xs text-amber-500">Por verificar</div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <CardTitle className="font-heading text-white">
                    Jugadores Registrados ({filteredPlayers.length})
                  </CardTitle>
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
                          <th className="text-left p-4 font-heading font-semibold text-slate-300">
                            Paquete Registrado
                          </th>
                          <th className="text-left p-4 font-heading font-semibold text-slate-300">Paquete Pagado</th>
                          <th className="text-left p-4 font-heading font-semibold text-slate-300">Monto Pagado</th>
                          <th className="text-left p-4 font-heading font-semibold text-slate-300">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlayers.map((player, index) => {
                          const registeredPackage = getRegisteredPackageInfo(player)
                          const paidPackage = getPaidPackageInfo(player)
                          return (
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
                                <div className="flex items-center">
                                  <Package className="w-3 h-3 mr-1 text-blue-400" />
                                  {registeredPackage.name}
                                </div>
                              </td>
                              <td className="p-4 text-sm font-body">
                                <Badge className={paidPackage.color}>{paidPackage.name}</Badge>
                              </td>
                              <td className="p-4 text-sm text-slate-300 font-body font-semibold">
                                <div className="flex flex-col">
                                  <span className="text-white font-bold">{formatPaymentAmount(player)}</span>
                                </div>
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
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedPlayer({
                                        ...player,
                                        amount_paid: player.amount_paid || 0,
                                        currency: "USD",
                                        package_details: registeredPackage.name,
                                        category_details: player.category_details || "No especificada",
                                      })
                                      setShowPaymentModal(true)
                                    }}
                                    className="bg-blue-700/80 hover:bg-blue-600 text-white border-0 font-accent backdrop-blur-sm"
                                    title="Registrar pago"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
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
      </div>

      {showPlayerDetails && selectedPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-md border-slate-700">
            <CardHeader className="bg-gradient-to-r from-slate-700/95 to-slate-800/95 text-white border-b border-slate-600">
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Información de Pago - {selectedPlayer.name}
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
              {/* Paquete Registrado */}
              <div className="border-b border-slate-600 pb-4">
                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Paquete Registrado
                </h3>
                <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-md p-4">
                  {(() => {
                    const registeredPackage = getRegisteredPackageInfo(selectedPlayer)
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-400" />
                            <span className="font-body text-white font-bold text-lg">{registeredPackage.name}</span>
                          </div>
                          <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                            {registeredPackage.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded">
                          <strong>Descripción:</strong> {registeredPackage.description}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-slate-800/50 p-3 rounded">
                            <div className="text-slate-400">Nacionalidad:</div>
                            <div className="text-white font-semibold">
                              {selectedPlayer.nationality === "Nacional" ? "🇨🇷 Nacional" : "🌍 Internacional"}
                            </div>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded">
                            <div className="text-slate-400">Scratch Mode:</div>
                            <div className="text-white font-semibold">
                              {selectedPlayer.scratch_mode ? (
                                <span className="text-amber-400">✓ Incluido</span>
                              ) : (
                                <span className="text-slate-500">✗ No incluido</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Paquete que realmente pagó */}
              <div className="border-b border-slate-600 pb-4">
                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Paquete Pagado (Basado en Monto)
                </h3>
                <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-md p-4">
                  {(() => {
                    const paidPackage = getPaidPackageInfo(selectedPlayer)
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span className="font-body text-white font-bold text-lg">{paidPackage.name}</span>
                          </div>
                          <Badge className={paidPackage.color}>{paidPackage.type}</Badge>
                        </div>
                        <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded">
                          <strong>Descripción:</strong>{" "}
                          {paidPackage.description || "Paquete determinado por el monto pagado"}
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded">
                          <div className="text-slate-400 mb-2">Monto Pagado:</div>
                          <div className="text-2xl font-bold text-green-400">{formatPaymentAmount(selectedPlayer)}</div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Información de Pago */}
              <div>
                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Información de Pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading font-semibold text-slate-300">Estado de Pago</Label>
                    <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-md p-3">
                      <Badge
                        variant={selectedPlayer.payment_status === "verified" ? "default" : "secondary"}
                        className={
                          selectedPlayer.payment_status === "verified"
                            ? "bg-green-900/50 text-green-300 border-green-700 font-accent"
                            : "bg-amber-900/50 text-amber-300 border-amber-700 font-accent"
                        }
                      >
                        {selectedPlayer.payment_status === "verified" ? (
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
                    </div>
                  </div>
                  <div>
                    <Label className="font-heading font-semibold text-slate-300">Monto Pagado</Label>
                    <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-md p-3">
                      <div className="text-2xl font-bold text-white">{formatPaymentAmount(selectedPlayer)}</div>
                      <div className="text-sm text-slate-400 mt-1">Moneda: USD</div>
                    </div>
                  </div>
                  <div>
                    <Label className="font-heading font-semibold text-slate-300">Método de Pago</Label>
                    <Input
                      value={selectedPlayer.payment_method || "No registrado"}
                      readOnly
                      className="font-body bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="font-heading font-semibold text-slate-300">Última Actualización</Label>
                    <Input
                      value={
                        selectedPlayer.payment_updated_at
                          ? new Date(selectedPlayer.payment_updated_at).toLocaleDateString("es-CR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No actualizado"
                      }
                      readOnly
                      className="font-body bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="font-heading font-semibold text-slate-300">Notas del Pago</Label>
                    <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-md p-3 min-h-[60px]">
                      <span className="font-body text-white">
                        {selectedPlayer.payment_notes || "Sin notas adicionales"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showPaymentModal && selectedPlayer && (
        <PaymentModal
          player={selectedPlayer}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentUpdated={() => {
            fetchData(true)
            setShowPaymentModal(false)
          }}
        />
      )}
    </div>
  )
}
