"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SimpleAuthGuard } from "@/components/simple-auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trophy, Users, Target, TrendingUp, RefreshCw } from "lucide-react"

interface Player {
  id: string
  name: string
  email: string
  payment_status: string
}

interface SeriesData {
  player_id: string
  round_number: number
  game_1: number
  game_2: number
  game_3: number
}

interface Standing {
  player_id: string
  player_name: string
  player_email: string
  total_score: number
  games_played: number
  series_count: number
  average_score: number
  best_game: number
  best_series: number
  position: number
}

export default function AdminResultsPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [standings, setStandings] = useState<Standing[]>([])
  const [seriesData, setSeriesData] = useState<SeriesData>({
    player_id: "",
    round_number: 1,
    game_1: 0,
    game_2: 0,
    game_3: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Load players
      const playersResponse = await fetch("/api/results/players")
      if (playersResponse.ok) {
        const playersData = await playersResponse.json()
        setPlayers(playersData.players || [])
      }

      // Load standings
      const standingsResponse = await fetch("/api/results/standings")
      if (standingsResponse.ok) {
        const standingsData = await standingsResponse.json()
        setStandings(standingsData.standings || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitSeries = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/results/add-series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seriesData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setMessage("Serie agregada exitosamente")
        setSeriesData({
          player_id: "",
          round_number: 1,
          game_1: 0,
          game_2: 0,
          game_3: 0,
        })
        // Reload standings
        loadData()
      } else {
        setMessage(result.error || "Error agregando serie")
      }
    } catch (error) {
      console.error("Error submitting series:", error)
      setMessage("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalScore = seriesData.game_1 + seriesData.game_2 + seriesData.game_3

  return (
    <SimpleAuthGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Resultados</h1>
            <p className="text-gray-600">Administra los resultados del Torneo La Negrita 2025</p>
          </div>

          <Tabs defaultValue="add-series" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-series" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Serie
              </TabsTrigger>
              <TabsTrigger value="standings" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Clasificación
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Jugadores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-series">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Agregar Nueva Serie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitSeries} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="player">Jugador</Label>
                        <Select
                          value={seriesData.player_id}
                          onValueChange={(value) => setSeriesData({ ...seriesData, player_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un jugador" />
                          </SelectTrigger>
                          <SelectContent>
                            {players.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="round">Ronda</Label>
                        <Select
                          value={seriesData.round_number.toString()}
                          onValueChange={(value) =>
                            setSeriesData({ ...seriesData, round_number: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((round) => (
                              <SelectItem key={round} value={round.toString()}>
                                Ronda {round}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="game1">Juego 1</Label>
                        <Input
                          id="game1"
                          type="number"
                          min="0"
                          max="300"
                          value={seriesData.game_1}
                          onChange={(e) =>
                            setSeriesData({ ...seriesData, game_1: Number.parseInt(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="game2">Juego 2</Label>
                        <Input
                          id="game2"
                          type="number"
                          min="0"
                          max="300"
                          value={seriesData.game_2}
                          onChange={(e) =>
                            setSeriesData({ ...seriesData, game_2: Number.parseInt(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="game3">Juego 3</Label>
                        <Input
                          id="game3"
                          type="number"
                          min="0"
                          max="300"
                          value={seriesData.game_3}
                          onChange={(e) =>
                            setSeriesData({ ...seriesData, game_3: Number.parseInt(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Total de la Serie:</span>
                        <span className="text-2xl font-bold text-blue-600">{totalScore}</span>
                      </div>
                    </div>

                    {message && (
                      <Alert
                        className={
                          message.includes("exitosamente") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        }
                      >
                        <AlertDescription
                          className={message.includes("exitosamente") ? "text-green-800" : "text-red-800"}
                        >
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting || !seriesData.player_id}>
                      {isSubmitting ? "Agregando..." : "Agregar Serie"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="standings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Clasificación General
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando clasificación...</p>
                    </div>
                  ) : standings.length > 0 ? (
                    <div className="space-y-2">
                      {standings.map((standing, index) => (
                        <div
                          key={standing.player_id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            index < 3 ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={index < 3 ? "default" : "secondary"}
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                            >
                              {standing.position}
                            </Badge>
                            <div>
                              <h3 className="font-semibold">{standing.player_name}</h3>
                              <p className="text-sm text-gray-600">
                                {standing.series_count} series • {standing.games_played} juegos
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{standing.total_score}</div>
                            <div className="text-sm text-gray-600">
                              Promedio: {standing.average_score.toFixed(1)} • Mejor: {standing.best_game}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay resultados disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="players">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Jugadores Registrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando jugadores...</p>
                    </div>
                  ) : players.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {players.map((player) => (
                        <div key={player.id} className="p-4 border rounded-lg bg-white">
                          <h3 className="font-semibold">{player.name}</h3>
                          <p className="text-sm text-gray-600">{player.email}</p>
                          <div className="flex items-center justify-end mt-2">
                            <Badge variant={player.payment_status === "paid" ? "default" : "secondary"}>
                              {player.payment_status === "paid" ? "Verificado" : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay jugadores registrados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SimpleAuthGuard>
  )
}
