"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Users, Settings } from "lucide-react"

export default function VerifySystemPage() {
  const [dbTest, setDbTest] = useState(null)
  const [players, setPlayers] = useState(null)
  const [loading, setLoading] = useState(false)

  const runDatabaseTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()
      setDbTest(result)
      console.log("Database Test Result:", result)
    } catch (error) {
      setDbTest({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const loadPlayers = async () => {
    try {
      const response = await fetch("/api/players")
      const result = await response.json()
      setPlayers(result)
      console.log("Players:", result)
    } catch (error) {
      setPlayers({ success: false, error: error.message })
    }
  }

  const registerTestPlayer = async () => {
    const testPlayer = {
      name: `Jugador Prueba ${Date.now()}`,
      nationality: "Costa Rica",
      email: `prueba-${Date.now()}@torneo.com`,
      passport: `TEST${Date.now()}`,
      league: "Liga de Prueba",
      played_in_2024: false,
      gender: "M",
      country: "national",
      categories: {
        handicap: true,
        scratch: true,
        seniorM: false,
        seniorF: false,
        marathon: true,
        desperate: false,
        reenganche3: true,
        reenganche4: false,
        reenganche5: false,
        reenganche8: false,
      },
      total_cost: 69000, // 36000 + 11000 + 11000 + 11000
      currency: "CRC",
      payment_status: "pending",
    }

    try {
      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPlayer),
      })
      const result = await response.json()
      console.log("Registration Result:", result)

      if (result.success) {
        alert(`✅ Jugador registrado exitosamente!\nID: ${result.data.id}`)
        loadPlayers() // Recargar lista
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Verificación del Sistema</h1>
          <p className="text-gray-600">Torneo La Negrita 2025 - Pruebas Completas</p>
        </div>

        {/* Database Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Prueba de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runDatabaseTest} disabled={loading} className="w-full">
              {loading ? "Probando..." : "🧪 Ejecutar Prueba Completa de DB"}
            </Button>

            {dbTest && (
              <div className={`p-4 rounded-lg ${dbTest.success ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {dbTest.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${dbTest.success ? "text-green-800" : "text-red-800"}`}>
                    {dbTest.success ? "✅ Base de Datos Funcionando" : "❌ Error en Base de Datos"}
                  </span>
                </div>

                {dbTest.success && dbTest.tests && (
                  <div className="space-y-1 text-sm">
                    {Object.entries(dbTest.tests).map(([key, value]) => (
                      <div key={key}>• {value}</div>
                    ))}
                  </div>
                )}

                {dbTest.error && <div className="text-red-700 text-sm mt-2">Error: {dbTest.error}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Players Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Jugadores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={loadPlayers} variant="outline" className="flex-1">
                📋 Ver Jugadores Registrados
              </Button>
              <Button onClick={registerTestPlayer} className="flex-1">
                ➕ Registrar Jugador de Prueba
              </Button>
            </div>

            {players && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Jugadores Encontrados:</span>
                  <Badge variant="secondary">{players.data?.length || 0}</Badge>
                </div>

                {players.data?.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="bg-gray-50 p-3 rounded text-sm">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-gray-600">
                      {player.email} - {player.payment_status}
                    </div>
                  </div>
                ))}

                {players.data?.length > 3 && (
                  <div className="text-center text-gray-500 text-sm">... y {players.data.length - 3} más</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Verificar en Supabase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. Ve a tu dashboard de Supabase:</strong>
                <div className="bg-gray-100 p-2 rounded mt-1 font-mono">
                  https://supabase.com/dashboard/project/pybfjonqjzlhilknrmbh
                </div>
              </div>

              <div>
                <strong>2. Ve a "Table Editor" → "players"</strong>
              </div>

              <div>
                <strong>3. Deberías ver los jugadores registrados aquí</strong>
              </div>

              <div>
                <strong>4. También puedes ejecutar esta query en "SQL Editor":</strong>
                <div className="bg-gray-100 p-2 rounded mt-1 font-mono">
                  SELECT name, email, payment_status, created_at FROM players ORDER BY created_at DESC;
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
