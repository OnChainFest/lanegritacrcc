"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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

export default function DomainSetupXYZPage() {
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
      title: "Acceder al Panel de tu Proveedor de Dominio",
      time: "2 min",
      difficulty: "Fácil",
      description: "Donde compraste torneolanegrita.xyz",
    },
    {
      number: 2,
      title: "Configurar DNS Records",
      time: "5-10 min",
      difficulty: "Medio",
      description: "Agregar registros A y CNAME",
    },
    {
      number: 3,
      title: "Agregar Dominio en Vercel",
      time: "3 min",
      difficulty: "Fácil",
      description: "Conectar con tu proyecto",
    },
    {
      number: 4,
      title: "Actualizar Variables de Entorno",
      time: "2 min",
      difficulty: "Fácil",
      description: "Cambiar NEXT_PUBLIC_APP_URL",
    },
    {
      number: 5,
      title: "Verificar Funcionamiento",
      time: "1-24 horas",
      difficulty: "Automático",
      description: "Esperar propagación DNS",
    },
  ]

  const dnsRecords = [
    {
      type: "A",
      name: "@",
      value: "76.76.19.61",
      ttl: "3600",
      description: "Apunta torneolanegrita.xyz a Vercel",
    },
    {
      type: "CNAME",
      name: "www",
      value: "cname.vercel-dns.com",
      ttl: "3600",
      description: "Apunta www.torneolanegrita.xyz a Vercel",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-purple-500 rounded-full">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Configurar www.torneolanegrita.xyz</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guía paso a paso para configurar tu dominio .xyz con la aplicación del torneo
          </p>
        </div>

        {/* Estado Actual */}
        <Card className="border-l-4 border-l-purple-500 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Settings className="w-5 h-5" />
              Tu Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <Label className="text-sm font-semibold text-purple-700">Dominio Principal:</Label>
                <div className="mt-1">
                  <code className="bg-purple-100 px-3 py-2 rounded border font-mono text-sm">torneolanegrita.xyz</code>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <Label className="text-sm font-semibold text-purple-700">Con WWW:</Label>
                <div className="mt-1">
                  <code className="bg-purple-100 px-3 py-2 rounded border font-mono text-sm">
                    www.torneolanegrita.xyz
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">URLs que funcionarán después de la configuración:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <code className="bg-white px-2 py-1 rounded border">https://torneolanegrita.xyz</code>
                  <span className="text-green-600">← Página principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <code className="bg-white px-2 py-1 rounded border">https://www.torneolanegrita.xyz</code>
                  <span className="text-green-600">← Con www</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <code className="bg-white px-2 py-1 rounded border">https://torneolanegrita.xyz/admin</code>
                  <span className="text-green-600">← Panel admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <code className="bg-white px-2 py-1 rounded border">https://torneolanegrita.xyz/register</code>
                  <span className="text-green-600">← Registro</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceso Completo */}
        <Card>
          <CardHeader>
            <CardTitle>Proceso Completo (5 Pasos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                  <div className="bg-purple-100 text-purple-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Acceder al Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                1
              </span>
              Acceder al Panel de tu Proveedor de Dominio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>¿Dónde compraste torneolanegrita.xyz?</strong> Necesitas acceder al panel de control del
                proveedor donde lo compraste (Namecheap, GoDaddy, Cloudflare, etc.)
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">GoDaddy</h4>
                <p className="text-sm text-orange-700 mb-3">Si compraste en GoDaddy</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://sso.godaddy.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Login GoDaddy
                  </a>
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Namecheap</h4>
                <p className="text-sm text-blue-700 mb-3">Si compraste en Namecheap</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://ap.www.namecheap.com/login" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Login Namecheap
                  </a>
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Cloudflare</h4>
                <p className="text-sm text-purple-700 mb-3">Si compraste en Cloudflare</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://dash.cloudflare.com/login" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Login Cloudflare
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2">Una vez dentro del panel:</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Busca tu dominio "torneolanegrita.xyz"</li>
                <li>2. Haz clic en él para administrarlo</li>
                <li>3. Busca la sección "DNS", "DNS Management", o "Administrar DNS"</li>
                <li>4. Continúa con el Paso 2</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Paso 2: Configurar DNS (DETALLADO) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                2
              </span>
              Configurar DNS Records (PASO CRÍTICO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>⚠️ MUY IMPORTANTE:</strong> Debes agregar EXACTAMENTE estos 2 registros DNS. Sin ellos, tu
                dominio no funcionará.
              </AlertDescription>
            </Alert>

            {/* Registros DNS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Registros DNS a Agregar:</h3>
              {dnsRecords.map((record, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Tipo</Label>
                      <div className="font-mono font-bold text-xl text-purple-600">{record.type}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Nombre/Host</Label>
                      <div className="font-mono font-bold text-lg">{record.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Valor/Apunta a</Label>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded border">{record.value}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">TTL</Label>
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
                  <p className="text-xs text-gray-600 mt-2 italic font-medium">{record.description}</p>
                </div>
              ))}
            </div>

            {/* Instrucciones por Proveedor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">En GoDaddy:</h4>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• Ve a "DNS Management"</li>
                  <li>• Haz clic en "Add Record"</li>
                  <li>• Selecciona tipo, nombre y valor</li>
                  <li>• Guarda cada registro</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">En Namecheap:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Ve a "Advanced DNS"</li>
                  <li>• Haz clic en "Add New Record"</li>
                  <li>• Completa Type, Host, Value</li>
                  <li>• Guarda cambios</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">En Cloudflare:</h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Ve a "DNS" → "Records"</li>
                  <li>• Haz clic en "Add record"</li>
                  <li>• Completa los campos</li>
                  <li>• Haz clic en "Save"</li>
                </ul>
              </div>
            </div>

            {/* Ejemplo Visual */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Ejemplo de cómo completar los campos:</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm mb-1">Registro A:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <strong>Type:</strong> A
                    </div>
                    <div>
                      <strong>Name/Host:</strong> @ (o dejar vacío)
                    </div>
                    <div>
                      <strong>Value:</strong> 76.76.19.61
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm mb-1">Registro CNAME:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <strong>Type:</strong> CNAME
                    </div>
                    <div>
                      <strong>Name/Host:</strong> www
                    </div>
                    <div>
                      <strong>Value:</strong> cname.vercel-dns.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Vercel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                3
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
                <li>
                  5. Escribe: <strong>torneolanegrita.xyz</strong>
                </li>
                <li>6. Haz clic en "Add"</li>
                <li>
                  7. Repite para: <strong>www.torneolanegrita.xyz</strong>
                </li>
              </ol>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Tip:</strong> Agrega ambos dominios (con y sin www) para que funcionen las dos versiones.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded border">
                <Label className="text-sm font-semibold">Dominio 1:</Label>
                <code className="block bg-gray-100 p-2 rounded mt-1 font-mono text-sm">torneolanegrita.xyz</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("torneolanegrita.xyz", "Dominio 1")}
                  className="mt-2 w-full"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied === "Dominio 1" ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>

              <div className="p-3 bg-white rounded border">
                <Label className="text-sm font-semibold">Dominio 2:</Label>
                <code className="block bg-gray-100 p-2 rounded mt-1 font-mono text-sm">www.torneolanegrita.xyz</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("www.torneolanegrita.xyz", "Dominio 2")}
                  className="mt-2 w-full"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied === "Dominio 2" ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Vercel Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Paso 4: Variables de Entorno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                4
              </span>
              Actualizar Variables de Entorno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Actualiza esta variable en Vercel para que la aplicación use tu nuevo dominio:
            </p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-semibold text-green-700">Variable a actualizar:</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm">NEXT_PUBLIC_APP_URL</code>
                  <span className="text-gray-500">=</span>
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm">
                    https://torneolanegrita.xyz
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("https://torneolanegrita.xyz", "URL")}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === "URL" ? "¡Copiado!" : "Copiar"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Cómo actualizar en Vercel:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. En tu proyecto, ve a Settings → Environment Variables</li>
                <li>2. Busca NEXT_PUBLIC_APP_URL</li>
                <li>3. Haz clic en los tres puntos → Edit</li>
                <li>
                  4. Cambia el valor a: <code className="bg-white px-1 rounded">https://torneolanegrita.xyz</code>
                </li>
                <li>5. Guarda y haz clic en "Redeploy" en la pestaña Deployments</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Paso 5: Verificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                5
              </span>
              Verificar Funcionamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>⏰ Tiempo de espera:</strong> Los cambios DNS pueden tardar de 15 minutos a 24 horas en
                propagarse completamente.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">✅ Señales de Éxito:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    torneolanegrita.xyz carga la página
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    www.torneolanegrita.xyz también funciona
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Aparece el candado HTTPS (seguro)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    /admin funciona correctamente
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
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Error 404 → Hacer redeploy en Vercel
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">URLs para probar (una vez configurado):</h4>
              <div className="space-y-2">
                {[
                  { url: "https://torneolanegrita.xyz", label: "Página principal" },
                  { url: "https://www.torneolanegrita.xyz", label: "Con www" },
                  { url: "https://torneolanegrita.xyz/admin", label: "Panel administrativo" },
                  { url: "https://torneolanegrita.xyz/register", label: "Registro de jugadores" },
                  { url: "https://torneolanegrita.xyz/login", label: "Login admin" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border text-sm">{item.url}</code>
                    <span className="text-sm text-green-600">← {item.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Ping Test:</h4>
                <p className="text-sm text-purple-700 mb-3">Verifica conectividad básica</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://ping.eu/ping/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ping Test
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
                  ✅ Resumen: torneolanegrita.xyz Funcionará Perfectamente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Lo que tendrás:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• Dominio profesional .xyz funcionando</li>
                      <li>• HTTPS automático y seguro</li>
                      <li>• Acceso admin completo</li>
                      <li>• Todas las funciones del torneo</li>
                      <li>• Funciona con y sin www</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Credenciales admin:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>
                        • Usuario: <code className="bg-white px-1 rounded">admin</code>
                      </li>
                      <li>
                        • Contraseña: <code className="bg-white px-1 rounded">admin123</code>
                      </li>
                      <li>• URL: torneolanegrita.xyz/admin</li>
                      <li>
                        • <strong>¡Cambia las credenciales después!</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Finales */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Una vez completados todos los pasos, tu dominio estará listo para usar 🚀
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <Settings className="w-5 h-5 mr-2" />
                Configurar en Vercel
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer">
                <Search className="w-5 h-5 mr-2" />
                Verificar DNS
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
