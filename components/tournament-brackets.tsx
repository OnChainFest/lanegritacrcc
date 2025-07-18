"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trophy, Users, Save, RefreshCw, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Bracket {
  id: string
  bracket_name: string
  bracket_type: string
  max_players: number
  current_players: number
  status: string
  created_at: string
}

interface Player {
  id: string
  name: string
  email: string
  payment_status?: string
}

interface Participant {
  id: string
  player_id: string
  player_name: string
  player_email: string
  position: number
  status: string
}

export function TournamentBrackets() {
  const [brackets, setBrackets] = useState<Bracket[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [selectedBracketForView, setSelectedBracketForView] = useState<Bracket | null>(null)
  const { toast } = useToast()

  // Form states
  const [newBracketName, setNewBracketName] = useState("")
  const [newBracketType, setNewBracketType] = useState("")
  const [maxPlayers, setMaxPlayers] = useState("16")
  const [selectedBracket, setSelectedBracket] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("🏆 Fetching brackets and players data...")

      const [bracketsRes, playersRes] = await Promise.all([
        fetch("/api/brackets").catch((err) => {
          console.error("Error fetching brackets:", err)
          return { ok: false, status: 500, text: () => Promise.resolve("Network error") }
        }),
        fetch("/api/results/players").catch((err) => {
          console.error("Error fetching players:", err)
          return { ok: false, status: 500, text: () => Promise.resolve("Network error") }
        }),
      ])

      /* ---------- Brackets ---------- */
      if (bracketsRes.ok) {
        try {
          const bracketsData = await bracketsRes.json()
          console.log("🏆 Brackets response:", bracketsData)
          if (bracketsData?.success) {
            setBrackets(bracketsData.brackets || [])
          } else {
            console.error("Brackets API returned error:", bracketsData?.error)
            setBrackets([])
          }
        } catch (err) {
          console.error("Brackets - invalid JSON:", err)
          setBrackets([])
        }
      } else {
        console.error("Brackets - HTTP", bracketsRes.status)
        setBrackets([])
      }

      /* ---------- Players ---------- */
      if (playersRes.ok) {
        try {
          const playersData = await playersRes.json()
          console.log("🏆 Players response:", playersData)
          if (playersData?.success) {
            setPlayers(playersData.players || [])
            console.log(`🏆 Loaded ${playersData.players?.length || 0} players for brackets`)
          } else {
            console.error("Players API returned error:", playersData?.error)
            setPlayers([])
          }
        } catch (err) {
          console.error("Players - invalid JSON:", err)
          setPlayers([])
        }
      } else {
        console.error("Players - HTTP", playersRes.status)
        setPlayers([])
      }
    } catch (error) {
      console.error("Error fetching brackets data:", error)
      setBrackets([])
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipants = async (bracketId: string) => {
    try {
      setLoadingParticipants(true)
      const response = await fetch(`/api/brackets/participants/${bracketId}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setParticipants(data.participants)
        } else {
          console.error("Error fetching participants:", data.error)
          setParticipants([])
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar los participantes del bracket.",
          })
        }
      } else {
        console.error("HTTP error fetching participants:", response.status)
        setParticipants([])
      }
    } catch (error) {
      console.error("Error fetching participants:", error)
      setParticipants([])
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
      })
    } finally {
      setLoadingParticipants(false)
    }
  }

  const safeParse = async (res: Response) => {
    const ct = res.headers.get("content-type") ?? ""
    if (ct.includes("application/json")) {
      try {
        return await res.json()
      } catch (_) {
        /* no-op */
      }
    }
    return { success: false, error: await res.text() }
  }

  const createBracket = async () => {
    if (!newBracketName || !newBracketType) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor completa todos los campos antes de continuar.",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/brackets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bracket_name: newBracketName,
          bracket_type: newBracketType,
          max_players: Number(maxPlayers),
        }),
      })

      const result = await safeParse(response)

      if (result.success) {
        setNewBracketName("")
        setNewBracketType("")
        setMaxPlayers("16")
        fetchData()
        toast({
          title: "¡Bracket creado!",
          description: `El bracket "${newBracketName}" se ha creado exitosamente.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error al crear bracket",
          description: result.error ?? "Respuesta no válida del servidor",
        })
      }
    } catch (error) {
      console.error("Error creating bracket:", error)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta nuevamente.",
      })
    } finally {
      setSaving(false)
    }
  }

  const addPlayerToBracket = async () => {
    if (!selectedBracket || !selectedPlayer) {
      toast({
        variant: "destructive",
        title: "Selección requerida",
        description: "Por favor selecciona un bracket y un jugador.",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/brackets/add-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bracket_id: selectedBracket,
          player_id: selectedPlayer,
        }),
      })

      const result = await safeParse(response)

      if (result.success) {
        setSelectedBracket("")
        setSelectedPlayer("")
        fetchData()
        toast({
          title: "¡Jugador agregado!",
          description: "El jugador se ha agregado al bracket exitosamente.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error al agregar jugador",
          description: result.error ?? "Respuesta no válida del servidor",
        })
      }
    } catch (error) {
      console.error("Error adding player to bracket:", error)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta nuevamente.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleViewParticipants = async (bracket: Bracket) => {
    setSelectedBracketForView(bracket)
    await fetchParticipants(bracket.id)
  }

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-['Inter']">Cargando brackets...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crear Bracket */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-['Montserrat'] text-gray-800">
              <Plus className="h-5 w-5 text-green-600" />
              Crear Nuevo Bracket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-['Inter'] font-semibold">Nombre del Bracket</Label>
              <Input
                value={newBracketName}
                onChange={(e) => setNewBracketName(e.target.value)}
                placeholder="Ej: Eliminatorias, Semifinal, Final"
                className="font-['Inter']"
              />
            </div>

            <div>
              <Label className="font-['Inter'] font-semibold">Tipo de Bracket</Label>
              <Select value={newBracketType} onValueChange={setNewBracketType}>
                <SelectTrigger className="font-['Inter']">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-elimination" className="font-['Inter']">
                    Eliminación Simple
                  </SelectItem>
                  <SelectItem value="double-elimination" className="font-['Inter']">
                    Eliminación Doble
                  </SelectItem>
                  <SelectItem value="round-robin" className="font-['Inter']">
                    Round Robin
                  </SelectItem>
                  <SelectItem value="swiss" className="font-['Inter']">
                    Sistema Suizo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-['Inter'] font-semibold">Máximo de Jugadores</Label>
              <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                <SelectTrigger className="font-['Inter']">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8" className="font-['Inter']">
                    8 Jugadores
                  </SelectItem>
                  <SelectItem value="16" className="font-['Inter']">
                    16 Jugadores
                  </SelectItem>
                  <SelectItem value="32" className="font-['Inter']">
                    32 Jugadores
                  </SelectItem>
                  <SelectItem value="64" className="font-['Inter']">
                    64 Jugadores
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={createBracket}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 font-['Inter']"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Bracket
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Agregar Jugador a Bracket */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-['Montserrat'] text-gray-800">
              <Users className="h-5 w-5 text-blue-600" />
              Agregar Jugador a Bracket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-['Inter'] font-semibold">Bracket</Label>
              <Select value={selectedBracket} onValueChange={setSelectedBracket}>
                <SelectTrigger className="font-['Inter']">
                  <SelectValue placeholder="Seleccionar bracket" />
                </SelectTrigger>
                <SelectContent>
                  {brackets
                    .filter((bracket) => bracket.current_players < bracket.max_players)
                    .map((bracket) => (
                      <SelectItem key={bracket.id} value={bracket.id} className="font-['Inter']">
                        {bracket.bracket_name} ({bracket.current_players}/{bracket.max_players})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-['Inter'] font-semibold">Jugador ({players.length} disponibles)</Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="font-['Inter']">
                  <SelectValue placeholder="Seleccionar jugador" />
                </SelectTrigger>
                <SelectContent>
                  {players.length > 0 ? (
                    players.map((player) => (
                      <SelectItem key={player.id} value={player.id} className="font-['Inter']">
                        {player.name} - {player.email}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-players" disabled className="font-['Inter'] text-gray-500">
                      No hay jugadores verificados disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={addPlayerToBracket}
              disabled={saving || players.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 font-['Inter']"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agregando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Agregar Jugador
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Brackets */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-['Montserrat'] text-gray-800">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Brackets Existentes ({brackets.length})
          </CardTitle>
          <Button onClick={fetchData} variant="outline" size="sm" className="font-['Inter'] bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brackets.map((bracket) => (
              <div
                key={bracket.id}
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 font-['Inter'] text-lg">{bracket.bracket_name}</h3>
                  <Badge variant={bracket.status === "active" ? "default" : "secondary"} className="font-['Inter']">
                    {bracket.status === "active" ? "Activo" : bracket.status === "pending" ? "Pendiente" : "Completado"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600 font-['Inter']">
                  <p>
                    <span className="font-semibold">Tipo:</span>{" "}
                    {bracket.bracket_type === "single-elimination"
                      ? "Eliminación Simple"
                      : bracket.bracket_type === "double-elimination"
                        ? "Eliminación Doble"
                        : bracket.bracket_type === "round-robin"
                          ? "Round Robin"
                          : "Sistema Suizo"}
                  </p>
                  <p>
                    <span className="font-semibold">Jugadores:</span> {bracket.current_players}/{bracket.max_players}
                  </p>
                  <p>
                    <span className="font-semibold">Creado:</span>{" "}
                    {new Date(bracket.created_at).toLocaleDateString("es-CR")}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(bracket.current_players / bracket.max_players) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-['Inter']">
                    {Math.round((bracket.current_players / bracket.max_players) * 100)}% completo
                  </p>
                </div>

                {/* View Participants Button */}
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full font-['Inter'] bg-transparent"
                        onClick={() => handleViewParticipants(bracket)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Participantes ({bracket.current_players})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">
                          Participantes - {selectedBracketForView?.bracket_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {loadingParticipants ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-400 border-t-transparent"></div>
                            <p className="ml-3 text-gray-600 font-['Inter']">Cargando participantes...</p>
                          </div>
                        ) : participants.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {participants.map((participant, index) => (
                              <div
                                key={participant.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-semibold text-gray-900 font-['Inter']">
                                    {participant.player_name}
                                  </p>
                                  <p className="text-sm text-gray-600 font-['Inter']">{participant.player_email}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="font-['Inter']">
                                    #{participant.position}
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1 font-['Inter']">
                                    {participant.status === "active" ? "Activo" : participant.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-['Inter']">No hay participantes en este bracket</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {brackets.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-['Inter']">No hay brackets creados</p>
              <p className="text-sm text-gray-400 font-['Inter'] mt-2">
                Crea tu primer bracket usando el formulario de arriba
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
