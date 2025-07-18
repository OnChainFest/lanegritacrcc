"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Github, FileText, Globe, Shield, Users, ArrowRight, Copy, Check } from "lucide-react"

export default function NextStepsPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const readmeContent = `# Torneo La Negrita CRCC 2025

Sistema de gestión completo para el Torneo de Boliche La Negrita del Country Club Río Cuarto.

## 🎳 Características

- **Registro de Jugadores**: Sistema completo de inscripción
- **Panel Administrativo**: Gestión de torneos y resultados
- **Brackets Dinámicos**: Visualización de eliminatorias
- **Estadísticas en Tiempo Real**: Seguimiento de puntuaciones
- **Sistema de Pagos**: Control de inscripciones
- **Responsive Design**: Funciona en móviles y desktop

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Autenticación**: JWT personalizado

## 🏆 Funcionalidades Principales

### Para Jugadores
- Registro e inscripción al torneo
- Visualización de brackets
- Seguimiento de resultados personales
- Descarga de reglamento

### Para Administradores
- Panel de control completo
- Gestión de jugadores y pagos
- Creación y manejo de brackets
- Ingreso de resultados
- Estadísticas del torneo

## 🔧 Instalación Local

\`\`\`bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/lanegritacrcc.git
cd lanegritacrcc

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar base de datos (scripts SQL en /scripts)
# Ejecutar aplicación
npm run dev
\`\`\`

## 🌐 Deploy en Producción

El proyecto está configurado para deploy automático en Vercel:

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Ejecuta los scripts SQL en Supabase
4. ¡Listo!

## 📊 Base de Datos

El sistema utiliza Supabase con las siguientes tablas principales:

- \`players\` - Información de jugadores
- \`tournaments\` - Datos de torneos
- \`brackets\` - Estructura de eliminatorias
- \`player_series\` - Resultados de partidas
- \`tournament_standings\` - Clasificaciones

## 🔐 Seguridad

- Autenticación JWT personalizada
- Variables de entorno protegidas
- Validación de datos en servidor
- Acceso administrativo restringido

## 📱 Uso

### Acceso Público
- **URL Principal**: https://tu-dominio.com
- **Registro**: https://tu-dominio.com/register
- **Brackets**: https://tu-dominio.com/brackets

### Acceso Administrativo
- **Login**: https://tu-dominio.com/login
- **Panel Admin**: https://tu-dominio.com/admin

## 🏅 Torneo La Negrita CRCC 2025

**Fecha**: [Fecha del torneo]
**Lugar**: Country Club Río Cuarto
**Modalidad**: Eliminación directa
**Categorías**: [Definir categorías]

## 📞 Contacto

Para soporte técnico o consultas sobre el torneo:
- **Email**: [tu-email@ejemplo.com]
- **Teléfono**: [tu-teléfono]
- **Club**: Country Club Río Cuarto

## 📄 Licencia

Este proyecto fue desarrollado específicamente para el Torneo La Negrita CRCC 2025.

---

Desarrollado con ❤️ para el Country Club Río Cuarto`

  const nextSteps = [
    {
      id: 1,
      title: "Crear README.md",
      description: "Documenta tu proyecto para otros desarrolladores",
      icon: FileText,
      priority: "Alta",
      status: "pending",
    },
    {
      id: 2,
      title: "Configurar Dominio Personalizado",
      description: "Cambiar de vercel.app a tu dominio propio",
      icon: Globe,
      priority: "Media",
      status: "pending",
    },
    {
      id: 3,
      title: "Configurar Credenciales Seguras",
      description: "Cambiar admin/admin123 por credenciales más seguras",
      icon: Shield,
      priority: "Alta",
      status: "pending",
    },
    {
      id: 4,
      title: "Invitar Colaboradores",
      description: "Agregar otros usuarios al repositorio GitHub",
      icon: Users,
      priority: "Baja",
      status: "pending",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">¡GitHub Conectado!</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tu repositorio "lanegritacrcc" está listo. Ahora vamos a completar la configuración.
          </p>
        </div>

        {/* Why No README Initially */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <FileText className="h-5 w-5" />
              ¿Por qué no README inicialmente?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-700">
            <p>
              <strong>Te recomendé NO crear README al inicio porque:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>GitHub crea un repositorio vacío más fácil de conectar con Vercel</li>
              <li>Evita conflictos cuando Vercel sube tu código existente</li>
              <li>Tu proyecto ya tiene estructura completa, no necesita inicialización</li>
              <li>Ahora que está conectado, SÍ es el momento perfecto para agregar README</li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-600" />
              Próximos Pasos Recomendados
            </CardTitle>
            <CardDescription>Completa estos pasos para tener un proyecto profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <step.icon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        step.priority === "Alta" ? "destructive" : step.priority === "Media" ? "default" : "secondary"
                      }
                    >
                      {step.priority}
                    </Badge>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* README Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              1. Crear README.md (Recomendado Ahora)
            </CardTitle>
            <CardDescription>Documenta tu proyecto para que otros entiendan qué hace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>¡Ahora SÍ es el momento perfecto!</strong> Tu código ya está en GitHub, así que agregar README
                no causará conflictos.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Cómo agregar README:</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Opción 1:</strong> Crear directamente en GitHub
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Ve a tu repositorio "lanegritacrcc" en GitHub</li>
                  <li>Haz clic en "Add a README"</li>
                  <li>Copia el contenido que preparé abajo</li>
                  <li>Haz commit</li>
                </ol>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contenido README preparado:</h4>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(readmeContent, "readme")}>
                  {copiedText === "readme" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedText === "readme" ? "¡Copiado!" : "Copiar README"}
                </Button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono max-h-64 overflow-y-auto">
                <pre>{readmeContent}</pre>
              </div>
            </div>

            <Button asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                Ir a GitHub para crear README
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Security Setup */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              2. Configurar Credenciales Seguras (Importante)
            </CardTitle>
            <CardDescription className="text-orange-700">
              Cambiar las credenciales por defecto por unas más seguras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Importante:</strong> Las credenciales actuales (admin/admin123) son muy básicas. Deberías
                cambiarlas antes de que el torneo sea público.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Credenciales recomendadas:</h4>
              <div className="bg-white p-3 rounded border space-y-1 text-sm">
                <div>
                  <strong>Usuario:</strong> <code>admincrcc</code>
                </div>
                <div>
                  <strong>Contraseña:</strong> <code>TorneoLaNegrita2025!CRCC</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              3. Dominio Personalizado (Opcional)
            </CardTitle>
            <CardDescription>Cambiar de tu-proyecto.vercel.app a un dominio propio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">✅ Ventajas:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Más profesional</li>
                  <li>• Fácil de recordar</li>
                  <li>• Mejor para marketing</li>
                  <li>• Independiente de Vercel</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700">💰 Costo:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Dominio: $8-15/año</li>
                  <li>• Hosting: $0 (Vercel gratis)</li>
                  <li>• SSL: $0 (incluido)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold text-green-800">Estado Actual: ¡Excelente!</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-green-800">✅ Código en GitHub</div>
                  <div className="text-green-700">Respaldado y versionado</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-800">✅ Deploy Automático</div>
                  <div className="text-green-700">Vercel ↔ GitHub conectado</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-800">✅ App Funcionando</div>
                  <div className="text-green-700">Lista para usar</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4 mr-2" />
              Crear README Ahora
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              Configurar Dominio
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
