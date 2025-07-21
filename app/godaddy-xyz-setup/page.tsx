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
  MousePointer,
  Monitor,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GoDaddyXYZSetupPage() {
  const [copied, setCopied] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
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
      title: "Acceder a GoDaddy",
      time: "2 min",
      difficulty: "Fácil",
      description: "Login y encontrar tu dominio",
    },
    {
      number: 2,
      title: "Ir a DNS Management",
      time: "1 min",
      difficulty: "Fácil",
      description: "Navegar al panel de DNS",
    },
    {
      number: 3,
      title: "Configurar Registros DNS",
      time: "5-10 min",
      difficulty: "Medio",
      description: "Agregar registros A y CNAME",
    },
    {
      number: 4,
      title: "Agregar en Vercel",
      time: "3 min",
      difficulty: "Fácil",
      description: "Conectar dominio con proyecto",
    },
    {
      number: 5,
      title: "Actualizar Variables",
      time: "2 min",
      difficulty: "Fácil",
      description: "Cambiar NEXT_PUBLIC_APP_URL",
    },
    {
      number: 6,
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
      ttl: "1 Hour",
      description: "Apunta torneolanegrita.xyz directamente a Vercel",
      priority: "CRÍTICO",
    },
    {
      type: "CNAME",
      name: "www",
      value: "cname.vercel-dns.com",
      ttl: "1 Hour",
      description: "Apunta www.torneolanegrita.xyz a Vercel",
      priority: "CRÍTICO",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-orange-500 rounded-full">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">GoDaddy: torneolanegrita.xyz</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guía específica para configurar tu dominio .xyz de GoDaddy con el torneo de boliche
          </p>
        </div>

        {/* Estado Actual */}
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Settings className="w-5 h-5" />
              Tu Configuración Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <Label className="text-sm font-semibold text-orange-700">Dominio:</Label>
                <div className="mt-1">
                  <code className="bg-orange-100 px-3 py-2 rounded border font-mono text-lg">torneolanegrita.xyz</code>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <Label className="text-sm font-semibold text-orange-700">Proveedor:</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">GoDaddy</div>
                  <span className="text-sm text-gray-600">✅ Confirmado</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">URLs que funcionarán después:</h3>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progreso */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    currentStep === step.number
                      ? "bg-orange-50 border-orange-200 shadow-md"
                      : currentStep > step.number
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentStep === step.number
                        ? "bg-orange-500 text-white"
                        : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
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
                  {currentStep === step.number && <ArrowRight className="w-5 h-5 text-orange-500 animate-pulse" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                ← Anterior
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                disabled={currentStep === 6}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Siguiente →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Acceder a GoDaddy */}
        <Card className={currentStep === 1 ? "ring-2 ring-orange-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                1
              </span>
              Acceder a GoDaddy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Pasos exactos en GoDaddy:
              </h3>
              <ol className="text-sm text-orange-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Ve a{" "}
                    <a
                      href="https://sso.godaddy.com"
                      target="_blank"
                      className="underline font-semibold"
                      rel="noreferrer"
                    >
                      sso.godaddy.com
                    </a>{" "}
                    e inicia sesión
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>Haz clic en "My Products" o "Mis Productos"</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Busca la sección <strong>"Domains"</strong> o <strong>"Dominios"</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    Busca <strong>"torneolanegrita.xyz"</strong> y haz clic en él
                  </div>
                </li>
              </ol>
            </div>

            <Alert>
              <Monitor className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Tip:</strong> Si no ves "My Products", busca un menú hamburguesa (☰) o tu nombre de usuario
                en la esquina superior derecha.
              </AlertDescription>
            </Alert>

            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
              <a href="https://sso.godaddy.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                Abrir GoDaddy Login
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Paso 2: DNS Management */}
        <Card className={currentStep === 2 ? "ring-2 ring-orange-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                2
              </span>
              Ir a DNS Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Una vez en tu dominio torneolanegrita.xyz:
              </h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Busca un botón que diga <strong>"DNS"</strong>, <strong>"Manage DNS"</strong>, o{" "}
                    <strong>"DNS Management"</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>Haz clic en ese botón</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Te llevará a una página con una tabla de <strong>"DNS Records"</strong> o{" "}
                    <strong>"Registros DNS"</strong>
                  </div>
                </li>
              </ol>
            </div>

            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>⚠️ Importante:</strong> Si ves opciones como "Forwarding" o "Parking", NO las uses. Necesitas
                "DNS Management" específicamente.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2">Posibles ubicaciones del botón DNS:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• En la página principal del dominio (más común)</li>
                <li>• En una pestaña llamada "DNS" o "Advanced"</li>
                <li>• En un menú desplegable junto al nombre del dominio</li>
                <li>• En la sección "Domain Settings" o "Configuración"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Configurar DNS (MÁS DETALLADO) */}
        <Card className={currentStep === 3 ? "ring-2 ring-orange-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                3
              </span>
              Configurar Registros DNS (PASO CRÍTICO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>🚨 CRÍTICO:</strong> Debes agregar EXACTAMENTE estos 2 registros. Sin ellos, tu dominio NO
                funcionará. Lee cada paso cuidadosamente.
              </AlertDescription>
            </Alert>

            {/* Instrucciones Paso a Paso */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Instrucciones Paso a Paso en GoDaddy DNS:
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-red-800">ELIMINAR registros existentes (si los hay)</p>
                    <p className="text-sm text-gray-600">
                      Busca registros tipo "A" con nombre "@" y elimínalos. También elimina cualquier "CNAME" con nombre
                      "www".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Buscar "Add Record" o "Agregar Registro"</p>
                    <p className="text-sm text-gray-600">
                      Debe haber un botón para agregar nuevos registros DNS. Puede decir "Add", "+", o "New Record".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Agregar los 2 registros siguientes</p>
                    <p className="text-sm text-gray-600">Uno por uno, usando los valores exactos de abajo.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registros DNS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Registros DNS a Agregar:</h3>
              {dnsRecords.map((record, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="destructive" className="text-xs font-bold">
                      {record.priority}
                    </Badge>
                    <h4 className="font-bold text-lg">
                      Registro {index + 1}: {record.type}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-3">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Tipo / Type</Label>
                      <div className="font-mono font-bold text-xl text-purple-600 bg-purple-50 p-2 rounded">
                        {record.type}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Nombre / Host / Name</Label>
                      <div className="font-mono font-bold text-lg bg-blue-50 p-2 rounded">{record.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">Valor / Value / Points to</Label>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded border">{record.value}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold">TTL</Label>
                      <div className="font-mono text-sm bg-green-50 p-2 rounded">{record.ttl}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(record.value, `${record.type} Record`)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copied === `${record.type} Record` ? "¡Copiado!" : "Copiar Valor"}
                    </Button>
                    <span className="text-xs text-gray-500">← Copia este valor exacto</span>
                  </div>

                  <p className="text-xs text-gray-600 italic font-medium bg-gray-50 p-2 rounded">
                    📝 {record.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Ejemplo Visual Detallado */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />💡 Cómo completar cada campo en GoDaddy:
              </h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border-l-4 border-l-red-500">
                  <p className="font-semibold text-sm mb-2 text-red-700">REGISTRO 1 - Tipo A:</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <strong>Type/Tipo:</strong>
                      <br />
                      Selecciona "A" del dropdown
                    </div>
                    <div>
                      <strong>Host/Name/Nombre:</strong>
                      <br />
                      Escribe "@" (sin comillas)
                    </div>
                    <div>
                      <strong>Points to/Value/Valor:</strong>
                      <br />
                      Escribe "76.76.19.61"
                    </div>
                    <div>
                      <strong>TTL:</strong>
                      <br />
                      Deja "1 Hour" o "3600"
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border-l-4 border-l-blue-500">
                  <p className="font-semibold text-sm mb-2 text-blue-700">REGISTRO 2 - Tipo CNAME:</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <strong>Type/Tipo:</strong>
                      <br />
                      Selecciona "CNAME" del dropdown
                    </div>
                    <div>
                      <strong>Host/Name/Nombre:</strong>
                      <br />
                      Escribe "www" (sin comillas)
                    </div>
                    <div>
                      <strong>Points to/Value/Valor:</strong>
                      <br />
                      Escribe "cname.vercel-dns.com"
                    </div>
                    <div>
                      <strong>TTL:</strong>
                      <br />
                      Deja "1 Hour" o "3600"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>✅ Después de agregar ambos registros:</strong> Haz clic en "Save" o "Guardar". GoDaddy puede
                tardar unos minutos en aplicar los cambios.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Paso 4: Vercel */}
        <Card className={currentStep === 4 ? "ring-2 ring-orange-500" : ""}>
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
              <h3 className="font-semibold text-blue-800 mb-3">Pasos exactos en Vercel:</h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Ve a tu{" "}
                    <a
                      href="https://vercel.com/dashboard"
                      target="_blank"
                      className="underline font-semibold"
                      rel="noreferrer"
                    >
                      Vercel Dashboard
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>Selecciona tu proyecto del torneo (torneo-la-negrita)</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Ve a <strong>Settings</strong> → <strong>Domains</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <div>Haz clic en "Add Domain" o "Add"</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    Escribe: <strong>torneolanegrita.xyz</strong> y haz clic en "Add"
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    6
                  </span>
                  <div>
                    Repite para: <strong>www.torneolanegrita.xyz</strong>
                  </div>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                <Label className="text-sm font-semibold text-green-700">Dominio Principal:</Label>
                <code className="block bg-green-50 p-3 rounded mt-2 font-mono text-sm">torneolanegrita.xyz</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("torneolanegrita.xyz", "Dominio Principal")}
                  className="mt-2 w-full"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied === "Dominio Principal" ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                <Label className="text-sm font-semibold text-blue-700">Con WWW:</Label>
                <code className="block bg-blue-50 p-3 rounded mt-2 font-mono text-sm">www.torneolanegrita.xyz</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("www.torneolanegrita.xyz", "Dominio WWW")}
                  className="mt-2 w-full"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied === "Dominio WWW" ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Importante:</strong> Agrega ambos dominios (con y sin www) para que funcionen las dos
                versiones. Vercel configurará automáticamente el SSL/HTTPS.
              </AlertDescription>
            </Alert>

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                Abrir Vercel Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Paso 5: Variables de Entorno */}
        <Card className={currentStep === 5 ? "ring-2 ring-orange-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                5
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
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm font-bold">
                    NEXT_PUBLIC_APP_URL
                  </code>
                  <span className="text-gray-500 text-lg">=</span>
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm font-bold text-green-700">
                    https://torneolanegrita.xyz
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("https://torneolanegrita.xyz", "URL Completa")}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === "URL Completa" ? "¡Copiado!" : "Copiar URL"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Cómo actualizar en Vercel:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. En tu proyecto, ve a Settings → Environment Variables</li>
                <li>2. Busca NEXT_PUBLIC_APP_URL en la lista</li>
                <li>3. Haz clic en los tres puntos (...) → Edit</li>
                <li>
                  4. Cambia el valor a:{" "}
                  <code className="bg-white px-1 rounded font-mono">https://torneolanegrita.xyz</code>
                </li>
                <li>5. Haz clic en "Save"</li>
                <li>6. Ve a la pestaña "Deployments" y haz clic en "Redeploy"</li>
              </ol>
            </div>

            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>⚠️ Importante:</strong> Después de cambiar la variable, DEBES hacer "Redeploy" para que los
                cambios tomen efecto.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Paso 6: Verificación */}
        <Card className={currentStep === 6 ? "ring-2 ring-orange-500" : ""}>
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
                <strong>⏰ Tiempo de espera:</strong> Los cambios DNS en GoDaddy pueden tardar de 15 minutos a 24 horas
                en propagarse completamente por internet.
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
                    Aparece el candado HTTPS (🔒)
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
                    "DNS error" → Revisar registros en GoDaddy
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Página en blanco → Actualizar variables
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Error 404 → Hacer redeploy en Vercel
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    "Invalid Host header" → Variable mal configurada
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">URLs para probar (una vez configurado):</h4>
              <div className="space-y-2">
                {[
                  { url: "https://torneolanegrita.xyz", label: "Página principal del torneo" },
                  { url: "https://www.torneolanegrita.xyz", label: "Con www (debe funcionar igual)" },
                  { url: "https://torneolanegrita.xyz/admin", label: "Panel administrativo" },
                  { url: "https://torneolanegrita.xyz/register", label: "Registro de jugadores" },
                  { url: "https://torneolanegrita.xyz/login", label: "Login admin" },
                  { url: "https://torneolanegrita.xyz/brackets", label: "Brackets del torneo" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border text-sm font-mono">{item.url}</code>
                    <span className="text-sm text-green-600">← {item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Credenciales de administrador:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Usuario:</strong> <code className="bg-white px-2 py-1 rounded">admin</code>
                </div>
                <div>
                  <strong>Contraseña:</strong> <code className="bg-white px-2 py-1 rounded">admin123</code>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                ⚠️ <strong>Importante:</strong> Cambia estas credenciales después del primer login por seguridad.
              </p>
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
                <h3 className="font-bold text-green-800 text-xl mb-3">✅ Resumen: torneolanegrita.xyz con GoDaddy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Lo que tendrás funcionando:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• Dominio profesional .xyz</li>
                      <li>• HTTPS automático y seguro</li>
                      <li>• Panel de administración completo</li>
                      <li>• Sistema de registro de jugadores</li>
                      <li>• Gestión de brackets y resultados</li>
                      <li>• Funciona con y sin www</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Configuración completada:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• DNS configurado en GoDaddy ✓</li>
                      <li>• Dominio agregado en Vercel ✓</li>
                      <li>• Variables de entorno actualizadas ✓</li>
                      <li>• SSL/HTTPS automático ✓</li>
                      <li>• Listo para usar ✓</li>
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
            Sigue los pasos en orden y tu dominio estará funcionando perfectamente 🚀
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
              <a href="https://sso.godaddy.com" target="_blank" rel="noopener noreferrer">
                <Globe className="w-5 h-5 mr-2" />
                Configurar en GoDaddy
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
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
