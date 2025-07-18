"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertTriangle, CheckCircle, Users, Database } from "lucide-react"

interface DebugData {
  counts: {
    supabase_total: number
    supabase_verified: number
    supabase_pending: number
    manual_total: number
    manual_verified: number
    manual_pending: number
  }
  data_quality: {
    duplicate_emails: string[]
    duplicate_names: string[]
    invalid_records: number
    invalid_details: any[]
  }
  all_players_summary: Array<{
    id: string
    name: string
    email: string
    payment_status: string
    created_at: string
    is_valid: boolean
  }>
  sample_raw_data: any[]
}

export default function DebugDataPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug-players", {
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const result = await response.json()

      if (result.success) {
        setDebugData(result.debug)
      } else {
        setError(result.error || "Error desconocido")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Debug de Datos</h1>
            <p className="text-slate-400">Investigación de inconsistencias en jugadores</p>
          </div>
          <Button onClick={fetchDebugData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {debugData && (
          <>
            {/* Counts Comparison */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Comparación de Conteos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Supabase Count API</p>
                    <p className="text-2xl font-bold text-white">{debugData.counts.supabase_total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Manual Count</p>
                    <p className="text-2xl font-bold text-white">{debugData.counts.manual_total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Diferencia</p>
                    <p
                      className={`text-2xl font-bold ${
                        debugData.counts.supabase_total === debugData.counts.manual_total
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {debugData.counts.supabase_total - debugData.counts.manual_total}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Verificados (API)</p>
                    <p className="text-xl font-bold text-green-400">{debugData.counts.supabase_verified}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Verificados (Manual)</p>
                    <p className="text-xl font-bold text-green-400">{debugData.counts.manual_verified}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Pendientes</p>
                    <p className="text-xl font-bold text-yellow-400">{debugData.counts.manual_pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Quality Issues */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Problemas de Calidad de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 mb-2">Emails Duplicados:</p>
                  {debugData.data_quality.duplicate_emails.length > 0 ? (
                    <div className="space-y-1">
                      {debugData.data_quality.duplicate_emails.map((email, i) => (
                        <Badge key={i} variant="destructive">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sin duplicados
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 mb-2">Nombres Duplicados:</p>
                  {debugData.data_quality.duplicate_names.length > 0 ? (
                    <div className="space-y-1">
                      {debugData.data_quality.duplicate_names.map((name, i) => (
                        <Badge key={i} variant="destructive">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sin duplicados
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 mb-2">Registros Inválidos:</p>
                  <Badge variant={debugData.data_quality.invalid_records > 0 ? "destructive" : "outline"}>
                    {debugData.data_quality.invalid_records} registros
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* All Players Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Todos los Jugadores ({debugData.all_players_summary.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-slate-400">ID</th>
                        <th className="text-left p-2 text-slate-400">Nombre</th>
                        <th className="text-left p-2 text-slate-400">Email</th>
                        <th className="text-left p-2 text-slate-400">Estado</th>
                        <th className="text-left p-2 text-slate-400">Válido</th>
                        <th className="text-left p-2 text-slate-400">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugData.all_players_summary.map((player, i) => (
                        <tr
                          key={player.id}
                          className={`border-b border-slate-700 ${i % 2 === 0 ? "bg-slate-800/50" : ""}`}
                        >
                          <td className="p-2 text-slate-300 font-mono text-xs">{player.id}</td>
                          <td className="p-2 text-white">{player.name}</td>
                          <td className="p-2 text-slate-300">{player.email}</td>
                          <td className="p-2">
                            <Badge variant={player.payment_status === "verified" ? "default" : "secondary"}>
                              {player.payment_status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {player.is_valid ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                          </td>
                          <td className="p-2 text-slate-400 text-xs">
                            {new Date(player.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
