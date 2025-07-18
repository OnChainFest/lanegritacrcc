"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, Download, Upload, Copy, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

export default function SupabaseBackupPage() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  const copyToClipboard = (text: string, scriptName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(scriptName)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const backupScript = `-- Script para hacer respaldo completo de datos
-- Ejecutar en Supabase SQL Editor

-- 1. Respaldar jugadores
SELECT 
  'INSERT INTO players (id, name, nationality, email, passport, league, played_in_2024, gender, country, categories, total_cost, currency, payment_status, created_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || name || ''', ''' || nationality || ''', ''' || email || ''', ''' || passport || ''', ''' || league || ''', ' || played_in_2024 || ', ''' || gender || ''', ''' || country || ''', ''' || categories || ''', ' || total_cost || ', ''' || currency || ''', ''' || payment_status || ''', ''' || created_at || ''')',
    ', '
  ) || ';'
FROM players;

-- 2. Respaldar brackets (si existen)
SELECT 
  'INSERT INTO tournament_brackets (id, bracket_name, bracket_type, max_players, current_players, status, created_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || bracket_name || ''', ''' || bracket_type || ''', ' || max_players || ', ' || current_players || ', ''' || status || ''', ''' || created_at || ''')',
    ', '
  ) || ';'
FROM tournament_brackets
WHERE EXISTS (SELECT 1 FROM tournament_brackets);

-- 3. Respaldar series de jugadores (si existen)
SELECT 
  'INSERT INTO player_series (id, player_id, round_id, game_1, game_2, game_3, created_at) VALUES' ||
  string_agg(
    '(''' || id || ''', ''' || player_id || ''', ''' || round_id || ''', ' || COALESCE(game_1::text, 'NULL') || ', ' || COALESCE(game_2::text, 'NULL') || ', ' || COALESCE(game_3::text, 'NULL') || ', ''' || created_at || ''')',
    ', '
  ) || ';'
FROM player_series
WHERE EXISTS (SELECT 1 FROM player_series);`

  const restoreScript = `-- Script para restaurar datos en nueva base de datos
-- 1. Primero ejecutar todos los scripts de creación de tablas
-- 2. Luego ejecutar los INSERT generados por el script de respaldo

-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('players', 'tournament_brackets', 'player_series', 'tournaments');

-- Contar registros después de restaurar
SELECT 
  'players' as tabla, COUNT(*) as registros FROM players
UNION ALL
SELECT 
  'tournament_brackets' as tabla, COUNT(*) as registros FROM tournament_brackets
UNION ALL
SELECT 
  'player_series' as tabla, COUNT(*) as registros FROM player_series;`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Respaldo de Supabase</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guía completa para respaldar y migrar tu base de datos del Torneo La Negrita
          </p>
        </div>

        {/* Respuesta Directa */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Respuesta Directa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">NO puedes subir datos</p>
                  <p className="text-sm text-red-600">Los datos de Supabase no van a GitHub</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-green-700">SÍ puedes hacer respaldos</p>
                  <p className="text-sm text-green-600">Scripts SQL para migrar todo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lo que YA tienes en GitHub */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />✅ Lo que YA tienes en GitHub
            </CardTitle>
            <CardDescription>Tu repositorio ya incluye todo lo necesario para recrear la base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">📁 Scripts de Creación:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>
                    • <code>scripts/create-tables.sql</code>
                  </li>
                  <li>
                    • <code>scripts/create-auth-tables.sql</code>
                  </li>
                  <li>
                    • <code>scripts/create-results-system.sql</code>
                  </li>
                  <li>
                    • <code>scripts/create-brackets-tables.sql</code>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">⚙️ Configuración:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Variables de entorno</li>
                  <li>• Políticas RLS</li>
                  <li>• Índices y triggers</li>
                  <li>• Estructura completa</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Script de Respaldo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              Script de Respaldo de Datos
            </CardTitle>
            <CardDescription>Ejecuta esto en Supabase SQL Editor para generar respaldo de tus datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(backupScript, "backup")}
                >
                  {copiedScript === "backup" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{backupScript}</code>
                </pre>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Este script genera comandos INSERT con todos tus datos actuales</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Script de Restauración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-500" />
              Script de Restauración
            </CardTitle>
            <CardDescription>Para restaurar datos en una nueva base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(restoreScript, "restore")}
                >
                  {copiedScript === "restore" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{restoreScript}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceso Completo */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Proceso Completo de Migración</CardTitle>
            <CardDescription>Pasos para mover tu proyecto a otra base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="outline" className="mt-1">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-semibold">Ejecutar Script de Respaldo</h4>
                    <p className="text-sm text-gray-600">En tu Supabase actual, copia el resultado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="outline" className="mt-1">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-semibold">Crear Nueva Base de Datos</h4>
                    <p className="text-sm text-gray-600">Nuevo proyecto Supabase o PostgreSQL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="outline" className="mt-1">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-semibold">Ejecutar Scripts de Creación</h4>
                    <p className="text-sm text-gray-600">
                      Todos los archivos de <code>/scripts</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="outline" className="mt-1">
                    4
                  </Badge>
                  <div>
                    <h4 className="font-semibold">Restaurar Datos</h4>
                    <p className="text-sm text-gray-600">Ejecutar los INSERT generados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="outline" className="mt-1">
                    5
                  </Badge>
                  <div>
                    <h4 className="font-semibold">Actualizar Variables</h4>
                    <p className="text-sm text-gray-600">Cambiar URLs en Vercel</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ventajas */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">✅ Ventajas de este Enfoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Respaldo completo de estructura</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Migración a cualquier PostgreSQL</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Control de versiones de esquema</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fácil recreación del sistema</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Respaldo de datos reales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Portabilidad completa</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Database className="h-4 w-4 mr-2" />
            Ir a Supabase
          </Button>
          <Button variant="outline" onClick={() => copyToClipboard(backupScript, "backup-main")}>
            {copiedScript === "backup-main" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copiar Script Respaldo
          </Button>
        </div>
      </div>
    </div>
  )
}
