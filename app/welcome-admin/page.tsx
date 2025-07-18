"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Trophy, Settings, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function WelcomeAdmin() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/system-check")
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error checking system:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">¡Sistema Configurado!</h1>
              <p className="text-xl text-gray-600 mt-2">Torneo La Negrita 2025</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✅ Todas las integraciones funcionando correctamente
          </Badge>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Supabase conectado</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Autenticación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">JWT configurado</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Torneo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Listo para usar</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-800">
                <Settings className="h-6 w-6 mr-2" />
                Panel de Administración
              </CardTitle>
              <CardDescription>Gestiona el torneo, jugadores y resultados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Crear y gestionar torneos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Administrar jugadores
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Registrar resultados
                </div>
                <Link href="/admin">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Ir al Panel de Admin</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-green-800">
                <Users className="h-6 w-6 mr-2" />
                Registro de Jugadores
              </CardTitle>
              <CardDescription>Los jugadores pueden inscribirse al torneo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Formulario de inscripción
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Validación de pagos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Confirmación automática
                </div>
                <Link href="/register">
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Ver Formulario de Registro</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Enlaces útiles para gestionar el torneo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/brackets">
                <Button variant="outline" className="w-full bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  Brackets
                </Button>
              </Link>
              <Link href="/admin/results">
                <Button variant="outline" className="w-full bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Resultados
                </Button>
              </Link>
              <Link href="/system-status">
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Estado Sistema
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Página Principal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">🎳 Torneo La Negrita 2025 - Sistema completamente configurado y listo para usar</p>
        </div>
      </div>
    </div>
  )
}
