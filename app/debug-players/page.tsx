"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, CheckCircle, XCircle, Clock } from "lucide-react"

interface Player {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  payment_status: string
  created_at: string
}

export default function DebugPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rawResponse, setRawResponse] = useState("")

  const testConnection = async () => {
    setIsLoading(true)
    setError("")
    setRawResponse("")

    try {
      const response = await fetch("/api/players")
      const data = await response.json()

      setRawResponse(JSON.stringify(data, null, 2))

      if (response.ok && data.success) {
        const playersList = data.data || data.players || []
        setPlayers(playersList)
      } else {
        setError(data.error || "Error desconocido")
      }
    } catch (err) {
      setError(`Error de conexión: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug - Jugadores</h1>
          <p className="text-gray-600">Verificar conexión con Supabase y datos de jugadores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Control de Pruebas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testConnection} disabled={isLoading} className="w-full">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Probando..." : "Probar Conexión"}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{players.length}</div>
                  <div className="text-sm text-blue-800">Total</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {players.filter((p) => p.payment_status === "verified").length}
                  </div>
                  <div className="text-sm text-green-800">Verificados</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {players.filter((p) => p.payment_status === "pending").length}
                  </div>
                  <div className="text-sm text-yellow-800">Pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Respuesta Raw */}
          <Card>
            <CardHeader>
              <CardTitle>Respuesta Raw de la API</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                {rawResponse || "No hay respuesta aún"}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Jugadores */}
        {players.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Jugadores Encontrados ({players.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.email}</p>
                      {player.phone && <p className="text-sm text-gray-500">Tel: {player.phone}</p>}
                      {player.country && <p className="text-sm text-gray-500">País: {player.country}</p>}
                      <p className="text-xs text-gray-400">
                        ID: {player.id} | Registrado: {new Date(player.created_at).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          player.payment_status === "verified"
                            ? "default"
                            : player.payment_status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {player.payment_status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {player.payment_status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                        {player.payment_status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {player.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
