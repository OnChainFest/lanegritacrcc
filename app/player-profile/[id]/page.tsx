"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Target,
  TrendingUp,
  Award,
  Activity,
  BarChart3,
  User,
  Mail,
  Globe,
  RefreshCw,
  ArrowLeft,
} from "lucide-react"
import {
  ResultsService,
  type PlayerSeries,
  type PlayerStanding,
  type PlayerAchievement,
  type TournamentEvent,
} from "@/lib/results-service"

interface PlayerProfile {
  player: any
  series: PlayerSeries[]
  standings: PlayerStanding[]
  achievements: PlayerAchievement[]
  events: TournamentEvent[]
  stats: {
    totalSeries: number
    totalGames: number
    averageScore: number
    highestGame: number
    highestSeries: number
    currentPosition: number | null
    totalAchievements: number
  }
}

export default function PlayerProfilePage() {
  const params = useParams()
  const playerId = params.id as string

  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const result = await ResultsService.getPlayerProfile(playerId)

      if (result.success && result.data) {
        setProfile(result.data)
        setError(null)
      } else {
        setError(result.error || "Error cargando perfil")
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [playerId])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchProfile()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, playerId])

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "PERFECT_GAME":
        return "🎯"
      case "HIGH_SERIES":
        return "🔥"
      case "STRIKE_OUT":
        return "⚡"
      default:
        return "🏆"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "SERIES_ADDED":
        return "📊"
      case "ACHIEVEMENT":
        return "🏆"
      case "POSITION_CHANGE":
        return "📈"
      default:
        return "📋"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil del jugador...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error || "No se pudo cargar el perfil del jugador"}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => window.history.back()} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Perfil del Jugador</h1>
              <p className="text-gray-600">Estadísticas y progreso en el torneo</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button onClick={fetchProfile} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Información del jugador */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.player.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.player.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{profile.player.nationality}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {profile.stats.currentPosition && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">#{profile.stats.currentPosition}</div>
                    <p className="text-sm text-gray-600">Posición Actual</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.stats.totalSeries}</p>
              <p className="text-xs text-gray-600">Series</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.stats.totalGames}</p>
              <p className="text-xs text-gray-600">Juegos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.stats.averageScore.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.stats.highestGame}</p>
              <p className="text-xs text-gray-600">Mejor Juego</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.stats.highestSeries}</p>
              <p className="text-xs text-gray-600">Mejor Serie</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-2xl font-bold">{profile.stats.totalAchievements}</p>
              <p className="text-xs text-gray-600">Logros</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile.events.length}</p>
              <p className="text-xs text-gray-600">Eventos</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal con pestañas */}
        <Tabs defaultValue="series" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Tab: Series */}
          <TabsContent value="series">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Historial de Series</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.series.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay series registradas</p>
                ) : (
                  <div className="space-y-4">
                    {profile.series.map((series) => (
                      <div key={series.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Serie #{series.series_number}</Badge>
                            <Badge variant="secondary">{series.tournament_rounds?.round_name}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{series.total_score}</p>
                            <p className="text-sm text-gray-600">Total</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold">{series.game_1}</p>
                            <p className="text-xs text-gray-600">Juego 1</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">{series.game_2}</p>
                            <p className="text-xs text-gray-600">Juego 2</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">{series.game_3}</p>
                            <p className="text-xs text-gray-600">Juego 3</p>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-sm text-gray-600">
                            Promedio: {series.average_score.toFixed(1)} | Jugado el{" "}
                            {new Date(series.played_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Logros */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Logros Obtenidos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay logros obtenidos aún</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{getAchievementIcon(achievement.achievement_type)}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline">{achievement.value} puntos</Badge>
                              <p className="text-xs text-gray-500">
                                {new Date(achievement.achieved_at).toLocaleDateString("es-ES")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Progreso */}
          <TabsContent value="progress">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Progreso en el Torneo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progreso de promedio */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Promedio Actual</span>
                      <span className="text-sm text-gray-600">{profile.stats.averageScore.toFixed(1)} / 300</span>
                    </div>
                    <Progress value={(profile.stats.averageScore / 300) * 100} className="h-2" />
                  </div>

                  {/* Progreso de mejor juego */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Mejor Juego</span>
                      <span className="text-sm text-gray-600">{profile.stats.highestGame} / 300</span>
                    </div>
                    <Progress value={(profile.stats.highestGame / 300) * 100} className="h-2" />
                  </div>

                  {/* Progreso de mejor serie */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Mejor Serie</span>
                      <span className="text-sm text-gray-600">{profile.stats.highestSeries} / 900</span>
                    </div>
                    <Progress value={(profile.stats.highestSeries / 900) * 100} className="h-2" />
                  </div>

                  {/* Estadísticas por ronda */}
                  {profile.standings.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Posiciones por Ronda</h4>
                      <div className="space-y-2">
                        {profile.standings.map((standing) => (
                          <div
                            key={standing.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{standing.tournament_rounds?.round_name}</p>
                              <p className="text-sm text-gray-600">
                                {standing.total_series} series | Promedio: {standing.average_score.toFixed(1)}
                              </p>
                            </div>
                            <Badge variant={standing.current_position <= 3 ? "default" : "outline"}>
                              #{standing.current_position}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Actividad */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Actividad Reciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.events.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay actividad registrada</p>
                ) : (
                  <div className="space-y-3">
                    {profile.events.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="text-xl">{getEventIcon(event.event_type)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.created_at).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
