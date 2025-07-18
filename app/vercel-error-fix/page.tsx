"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, AlertTriangle, Terminal, Monitor, Apple } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VercelErrorFixPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (text: string, commandName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCommand(commandName)
      toast({
        title: "✅ Copiado",
        description: `Comando ${commandName} copiado al portapapeles`,
        duration: 2000,
      })
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      })
    }
  }

  const CommandButton = ({ command, name, description }: { command: string; name: string; description: string }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex-1">
        <p className="font-mono text-sm text-green-400 mb-1">{command}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <Button
        onClick={() => copyToClipboard(command, name)}
        variant="outline"
        size="sm"
        className="ml-4 bg-slate-700 hover:bg-slate-600 border-slate-600"
      >
        {copiedCommand === name ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">🚨 Error de Deploy en Vercel</h1>
          <p className="text-slate-300 text-lg">
            Solución paso a paso para dependencias faltantes y errores de sintaxis
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Errores Identificados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="destructive" className="mt-1">
                  1
                </Badge>
                <div>
                  <p className="text-white font-medium">Dependencias faltantes de Radix UI</p>
                  <p className="text-slate-400 text-sm">
                    @radix-ui/react-checkbox, @radix-ui/react-progress, @radix-ui/react-scroll-area,
                    @radix-ui/react-separator
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="destructive" className="mt-1">
                  2
                </Badge>
                <div>
                  <p className="text-white font-medium">Error de sintaxis en app/admin/page.tsx</p>
                  <p className="text-slate-400 text-sm">Estructura JSX incorrecta en línea 484</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="windows" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/90 border-slate-700">
              <TabsTrigger value="windows" className="text-slate-300 data-[state=active]:text-white">
                <Monitor className="h-4 w-4 mr-2" />
                Windows PowerShell
              </TabsTrigger>
              <TabsTrigger value="unix" className="text-slate-300 data-[state=active]:text-white">
                <Apple className="h-4 w-4 mr-2" />
                Mac/Linux
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="windows" className="space-y-6">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Terminal className="h-5 w-5" />
                  Comandos para Windows PowerShell
                </CardTitle>
                <p className="text-slate-400 text-sm">Ejecuta estos comandos UNO POR UNO (no uses &&)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandButton
                  command="npm install @radix-ui/react-checkbox @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-separator"
                  name="install-deps"
                  description="1. Instalar dependencias faltantes"
                />
                <CommandButton
                  command="npm cache clean --force"
                  name="clean-cache"
                  description="2. Limpiar caché de npm"
                />
                <CommandButton
                  command="Remove-Item -Recurse -Force node_modules"
                  name="remove-modules"
                  description="3. Eliminar node_modules (PowerShell)"
                />
                <CommandButton
                  command="npm install"
                  name="reinstall"
                  description="4. Reinstalar todas las dependencias"
                />
                <CommandButton command="npm run build" name="test-build" description="5. Probar build local" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Si el build funciona, sube los cambios:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandButton command="git add ." name="git-add" description="Agregar cambios" />
                <CommandButton
                  command='git commit -m "fix: agregar dependencias faltantes y corregir sintaxis"'
                  name="git-commit"
                  description="Crear commit"
                />
                <CommandButton command="git push" name="git-push" description="Subir cambios a GitHub" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unix" className="space-y-6">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Terminal className="h-5 w-5" />
                  Comandos para Mac/Linux Terminal
                </CardTitle>
                <p className="text-slate-400 text-sm">Puedes usar && para ejecutar comandos en secuencia</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandButton
                  command="npm install @radix-ui/react-checkbox @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-separator"
                  name="install-deps-unix"
                  description="1. Instalar dependencias faltantes"
                />
                <CommandButton
                  command="npm cache clean --force && rm -rf node_modules && npm install"
                  name="clean-reinstall-unix"
                  description="2. Limpiar y reinstalar todo"
                />
                <CommandButton command="npm run build" name="test-build-unix" description="3. Probar build local" />
                <CommandButton
                  command='git add . && git commit -m "fix: agregar dependencias faltantes y corregir sintaxis" && git push'
                  name="git-all-unix"
                  description="4. Subir cambios (si build funciona)"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-800/90 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-amber-400">⚠️ Notas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                1
              </Badge>
              <p className="text-slate-300">
                He corregido el error de sintaxis en{" "}
                <code className="bg-slate-700 px-2 py-1 rounded text-green-400">app/admin/page.tsx</code>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                2
              </Badge>
              <p className="text-slate-300">He creado todos los componentes UI faltantes</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                3
              </Badge>
              <p className="text-slate-300">En Windows PowerShell, ejecuta cada comando por separado</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                4
              </Badge>
              <p className="text-slate-300">
                Verifica que <code className="bg-slate-700 px-2 py-1 rounded text-green-400">npm run build</code>{" "}
                funcione antes de hacer push
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-slate-400">
            Una vez que el build local funcione, Vercel debería deployar sin problemas 🚀
          </p>
        </div>
      </div>
    </div>
  )
}
