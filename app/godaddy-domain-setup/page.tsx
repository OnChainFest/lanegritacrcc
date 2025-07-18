"use client"

import { useState, useEffect } from "react"
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
  Settings,
  Shield,
  Database,
  Server,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GoDaddyDomainSetupPage() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [vercelProjectUrl, setVercelProjectUrl] = useState("")
  const [domainName, setDomainName] = useState("")
  const [copied, setCopied] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setCurrentUrl(window.location.origin)
    // Try to extract Vercel project URL from current URL
    if (window.location.hostname.includes("vercel.app")) {
      setVercelProjectUrl(window.location.origin)
    }
  }, [])

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

  const vercelDnsRecords = [
    {
      type: "A",
      name: "@",
      value: "76.76.19.61",
      description: "Apunta tu dominio principal a Vercel",
    },
    {
      type: "CNAME",
      name: "www",
      value: "cname.vercel-dns.com",
      description: "Apunta www.tu-dominio.com a Vercel",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 p-4 md:p-8">
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
            Obtén todos los datos necesarios para conectar tu dominio de GoDaddy con el Torneo La Negrita
          </p>
        </div>

        {/* Estado Actual del Proyecto */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Server className="w-5 h-5" />
              Información Actual del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-700">URL Actual:</Label>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm flex-1">
                    {currentUrl || "Cargando..."}
                  </code>
                  {currentUrl && (
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentUrl, "URL Actual")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-700">Estado:</Label>
                <Badge variant={currentUrl.includes("vercel.app") ? "default" : "secondary"}>
                  {currentUrl.includes("vercel.app") ? "Desplegado en Vercel" : "Desarrollo Local"}
                </Badge>
              </div>
            </div>

            {currentUrl.includes("vercel.app") && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>✅ Perfecto!</strong> Tu proyecto ya está desplegado en Vercel. Esto facilita la configuración
                  del dominio.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

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
                <h3 className="font-semibold text-green-800 mb-2">URLs que funcionarán con tu dominio:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}</code>
                    <span className="text-green-600">← Página principal del torneo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}/admin</code>
                    <span className="text-green-600">← Panel administrativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}/register</code>
                    <span className="text-green-600">← Registro de jugadores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <code className="bg-white px-2 py-1 rounded border">https://{domainName}/brackets</code>
                    <span className="text-green-600">← Llaves del torneo</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paso 1: Datos para Vercel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                1
              </span>
              Datos para Configurar en Vercel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-500 bg-blue-50">
              <Settings className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Primero debes agregar tu dominio en Vercel</strong> antes de configurar GoDaddy.
              </AlertDescription>
            </Alert>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-4">Pasos en Vercel Dashboard:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Ve a tu proyecto en Vercel</p>
                    <p className="text-sm text-gray-600">
                      Busca el proyecto "torneo-la-negrita" o similar en tu dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Ve a Settings → Domains</p>
                    <p className="text-sm text-gray-600">
                      En la barra lateral izquierda, busca "Settings" y luego "Domains"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Haz clic en "Add Domain"</p>
                    <p className="text-sm text-gray-600">Botón azul que dice "Add" o "Add Domain"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Escribe tu dominio</p>
                    {domainName ? (
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{domainName}</code>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(domainName, "Dominio")}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Ejemplo: torneo-la-negrita.com</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <p className="font-medium">Vercel te dará los datos DNS</p>
                    <p className="text-sm text-gray-600">Vercel mostrará exactamente qué configurar en GoDaddy</p>
                  </div>
                </div>
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

        {/* Paso 2: Datos DNS para GoDaddy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                2
              </span>
              Datos DNS para Configurar en GoDaddy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                <strong>Estos son los datos estándar de Vercel.</strong> Vercel puede darte datos específicos para tu
                proyecto.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Registros DNS a Agregar en GoDaddy:</h3>
              {vercelDnsRecords.map((record, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Cómo se ve en GoDaddy:</h4>
              <div className="space-y-2 text-sm text-yellow-700">
                <p>
                  <strong>Para el registro A:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Type: Selecciona "A" del dropdown</li>
                  <li>Host/Name: Escribe "@" (sin comillas)</li>
                  <li>Points to/Value: Escribe "76.76.19.61"</li>
                  <li>TTL: Deja "1 Hour" o "3600"</li>
                </ul>
                <p>
                  <strong>Para el registro CNAME:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Type: Selecciona "CNAME" del dropdown</li>
                  <li>Host/Name: Escribe "www"</li>
                  <li>Points to/Value: Escribe "cname.vercel-dns.com"</li>
                  <li>TTL: Deja "1 Hour" o "3600"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Variable de Entorno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                3
              </span>
              Actualizar Variable de Entorno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Una vez configurado el dominio, debes actualizar esta variable en Vercel:</p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-semibold text-green-700">Variable a actualizar en Vercel:</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="bg-white px-3 py-2 rounded border font-mono text-sm">NEXT_PUBLIC_APP_URL</code>
                  <span className="text-gray-500">=</span>
                  {domainName ? (
                    <>
                      <code className="bg-white px-3 py-2 rounded border font-mono text-sm">https://{domainName}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`https://${domainName}`, "URL Completa")}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copied === "URL Completa" ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </>
                  ) : (
                    <code className="bg-gray-100 px-3 py-2 rounded border font-mono text-sm text-gray-500">
                      https://tu-dominio.com
                    </code>
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
                <li>5. Guarda y haz Redeploy del proyecto</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Paso 4: Verificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                4
              </span>
              Verificar que Todo Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {domainName && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">URLs para probar (después de 1-24 horas):</h4>
                <div className="space-y-2">
                  {[
                    { path: "", label: "Página principal del torneo", icon: Globe },
                    { path: "/admin", label: "Panel administrativo", icon: Shield },
                    { path: "/register", label: "Registro de jugadores", icon: Globe },
                    { path: "/login", label: "Login admin", icon: Shield },
                    { path: "/brackets", label: "Llaves del torneo", icon: Database },
                  ].map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <url.icon className="w-4 h-4 text-green-600" />
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

            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>⏰ Tiempo de espera:</strong> Los cambios DNS pueden tardar de 1 a 24 horas en propagarse
                completamente.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Herramientas de Verificación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Herramientas para Verificar
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
                <h4 className="font-semibold text-purple-800 mb-2">Verificar Velocidad:</h4>
                <p className="text-sm text-purple-700 mb-3">Verifica la velocidad de tu sitio</p>
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    PageSpeed
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
                <h3 className="font-bold text-green-800 text-xl mb-3">✅ Resumen: Datos Necesarios para GoDaddy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Datos DNS para GoDaddy:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• Registro A: @ → 76.76.19.61</li>
                      <li>• Registro CNAME: www → cname.vercel-dns.com</li>
                      <li>• TTL: 1 Hour (3600 segundos)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Variable de entorno:</h4>
                    <ul className="space-y-1 text-green-600">
                      <li>• NEXT_PUBLIC_APP_URL</li>
                      <li>• Valor: https://tu-dominio.com</li>
                      <li>• Configurar en Vercel</li>
                      <li>• Hacer redeploy después</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Finales */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
              <Settings className="w-5 h-5 mr-2" />
              Configurar en Vercel
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://dcc.godaddy.com/manage" target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5 mr-2" />
              Configurar en GoDaddy
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
