"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Target, Calendar, Save, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Round {
  id: string
  name: string
  date: string
  round_number: number
  status: string
}

interface Player {
  id: string
  name: string
  email: string
}

interface Standing {
  position: number
  player_id: string
  player_name: string
  player_email: string
  total_score: number
  series_count: number
  average_score: number
}

export function TournamentResults() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Form states
  const [newRoundName, setNewRoundName] = useState("")
  const [newRoundDate, setNewRoundDate] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState("")
  const [selectedRound, setSelectedRound] = useState("")
  const [game1Score, setGame1Score] = useState("")
  const [game2Score, setGame2Score] = useState("")
  const [game3Score, setGame3Score] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  /**
   * Lee la respuesta y devuelve JSON si el Content-Type es application/json.
   * Si el content-type no es JSON, devuelve { success:false, error:text }
   * de modo que el resto del flujo pueda gestionarlo sin lanzar una excepción.
   */
  const parseJsonSafely = async (response: Response) => {
    const contentType = response.headers.get("Content-Type") ?? ""
    const rawText = await response.text()

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(rawText)
      } catch (err) {
        console.error("Respuesta JSON malformada:", rawText.slice(0, 200))
        return { success: false, error: "JSON malformado en la respuesta del servidor" }
      }
    }

    // Respuesta no-JSON (probablemente HTML de error 500)
    console.error("Respuesta NO-JSON:", rawText.slice(0, 200))
    return { success: false, error: rawText.trim() || "Respuesta no-JSON del servidor" }
  }

  const fetchData = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      console.log("🔄 Fetching tournament data...")

      const [roundsRes, playersRes, standingsRes] = await Promise.all([
        fetch("/api/results/rounds"),
        fetch("/api/results/players"),
        fetch("/api/results/standings"),
      ])

      /* ---------- Rounds ---------- */
      if (roundsRes.ok) {
        try {
          const json = await parseJsonSafely(roundsRes)
          if (json?.success) {
            console.log("✅ Rounds loaded:", json.rounds?.length || 0)
            setRounds(json.rounds || [])
          }
        } catch (err) {
          console.error("Rounds – error parsing JSON:", err)
          setRounds([])
        }
      } else {
        try {
          const json = await parseJsonSafely(roundsRes)
          console.error("Rounds – HTTP", roundsRes.status, json.error || "Error desconocido")
        } catch (err) {
          console.error("Rounds – HTTP", roundsRes.status, "Error parsing response")
        }
        setRounds([])
      }

      /* ---------- Players ---------- */
      if (playersRes.ok) {
        try {
          const json = await parseJsonSafely(playersRes)
          if (json?.success) {
            console.log("✅ Players loaded:", json.players?.length || 0)
            setPlayers(json.players || [])
          }
        } catch (err) {
          console.error("Players – error parsing JSON:", err)
          setPlayers([])
        }
      } else {
        try {
          const json = await parseJsonSafely(playersRes)
          console.error("Players – HTTP", playersRes.status, json.error || "Error desconocido")
        } catch (err) {
          console.error("Players – HTTP", playersRes.status, "Error parsing response")
        }
        setPlayers([])
      }

      /* ---------- Standings ---------- */
      if (standingsRes.ok) {
        try {
          const json = await parseJsonSafely(standingsRes)
          if (json?.success) {
            console.log("✅ Standings loaded:", json.standings?.length || 0)
            setStandings(json.standings || [])
          }
        } catch (err) {
          console.error("Standings – error parsing JSON:", err)
          setStandings([])
        }
      } else {
        try {
          const json = await parseJsonSafely(standingsRes)
          console.error("Standings – HTTP", standingsRes.status, json.error || "Error desconocido")
        } catch (err) {
          console.error("Standings – HTTP", standingsRes.status, "Error parsing response")
        }
        setStandings([])
      }
    } catch (error) {
      console.error("Error fetching results data:", error)
      setRounds([])
      setPlayers([])
      setStandings([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    await fetchData(true)
    toast({
      title: "Datos actualizados",
      description: "La información se ha actualizado correctamente.",
    })
  }

  const createRound = async () => {
    if (!newRoundName?.trim() || !newRoundDate?.trim()) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor completa el nombre y la fecha de la ronda.",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/results/rounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoundName.trim(),
          date: newRoundDate.trim(),
        }),
      })

      const result = await parseJsonSafely(response)

      if (result.success) {
        setNewRoundName("")
        setNewRoundDate("")
        await fetchData(true) // Refresh data after creating round
        toast({
          title: "¡Ronda creada!",
          description: `La ronda "${newRoundName}" se ha creado exitosamente.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error al crear ronda",
          description: result.error || "Error desconocido",
        })
      }
    } catch (error) {
      console.error("Error creating round:", error)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "No se pudo conectar con el servidor.",
      })
    } finally {
      setSaving(false)
    }
  }

  const addSeries = async () => {
    // Validar que todos los campos estén llenos
    if (
      !selectedPlayer?.trim() ||
      !selectedRound?.trim() ||
      !game1Score?.trim() ||
      !game2Score?.trim() ||
      !game3Score?.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor completa todos los campos antes de continuar.",
      })
      return
    }

    const scores = [game1Score, game2Score, game3Score].map((s) => Number(s.trim()))
    if (scores.some((score) => isNaN(score) || score < 0 || score > 300)) {
      toast({
        variant: "destructive",
        title: "Puntajes inválidos",
        description: "Los puntajes deben ser números entre 0 y 300.",
      })
      return
    }

    try {
      setSaving(true)

      console.log("🎯 Adding series:", {
        player_id: selectedPlayer,
        round_id: selectedRound,
        scores,
      })

      const response = await fetch("/api/results/add-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: selectedPlayer,
          round_id: selectedRound,
          game1: scores[0],
          game2: scores[1],
          game3: scores[2],
        }),
      })

      const result = await parseJsonSafely(response)

      if (result.success) {
        setSelectedPlayer("")
        setSelectedRound("")
        setGame1Score("")
        setGame2Score("")
        setGame3Score("")

        // Refresh data after adding series to update standings
        await fetchData(true)

        toast({
          title: "¡Serie agregada!",
          description: `Serie de ${scores[0] + scores[1] + scores[2]} puntos agregada exitosamente.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error al agregar serie",
          description: result.error || "Error desconocido",
        })
      }
    } catch (error) {
      console.error("Error adding series:", error)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "No se pudo conectar con el servidor.",
      })
    } finally {
      setSaving(false)
    }
  }

  // Helper function to format dates safely
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Fecha no disponible"

      // Try to parse the date
      const date = new Date(dateString)

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return `Fecha inválida: ${dateString}`
      }

      return date.toLocaleDateString("es-CR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return `Error en fecha: ${dateString}`
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-slate-300 font-sans">Cargando resultados...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add-results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <TabsTrigger
            value="add-results"
            className="font-sans text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
          >
            <Target className="h-4 w-4 mr-2" />
            Agregar Resultados
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="font-sans text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Clasificaciones
          </TabsTrigger>
          <TabsTrigger
            value="rounds"
            className="font-sans text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Rondas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-results" className="space-y-6">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-sans text-white">
                <Target className="h-5 w-5 text-blue-400" />
                Agregar Serie de Juegos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans font-semibold text-slate-300">Jugador</Label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar jugador" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {players.map((player) => (
                        <SelectItem
                          key={player.id}
                          value={player.id}
                          className="font-sans text-white hover:bg-slate-600"
                        >
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-sans font-semibold text-slate-300">Ronda</Label>
                  <Select value={selectedRound} onValueChange={setSelectedRound}>
                    <SelectTrigger className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar ronda" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {rounds.map((round) => (
                        <SelectItem key={round.id} value={round.id} className="font-sans text-white hover:bg-slate-600">
                          {round.name} - {formatDate(round.date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-sans font-semibold text-slate-300">Juego 1</Label>
                  <Input
                    type="number"
                    min="0"
                    max="300"
                    value={game1Score}
                    onChange={(e) => setGame1Score(e.target.value)}
                    placeholder="0-300"
                    className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white placeholder:text-slate-400 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
                <div>
                  <Label className="font-sans font-semibold text-slate-300">Juego 2</Label>
                  <Input
                    type="number"
                    min="0"
                    max="300"
                    value={game2Score}
                    onChange={(e) => setGame2Score(e.target.value)}
                    placeholder="0-300"
                    className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white placeholder:text-slate-400 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
                <div>
                  <Label className="font-sans font-semibold text-slate-300">Juego 3</Label>
                  <Input
                    type="number"
                    min="0"
                    max="300"
                    value={game3Score}
                    onChange={(e) => setGame3Score(e.target.value)}
                    placeholder="0-300"
                    className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white placeholder:text-slate-400 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>

              {game1Score && game2Score && game3Score && (
                <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg backdrop-blur-sm">
                  <p className="font-sans font-semibold text-blue-300">
                    Total: {Number(game1Score || 0) + Number(game2Score || 0) + Number(game3Score || 0)} puntos
                  </p>
                </div>
              )}

              <Button
                onClick={addSeries}
                disabled={saving}
                className="w-full bg-blue-700/80 hover:bg-blue-600 text-white font-sans backdrop-blur-sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Agregar Serie
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans text-white">
                <Trophy className="h-5 w-5 text-amber-400" />
                Clasificaciones Generales
              </CardTitle>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300 mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-700">
                      <th className="text-left p-4 font-semibold text-slate-300 font-sans">Posición</th>
                      <th className="text-left p-4 font-semibold text-slate-300 font-sans">Jugador</th>
                      <th className="text-left p-4 font-semibold text-slate-300 font-sans">Total</th>
                      <th className="text-left p-4 font-semibold text-slate-300 font-sans">Series</th>
                      <th className="text-left p-4 font-semibold text-slate-300 font-sans">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing, index) => (
                      <tr
                        key={standing.player_id}
                        className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                          index % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={standing.position <= 3 ? "default" : "secondary"}
                              className={
                                standing.position === 1
                                  ? "bg-amber-900/50 text-amber-300 font-sans"
                                  : standing.position === 2
                                    ? "bg-slate-600 text-slate-300 font-sans"
                                    : standing.position === 3
                                      ? "bg-orange-900/50 text-orange-300 font-sans"
                                      : "bg-slate-700 text-slate-400 font-sans"
                              }
                            >
                              #{standing.position}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-white font-sans">{standing.player_name}</td>
                        <td className="p-4 font-bold text-blue-400 font-sans">{standing.total_score}</td>
                        <td className="p-4 text-slate-300 font-sans">{standing.series_count}</td>
                        <td className="p-4 text-slate-300 font-sans">{standing.average_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {standings.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-sans">No hay clasificaciones disponibles</p>
                    <p className="text-slate-500 font-sans text-sm mt-2">
                      Agrega algunas series de juegos para ver las clasificaciones
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rounds">
          <div className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans text-white">
                  <Plus className="h-5 w-5 text-green-400" />
                  Crear Nueva Ronda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-sans font-semibold text-slate-300">Nombre de la Ronda</Label>
                    <Input
                      value={newRoundName}
                      onChange={(e) => setNewRoundName(e.target.value)}
                      placeholder="Ej: Ronda 1, Semifinal, Final"
                      className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label className="font-sans font-semibold text-slate-300">Fecha</Label>
                    <Input
                      type="date"
                      value={newRoundDate}
                      onChange={(e) => setNewRoundDate(e.target.value)}
                      className="font-sans bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={createRound}
                  disabled={saving}
                  className="bg-green-700/80 hover:bg-green-600 text-white font-sans backdrop-blur-sm"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Ronda
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans text-white">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Rondas Existentes ({rounds.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rounds.map((round) => (
                    <div
                      key={round.id}
                      className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors bg-slate-700/30 backdrop-blur-sm"
                    >
                      <h3 className="font-semibold text-white font-sans">{round.name}</h3>
                      <p className="text-sm text-slate-300 font-sans mt-2">{formatDate(round.date)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant={round.status === "active" ? "default" : "secondary"}
                          className={`font-sans ${
                            round.status === "active" ? "bg-green-900/50 text-green-300" : "bg-slate-600 text-slate-400"
                          }`}
                        >
                          {round.status === "active" ? "Activa" : "Inactiva"}
                        </Badge>
                        <span className="text-xs text-slate-400 font-sans">Ronda #{round.round_number}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {rounds.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-sans">No hay rondas creadas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
