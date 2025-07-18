"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, AlertTriangle, Github, RefreshCw } from "lucide-react"

export default function GitHubErrorFixPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, commandName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandName)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const solutions = [
    {
      name: "pull-first",
      title: "Solución 1: Sincronizar Primero (Más Común)",
      commands: [
        "git pull origin main",
        "# Ahora edita el README en VSCode",
        "git add README.md",
        'git commit -m "docs: actualizar README del proyecto"',
        "git push origin main",
      ],
      description: "Descarga los cambios de GitHub antes de hacer tus modificaciones",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "green",
    },
    {
      name: "force-push",
      title: "Solución 2: Forzar Actualización (Si estás seguro)",
      commands: [
        "git add README.md",
        'git commit -m "docs: actualizar README del proyecto"',
        "git push --force origin main",
      ],
      description: "Sobrescribe los cambios remotos con tu versión local",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "orange",
    },
    {
      name: "github-web",
      title: "Solución 3: Editar Directamente en GitHub",
      commands: [
        "1. Ve a tu repositorio en GitHub",
        "2. Haz clic en README.md",
        "3. Haz clic en el ícono de lápiz (Edit)",
        "4. Pega el contenido del README",
        "5. Scroll abajo y haz clic en 'Commit changes'",
      ],
      description: "Edita el README directamente en la web de GitHub",
      icon: <Github className="h-5 w-5" />,
      color: "blue",
    },
  ]

  const readmeContent = `# Torneo de Boliche La Negrita CRCC 2025

Sistema de gestión completo para el Torneo de Boliche "La Negrita" del Country Club Río Cuarto.

## 🎳 Características

- **Registro de Jugadores**: Sistema completo de inscripción
- **Gestión de Brackets**: Organización automática de torneos
- **Resultados en Tiempo Real**: Seguimiento de puntuaciones
- **Panel Administrativo**: Control total del torneo
- **Responsive Design**: Funciona en móviles y desktop

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT personalizado
- **Deploy**: Vercel
- **Control de Versiones**: GitHub

## 🏆 Funcionalidades

### Para Participantes
- Registro fácil y rápido
- Consulta de brackets y resultados
- Perfil de jugador personalizado
- Notificaciones por email

### Para Administradores
- Panel de control completo
- Gestión de jugadores y brackets
- Carga de resultados
- Estadísticas del torneo
- Exportación de datos

## 🔧 Instalación Local

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/lanegritacrcc.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
\`\`\`

## 🌐 Variables de Entorno

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key
JWT_SECRET=tu_jwt_secret
ADMIN_USERNAME=admincrcc
ADMIN_PASSWORD_HASH=tu_hash_seguro
\`\`\`

## 📱 Acceso

- **Sitio Web**: [https://tu-dominio.com](https://tu-dominio.com)
- **Admin Panel**: [https://tu-dominio.com/admin](https://tu-dominio.com/admin)
- **Credenciales Admin**: \`admincrcc\` / \`contraseña_segura\`

## 🏗️ Estructura del Proyecto

\`\`\`
lanegritacrcc/
├── app/                 # Páginas y rutas
├── components/          # Componentes React
├── lib/                 # Utilidades y servicios
├── public/              # Archivos estáticos
├── scripts/             # Scripts SQL
└── docs/                # Documentación
\`\`\`

## 🛡️ Seguridad

- Autenticación JWT segura
- Variables de entorno protegidas
- Validación de datos en servidor
- Políticas de seguridad en Supabase

## 📊 Base de Datos

El proyecto incluye scripts SQL completos para:
- Creación de tablas
- Configuración de políticas
- Datos de ejemplo
- Migraciones

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🏆 Torneo La Negrita CRCC 2025

Desarrollado con ❤️ para el Country Club Río Cuarto
`

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Error de GitHub: Conflicto de Commits</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El hash <code className="bg-gray-100 px-2 py-1 rounded">3d2012acac77327aac70dee4ce787a655ad1bceb</code>{" "}
            indica un conflicto entre tu versión local y GitHub
          </p>
        </div>

        {/* Error Explanation */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Problema:</strong> GitHub tiene cambios que tu versión local no tiene. Esto pasa cuando:
            <ul className="mt-2 ml-4 list-disc">
              <li>Editaste algo directamente en GitHub</li>
              <li>Vercel hizo cambios automáticos</li>
              <li>Hay commits que no tienes localmente</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Solutions */}
        <div className="space-y-6">
          {solutions.map((solution, index) => (
            <Card
              key={solution.name}
              className={`border-l-4 ${
                solution.color === "green"
                  ? "border-l-green-500"
                  : solution.color === "orange"
                    ? "border-l-orange-500"
                    : "border-l-blue-500"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    solution.color === "green"
                      ? "text-green-700"
                      : solution.color === "orange"
                        ? "text-orange-700"
                        : "text-blue-700"
                  }`}
                >
                  {solution.icon}
                  {solution.title}
                  {index === 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">RECOMENDADA</span>
                  )}
                </CardTitle>
                <CardDescription>{solution.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {solution.commands.map((cmd, cmdIndex) => (
                  <div key={cmdIndex} className="space-y-2">
                    {cmd.startsWith("#") || cmd.startsWith("1.") ? (
                      <p className="text-sm text-gray-600 italic">{cmd}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-900 text-green-400 px-3 py-2 rounded font-mono text-sm flex-1">
                          {cmd}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(cmd, `${solution.name}-${cmdIndex}`)}
                        >
                          {copiedCommand === `${solution.name}-${cmdIndex}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* README Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Contenido README.md Preparado
            </CardTitle>
            <CardDescription>Copia este contenido para tu README después de resolver el conflicto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">README completo para lanegritacrcc</span>
                <Button size="sm" onClick={() => copyToClipboard(readmeContent, "readme-content")}>
                  {copiedCommand === "readme-content" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar README
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs max-h-60 overflow-y-auto">
                <pre>{readmeContent}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Fix */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-green-800">🚀 Solución Rápida</h3>
              <p className="text-green-700">
                La mayoría de las veces, simplemente ejecutar{" "}
                <code className="bg-green-100 px-2 py-1 rounded">git pull origin main</code>
                resuelve el problema.
              </p>
              <Button
                size="lg"
                onClick={() => copyToClipboard("git pull origin main", "quick-fix")}
                className="bg-green-600 hover:bg-green-700"
              >
                {copiedCommand === "quick-fix" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Solución Rápida
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
