"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SimpleAuthGuard } from "@/components/simple-auth-guard"
import { RefreshCw, Users, DollarSign, Eye, CheckCircle, XCircle, Clock, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Player {
  id: number
  name: string
  email: string
  phone: string
  nationality: string
  handicap: boolean
  senior: boolean
  scratch: boolean
  total_cost: number
  payment_status: string
  created_at: string
}

interface Stats {
  total_players: number
  total_revenue: number
  pending_payments: number
  confirmed_payments: number
  handicap_players: number
  senior_players: number
  scratch_players: number
  nacional_players: number
  extranjero_players: number
}

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(60) // seconds
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) {
        setRefreshing(true)
      }

      try {
        const [playersRes, statsRes] = await Promise.all([
          fetch("/api/players", { cache: "no-store" }),
          fetch("/api/tournament-stats", { cache: "no-store" }),
        ])

        if (playersRes.ok && statsRes.ok) {
          const playersData = await playersRes.json()
          const statsData = await statsRes.json()

          setPlayers(playersData.players || [])
          setStats(statsData)

          if (silent) {
            toast({
              title: "Datos actualizados",
              description: "Información actualizada automáticamente",
              duration: 2000,
            })
          }
        } else {
          throw new Error("Error fetching data")
        }
      } catch (error) {
        console.error("Error:", error)
        if (!silent) {
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos",
            variant: "destructive",
          })
        }
      } finally {
        if (!silent) {
          setRefreshing(false)
        }
        setLoading(false)
      }
    },
    [toast],
  )

  // Check online status
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

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || !isOnline) return

    const interval = setInterval(() => {
      // Don't auto-refresh if user is viewing player details
      if (!selectedPlayer && document.visibilityState === "visible") {
        fetchData(true) // Silent refresh
      }
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, selectedPlayer, fetchData, isOnline])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleManualRefresh = () => {
    fetchData(false) // Non-silent refresh
  }

  const updatePaymentStatus = async (playerId: number, status: string) => {
    try {
      const response = await fetch("/api/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, status }),
      })

      if (response.ok) {
        await fetchData(true)
        toast({
          title: "Estado actualizado",
          description: `Pago marcado como ${status}`,
        })
      } else {
        throw new Error("Error updating payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pago",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number, nationality: string) => {
    if (nationality === "Nacional") {
      return `₡${amount.toLocaleString()}`
    } else {
      return `$${amount.toLocaleString()}`
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verificado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      default:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Sin pagar
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <SimpleAuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Cargando panel de administración...</p>
          </div>
        </div>
      </SimpleAuthGuard>
    )
  }

  return (
    <SimpleAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-gray-600">Torneo La Negrita 2025</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Online Status */}
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">En línea</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Sin conexión</span>
                    </>
                  )}
                </div>

                {/* Auto-refresh controls */}
                <div className="flex items-center gap-2">
                  <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  <Label htmlFor="auto-refresh" className="text-sm">
                    {autoRefresh ? "🟢 Auto" : "⚫ Manual"}
                  </Label>
                </div>

                {/* Refresh interval */}
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={30}>30s</option>
                  <option value={60}>1min</option>
                  <option value={120}>2min</option>
                  <option value={300}>5min</option>
                </select>

                {/* Manual refresh button */}
                <Button onClick={handleManualRefresh} disabled={refreshing} variant="outline" size="sm">
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jugadores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_players}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₡{stats.total_revenue.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Verificados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.confirmed_payments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pending_payments}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs defaultValue="players" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="players">Jugadores Registrados</TabsTrigger>
              <TabsTrigger value="categories">Por Categorías</TabsTrigger>
              <TabsTrigger value="payments">Estado de Pagos</TabsTrigger>
            </TabsList>

            <TabsContent value="players" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Jugadores</CardTitle>
                  <CardDescription>{players.length} jugadores registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold">{player.name}</h3>
                              <p className="text-sm text-gray-600">{player.email}</p>
                              <p className="text-sm text-gray-600">{player.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{player.nationality}</Badge>
                              {player.handicap && <Badge>Handicap</Badge>}
                              {player.senior && <Badge>Senior</Badge>}
                              {player.scratch && <Badge>Scratch</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(player.total_cost, player.nationality)}</p>
                            {getPaymentStatusBadge(player.payment_status)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPlayer(player)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {player.payment_status !== "verified" && (
                              <Button size="sm" onClick={() => updatePaymentStatus(player.id, "verified")}>
                                Verificar Pago
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Por Nacionalidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Nacionales:</span>
                          <span className="font-semibold">{stats.nacional_players}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Extranjeros:</span>
                          <span className="font-semibold">{stats.extranjero_players}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Handicap:</span>
                          <span className="font-semibold">{stats.handicap_players}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Senior:</span>
                          <span className="font-semibold">{stats.senior_players}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Scratch:</span>
                          <span className="font-semibold">{stats.scratch_players}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Pagos</CardTitle>
                  <CardDescription>Gestión de confirmaciones de pago</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players
                      .filter((p) => p.payment_status !== "verified")
                      .map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{player.name}</h3>
                            <p className="text-sm text-gray-600">{player.email}</p>
                            <p className="text-sm font-medium">
                              {formatCurrency(player.total_cost, player.nationality)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            {getPaymentStatusBadge(player.payment_status)}
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updatePaymentStatus(player.id, "verified")}>
                                Verificar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePaymentStatus(player.id, "pending")}
                              >
                                Pendiente
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Player Details Modal */}
          {selectedPlayer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>Detalles del Jugador</CardTitle>
                  <Button
                    className="absolute top-4 right-4"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlayer(null)}
                  >
                    ✕
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nombre</label>
                      <p className="font-semibold">{selectedPlayer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p>{selectedPlayer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Teléfono</label>
                      <p>{selectedPlayer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nacionalidad</label>
                      <p>{selectedPlayer.nationality}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Costo Total</label>
                      <p className="font-semibold">
                        {formatCurrency(selectedPlayer.total_cost, selectedPlayer.nationality)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado de Pago</label>
                      <div className="mt-1">{getPaymentStatusBadge(selectedPlayer.payment_status)}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Categorías</label>
                      <div className="flex gap-2 mt-1">
                        {selectedPlayer.handicap && <Badge>Handicap</Badge>}
                        {selectedPlayer.senior && <Badge>Senior</Badge>}
                        {selectedPlayer.scratch && <Badge>Scratch</Badge>}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                      <p>{new Date(selectedPlayer.created_at).toLocaleString("es-ES")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </SimpleAuthGuard>
  )
}
