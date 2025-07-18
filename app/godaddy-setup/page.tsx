"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Globe,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Shield,
  ArrowRight,
  Eye,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GoDaddySetupPage() {
  const [domainName, setDomainName] = useState("")
  const [copied, setCopied] = useState("")
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast({
      title: "✅ Copiado",
      description: `${label} copiado al portapapeles`,
      duration: 2000,
    })
    setTimeout(() => setCopied(""), 2000)
  }

  const steps = [
    {
      number: 1,
      title: "Comprar el Dominio en GoDaddy",
      time: "5-10 min",
      difficulty: "Fácil",
    },
    {
      number: 2,
      title: "Acceder al Panel de GoDaddy",
      time: "2 min",
      difficulty: "Fácil",
    },
    {
      number: 3,
      title: "Configurar DNS en GoDaddy",
      time: "5-10 min",
      difficulty: "Medio",
    },
    {
      number: 4,
      title: "Agregar Dominio en Vercel",
      time: "3 min",
      difficulty: "Fácil",
    },
    {
      number: 5,
      title: "Actualizar Variables de Entorno",
      time: "2 min",
      difficulty: "Fácil",
    },
    {
      number: 6,
      title: "Verificar Funcionamiento",
      time: "1-24 horas",
      difficulty: "Automático",
    },
  ]

  const dnsRecords = [
    {
      type: "A",
      name: "@",
      value: "76.76.19.61",
      ttl: "1 Hour",
      description: "Apunta tu dominio principal a Vercel",
    },
    {
      type: "CNAME",
      name: "www",
      value: "cname.vercel-dns.com",
      ttl: "1 Hour",
      description: "Apunta www.tu-dominio.com a Vercel",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-orange-500 rounded-full">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Configurar Dominio GoDaddy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guía paso a paso para configurar tu dominio de GoDaddy con tu aplicación del torneo
          </p>
        </div>

        {/* Simulador de Dominio */}
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Settings className="w-5 h-5" />
              Simula tu Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domain">Tu dominio de GoDaddy:</Label>
                <Input
                  id="domain"
                  placeholder="torneo-la-negrita.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={() => setDomainName("torneo-la-negrita.com")} variant="outline" className="w-full">
                  Usar Ejemplo
                </Button>
              </div>
            </div>

            {domainName && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">URLs que funcionarán:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}</code>
                    <span className="text-green-600">← Página principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}/admin</code>
                    <span className="text-green-600">← Panel admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}/register</code>
                    <span className="text-green-600">← Registro</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proceso Completo */}
        <Card>
          <CardHeader>
            <CardTitle>Proceso Completo (6 Pasos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                  <div className="bg-orange-100 text-orange-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.time}
                      </Badge>
                      <Badge
                        variant={
                          step.difficulty === "Fácil"
                            ? "default"
                            : step.difficulty === "Medio"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {step.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Comprar Dominio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                1
              </span>
              Comprar Dominio en GoDaddy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">Pasos en GoDaddy.com:</h3>
              <ol className="text-sm text-orange-700 space-y-1">
                <li>
                  1. Ve a{" "}
                  <a href="https://godaddy.com" target="_blank" className="underline" rel="noreferrer">
                    godaddy.com
                  </a>
                </li>
                <li>2. Busca tu dominio deseado</li>
                <li>3. Agrégalo al carrito</li>
                <li>
                  4. <strong>IMPORTANTE:</strong> Rechaza todos los extras (hosting, email, etc.)
                </li>
                <li>5. Completa la compra</li>
                <li>6. Crea tu cuenta GoDaddy si no tienes una</li>
              </ol>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Consejo:</strong> GoDaddy intentará venderte muchos servicios adicionales. Solo necesitas el
                dominio básico. Rechaza hosting, email, SSL, etc.
              </AlertDescription>
            </Alert>

            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <a href="https://godaddy.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ir a GoDaddy.com
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Paso 2: Acceder al Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                2
              </span>
              Acceder al Panel de GoDaddy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Cómo acceder:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>
                  1. Ve a{" "}
                  <a href="https://sso.godaddy.com" target="_blank" className="underline" rel="noreferrer">
                    sso.godaddy.com
                  </a>
                </li>
                <li>2. Inicia sesión con tu cuenta</li>
                <li>3. Haz clic en "My Products" o "Mis Productos"</li>
                <li>4. Busca la sección "Domains" o "Dominios"</li>
                <li>5. Haz clic en tu dominio</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline">
                <a href="https://sso.godaddy.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Login GoDaddy
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://dcc.godaddy.com/manage" target="_blank" rel="noopener noreferrer">
                  <Settings className="w-4 h-4 mr-2" />
                  Panel de Control
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Configurar DNS (MÁS DETALLADO) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                3
              </span>
              Configurar DNS en GoDaddy (PASO CRÍTICO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>⚠️ IMPORTANTE:</strong> Este es el paso más importante y donde más gente se confunde en GoDaddy.
              </AlertDescription>
            </Alert>

            {/* Instrucciones Detalladas */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-4">Instrucciones Paso a Paso en GoDaddy:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Busca "DNS Management" o "Administrar DNS"</p>
                    <p className="text-sm text-gray-600">
                      En tu panel de dominio, busca un botón que diga "DNS" o "Manage DNS"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Busca la sección "DNS Records" o "Registros DNS"</p>
                    <p className="text-sm text-gray-600">
                      Puede estar en una pestaña llamada "DNS Records", "Records", o "Registros"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Elimina registros existentes (si los hay)</p>
                    <p className="text-sm text-gray-600">Busca registros tipo "A" con nombre "@" y elimínalos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Agrega los nuevos registros</p>
                    <p className="text-sm text-gray-600">Haz clic en "Add Record" o "Agregar Registro" para cada uno</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registros DNS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Registros DNS a Agregar:</h3>
              {dnsRecords.map((record, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Tipo</Label>
                      <div className="font-mono font-bold text-lg text-blue-600">{record.type}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Nombre/Host</Label>
                      <div className="font-mono font-bold">{record.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Valor/Apunta a</Label>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded">{record.value}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">TTL</Label>
                      <div className="font-mono text-sm">{record.ttl}</div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(record.value, `${record.type} Record`)}
                        className="w-full"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copied === `${record.type} Record` ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 italic">{record.description}</p>
                </div>
              ))}
            </div>

            {/* Capturas de Pantalla Simuladas */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Cómo se ve en GoDaddy:</h4>
              <div className="space-y-2 text-sm text-yellow-700">
                <p>
                  • <strong>Type:</strong> Selecciona "A" del dropdown
                </p>
                <p>
                  • <strong>Host/Name:</strong> Escribe "@" (sin comillas)
                </p>
                <p>
                  • <strong>Points to/Value:</strong> Escribe "76.76.19.61"
                </p>
                <p>
                  • <strong>TTL:</strong> Deja "1 Hour" o "3600"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paso 4: Vercel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                4
              </span>
              Agregar Dominio en Vercel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Pasos en Vercel:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>
                  1. Ve a tu{" "}
                  <a href="https://vercel.com/dashboard" target="_blank" className="underline" rel="noreferrer">
                    Vercel Dashboard
                  </a>
                </li>
                <li>2. Selecciona tu proyecto del torneo</li>
                <li>3. Ve a Settings → Domains</li>
                <li>4. Haz clic en "Add Domain"</li>
                <li>5. Escribe tu dominio (ej: torneo-la-negrita.com)</li>
                <li>6. Haz clic en "Add"</li>
              </ol>
            </div>

            <Button asChild className="w-full">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Vercel Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Paso 5: Variables de Entorno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                5
              </span>
              Actualizar Variables de Entorno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Una vez configurado el dominio, actualiza esta variable en Vercel:</p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-semibold text-green-700">Variable a actualizar:</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm">NEXT_PUBLIC_APP_URL</code>
                  <span className="text-gray-500">=</span>
                  {domainName ? (
                    <code className="bg-white px-3 py-2 rounded border font-mono text-sm">https://{domainName}</code>
                  ) : (
                    <code className="bg-gray-100 px-3 py-2 rounded border font-mono text-sm text-gray-500">
                      https://tu-dominio.com
                    </code>
                  )}
                  {domainName && (
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(`https://${domainName}`, "URL")}>
                      <Copy className="w-4 h-4 mr-1" />
                      {copied === "URL" ? "¡Copiado!" : "Copiar"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Cómo actualizar en Vercel:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. En tu proyecto, ve a Settings → Environment Variables</li>
                <li>2. Busca NEXT_PUBLIC_APP_URL</li>
                <li>3. Haz clic en los tres puntos → Edit</li>
                <li>4. Cambia el valor a tu nuevo dominio</li>
                <li>5. Guarda y haz Redeploy</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Paso 6: Verificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                6
              </span>
              Verificar Funcionamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>⏰ Tiempo de espera:</strong> Los cambios DNS pueden tardar de 1 a 24 horas en propagarse
                completamente.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">✅ Señales de Éxito:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Tu dominio carga la página principal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Aparece el candado HTTPS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    /admin funciona correctamente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    El registro de jugadores funciona
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-red-700">❌ Problemas Comunes:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    "Site can't be reached" → Esperar más tiempo
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    "DNS error" → Revisar registros DNS
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Página en blanco → Actualizar variables
                  </li>
                </ul>
              </div>
            </div>

            {domainName && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">URLs para probar:</h4>
                <div className="space-y-2">
                  {[
                    { path: "", label: "Página principal" },
                    { path: "/admin", label: "Panel administrativo" },
                    { path: "/register", label: "Registro de jugadores" },
                    { path: "/login", label: "Login admin" },
                  ].map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <code className="bg-white px-2 py-1 rounded border text-sm">
                        https://{domainName}
                        {url.path}
                      </code>
                      <span className="text-sm text-green-600">← {url.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Herramientas de Verificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Herramientas de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Verificar DNS:</h4>
                <p className="text-sm text-blue-700 mb-3">Verifica que tus registros DNS estén correctos</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    DNS Checker
                  </a>
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Verificar SSL:</h4>
                <p className="text-sm text-green-700 mb-3">Verifica que HTTPS esté funcionando</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    SSL Test
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Final */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-800 text-xl mb-3">
                  ✅ Resumen: Tu Dominio GoDaddy Funcionará Perfectamente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Lo que tendrás:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• Dominio profesional funcionando</li>
                      <li>• HTTPS automático y seguro</li>
                      <li>• Acceso admin completo</li>
                      <li>• Todas las funciones del torneo</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Costos totales:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• Dominio GoDaddy: ~$15/año</li>
                      <li>• Hosting Vercel: $0 (gratis)</li>
                      <li>• SSL/HTTPS: $0 (incluido)</li>
                      <li>
                        • <strong>Total: ~$15/año</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Finales */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
            <a href="https://godaddy.com" target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5 mr-2" />
              Comprar en GoDaddy
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
              <Settings className="w-5 h-5 mr-2" />
              Configurar en Vercel
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
