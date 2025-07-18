"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, FileText, Download, Upload, Copy, CheckCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function DatabaseMigrationPage() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  const copyToClipboard = (text: string, scriptName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(scriptName)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const exportScript = `-- SCRIPT COMPLETO DE EXPORTACIÓN
-- Ejecutar en Supabase SQL Editor para obtener todos los datos

-- 1. EXPORTAR JUGADORES
COPY (
  SELECT 
    id, name, nationality, email, passport, league, 
    played_in_2024, gender, country, categories, 
    total_cost, currency, payment_status, 
    registration_date, handicap_average, created_at
  FROM players
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- 2. EXPORTAR BRACKETS (si existen)
COPY (
  SELECT 
    id, bracket_name, bracket_type, max_players, 
    current_players, status, created_at, updated_at
  FROM tournament_brackets
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- 3. EXPORTAR SERIES DE JUGADORES (si existen)
COPY (
  SELECT 
    id, player_id, round_id, series_number,
    game_1, game_2, game_3, total_score,
    played_at, created_at
  FROM player_series
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- 4. GENERAR INSERTS DIRECTOS
SELECT 
  'INSERT INTO players VALUES (' ||
  '''' || id || ''', ' ||
  '''' || created_at || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || nationality || ''', ' ||
  '''' || email || ''', ' ||
  '''' || passport || ''', ' ||
  '''' || league || ''', ' ||
  played_in_2024 || ', ' ||
  '''' || gender || ''', ' ||
  '''' || country || ''', ' ||
  '''' || categories || ''', ' ||
  total_cost || ', ' ||
  '''' || currency || ''', ' ||
  '''' || payment_status || ''', ' ||
  COALESCE('''' || payment_proof || '''', 'NULL') || ', ' ||
  '''' || registration_date || ''', ' ||
  COALESCE(handicap_average::text, 'NULL') || ', ' ||
  COALESCE('''' || assigned_bracket || '''', 'NULL') || ', ' ||
  COALESCE(position::text, 'NULL') ||
  ');' as insert_statement
FROM players
ORDER BY created_at;`

  const importScript = `-- SCRIPT DE IMPORTACIÓN COMPLETA
-- Ejecutar en nueva base de datos después de crear tablas

-- 1. VERIFICAR ESTRUCTURA
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('players', 'tournament_brackets', 'player_series')
ORDER BY table_name, ordinal_position;

-- 2. LIMPIAR DATOS EXISTENTES (CUIDADO!)
-- TRUNCATE TABLE player_series CASCADE;
-- TRUNCATE TABLE tournament_brackets CASCADE;  
-- TRUNCATE TABLE players CASCADE;

-- 3. IMPORTAR DESDE CSV (si usaste COPY)
-- COPY players FROM '/path/to/players.csv' WITH CSV HEADER;
-- COPY tournament_brackets FROM '/path/to/brackets.csv' WITH CSV HEADER;
-- COPY player_series FROM '/path/to/series.csv' WITH CSV HEADER;

-- 4. VERIFICAR IMPORTACIÓN
SELECT 
  'players' as tabla, COUNT(*) as registros FROM players
UNION ALL
SELECT 
  'tournament_brackets' as tabla, COUNT(*) as registros FROM tournament_brackets
UNION ALL
SELECT 
  'player_series' as tabla, COUNT(*) as registros FROM player_series;

-- 5. ACTUALIZAR SECUENCIAS (si es necesario)
SELECT setval('players_id_seq', (SELECT MAX(id) FROM players));
SELECT setval('tournament_brackets_id_seq', (SELECT MAX(id) FROM tournament_brackets));
SELECT setval('player_series_id_seq', (SELECT MAX(id) FROM player_series));`

  const githubBackupScript = `# Script para crear respaldo en GitHub
# Ejecutar en tu terminal local

# 1. Crear carpeta de respaldos
mkdir -p database-backups/$(date +%Y-%m-%d)

# 2. Exportar datos desde Supabase (manual)
echo "1. Ve a Supabase SQL Editor"
echo "2. Ejecuta el script de exportación"
echo "3. Guarda los resultados en archivos CSV"

# 3. Agregar respaldos a Git
git add database-backups/
git commit -m "Database backup $(date +%Y-%m-%d)"
git push origin main

# 4. Crear tag de versión
git tag -a "backup-$(date +%Y-%m-%d)" -m "Database backup $(date +%Y-%m-%d)"
git push origin "backup-$(date +%Y-%m-%d)"

echo "✅ Respaldo completado y subido a GitHub"`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Database className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Migración Completa de Base de Datos</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Herramientas completas para exportar, respaldar y migrar toda tu base de datos del Torneo La Negrita
          </p>
        </div>

        {/* Respuesta Directa */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              SÍ puedes respaldar todo en GitHub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-700">Scripts SQL</h3>
                <p className="text-sm text-green-600">Ya están en GitHub</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-700">Exportar Datos</h3>
                <p className="text-sm text-blue-600">Scripts para CSV/SQL</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-700">Subir Respaldos</h3>
                <p className="text-sm text-purple-600">A tu repositorio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs con Scripts */}
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Exportar Datos</TabsTrigger>
            <TabsTrigger value="import">Importar Datos</TabsTrigger>
            <TabsTrigger value="github">Respaldo GitHub</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  Script de Exportación Completa
                </CardTitle>
                <CardDescription>Ejecuta en Supabase SQL Editor para obtener todos tus datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 relative max-h-96 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10 bg-transparent"
                      onClick={() => copyToClipboard(exportScript, "export")}
                    >
                      {copiedScript === "export" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="text-sm text-green-400 overflow-x-auto pr-16">
                      <code>{exportScript}</code>
                    </pre>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">📊 Qué exporta:</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Todos los jugadores registrados</li>
                        <li>• Brackets y torneos</li>
                        <li>• Series y resultados</li>
                        <li>• Configuraciones</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold text-amber-700 mb-2">⚠️ Formatos:</h4>
                      <ul className="text-sm text-amber-600 space-y-1">
                        <li>• CSV para importación fácil</li>
                        <li>• INSERT statements directos</li>
                        <li>• Compatible con PostgreSQL</li>
                        <li>• Preserva tipos de datos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-500" />
                  Script de Importación
                </CardTitle>
                <CardDescription>Para restaurar datos en nueva base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 relative max-h-96 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10 bg-transparent"
                      onClick={() => copyToClipboard(importScript, "import")}
                    >
                      {copiedScript === "import" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="text-sm text-green-400 overflow-x-auto pr-16">
                      <code>{importScript}</code>
                    </pre>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-700">⚠️ Importante:</h4>
                        <p className="text-sm text-red-600">
                          Ejecuta primero todos los scripts de creación de tablas antes de importar datos. El comando
                          TRUNCATE eliminará datos existentes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Respaldo en GitHub
                </CardTitle>
                <CardDescription>Script para subir respaldos a tu repositorio lanegritacrcc</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(githubBackupScript, "github")}
                    >
                      {copiedScript === "github" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      <code>{githubBackupScript}</code>
                    </pre>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">✅ Ventajas:</h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Respaldo versionado</li>
                        <li>• Historial de cambios</li>
                        <li>• Acceso desde cualquier lugar</li>
                        <li>• Respaldo automático</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">📁 Estructura:</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>
                          • <code>database-backups/</code>
                        </li>
                        <li>
                          • <code>2025-01-15/players.csv</code>
                        </li>
                        <li>
                          • <code>2025-01-15/brackets.csv</code>
                        </li>
                        <li>
                          • <code>2025-01-15/series.csv</code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Proceso Paso a Paso */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Proceso Completo de Respaldo</CardTitle>
            <CardDescription>Sigue estos pasos para respaldar todo en GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    step: "1",
                    title: "Ejecutar Script de Exportación",
                    description: "En Supabase SQL Editor, ejecuta el script de exportación",
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: "Guardar Archivos CSV",
                    description: "Guarda los resultados como archivos CSV en tu computadora",
                    color: "green",
                  },
                  {
                    step: "3",
                    title: "Crear Carpeta de Respaldos",
                    description: "En tu proyecto local, crea database-backups/fecha/",
                    color: "purple",
                  },
                  {
                    step: "4",
                    title: "Subir a GitHub",
                    description: "Usa git add, commit y push para subir los respaldos",
                    color: "orange",
                  },
                  {
                    step: "5",
                    title: "Crear Tag de Versión",
                    description: "Etiqueta el respaldo con la fecha para fácil referencia",
                    color: "pink",
                  },
                ].map((item, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 bg-${item.color}-50 rounded-lg`}>
                    <Badge variant="outline" className="mt-1">
                      {item.step}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
          <Button variant="outline" onClick={() => copyToClipboard(exportScript, "export-main")}>
            {copiedScript === "export-main" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copiar Script Exportación
          </Button>
          <Button variant="outline" onClick={() => window.open("https://github.com", "_blank")}>
            <FileText className="h-4 w-4 mr-2" />
            Ir a GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}
