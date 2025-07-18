"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileText } from "lucide-react"

export function RegulationModal() {
  const [open, setOpen] = useState(false)

  const regulationContent = `
REGLAMENTO TORNEO LA NEGRITA 2025

1. Fechas del torneo: 2 al 9 de agosto 2025.

2. Categorías: Hándicap, senior, scratch. Modalidad 700, series de 3 juegos.

3. PREMIOS:
   • Premio mínimo torneo hándicap US$2,500
   • Se van a premiar los primeros 16 lugares en categoría hándicap
   • 3 primeros lugares scratch
   • 3 primeros lugares senior masculino y femenino hándicap
   • 1era línea de 300 o línea más alta del torneo
   • Serie alta y ganador maratón de strikes

4. Precio inscripción $70 hasta el 19 de julio.
   Posterior a esta fecha $80. Incluye jugar 2 series.
   Participación en categoría scratch cuesta $22 adicionales.

5. Los reenganches cuestan $22.

6. El Maratón de strikes cuesta $22.

7. Participación en el desesperado $22. (un juego)

8. Hándicap basado a 215. El hándicap se saca del promedio de todas las líneas jugadas en las distintas ligas que jueguen. El promedio de las ligas en que se juegue será ponderado. Para aquellos jugadores que jugaron la 4ta edición en 2024, se les aplicará ese promedio utilizando todas las líneas jugadas excepto la ronda final. Promedios de ligas son únicamente para aquellos jugadores que no jugaron el evento en 2024, si no cuentan con promedio en ninguna bolera deberá realizar 10 juegos en la bolera del Country previo al inicio del Torneo.

9. Hándicap al 100% las mujeres, 90% los hombres para jugadores de ligas que no hayan jugado la Negrita el año pasado y 80% para jugadores que solo tenga registro en torneos Nacionales (AJUBOL, ACOBOL, ASEBOL).

10. Clasifican las 15 series más altas a la final, más el ganador del desesperado.

11. Turnos: Se juegan mínimo 2 turnos diariamente.
    De ser necesario se abrirán turnos adicionales.
    (se aceita al inicio de cada turno).

12. Patrón casa.

TORNEO LA NEGRITA - RONDA FINAL:
Doble eliminación en las finales.
Las finales inician apenas termina el desesperado.
Los 16 clasificados juegan 1 línea. Los 8 perdedores pasan a la llave C; los 8 ganadores a la llave B.
Los 8 jugadores de la llave C juegan 1 línea.
Los 4 perdedores de la llave ocupan los puestos 13, 14, 15 y 16.
Los 4 ganadores de la llave C pasan a la llave E.
Los 8 jugadores de la llave B juegan 1 línea.
Los 4 perdedores pasan a la llave E.
Los 4 ganadores de la llave D.
Los 4 jugadores de la llave D juegan 1 línea
Los 2 perdedores pasan a la llave G
Los 2 ganadores pasan a la llave F
El ganador de la llave F pasa a la final
Los 8 jugadores de la llave E juegan 1 línea

MÉTODOS DE PAGO:

NACIONALES - Para pagos en Colones (CRC):
• Beneficiario: Costa Rica Country Club, S.A.
• Cédula Jurídica: 3-101-002477
• Banco: BAC San José
• SWIFT: BSNJCRSJ
• Cuenta Cliente: 10200009090951681
• Cuenta Corriente: 909095168
• Cuenta IBAN: CR81010200009090951681
• Moneda: CRC (Colones)

EXTRANJEROS - Para pagos en Dólares (USD):
• Beneficiario: Costa Rica Country Club, S.A.
• Cédula Jurídica: 3-101-002477
• Banco: BAC San José
• SWIFT: BSNJCRSJ
• Cuenta Cliente: 10200009090951847
• Cuenta Corriente: 909095184
• Cuenta IBAN: CR61010200009090951847
• Moneda: USD (Dólar)

Instrucciones Importantes:
Al realizar el pago incluir en el detalle de la transferencia la siguiente información:
• Nombre completo del(los) jugador(es)
• Liga en la que participa(n)
• Una vez realizado el pago, enviar el comprobante al correo: boliche@country.co.cr

Agradecemos su puntualidad y colaboración.

PAQUETES PARA JUGADORES DE COSTA RICA:
HASTA 20 JULIO:
• INSCRIPCIÓN: ¢36,000 (Incluye 2 series, 3 juegos c/u)
• INSC + 3 REENGANCHES: ¢65,000
• INSC + 4 REENGANCHES: ¢72,000

DESPUÉS 20 JULIO:
• INSCRIPCIÓN: ¢42,000 (Incluye 2 series, 3 juegos c/u)
• INSC + 3 REENGANCHES: ¢71,000
• INSC + 4 REENGANCHES: ¢78,000

PAQUETES PARA JUGADORES EXTRANJEROS:
HASTA 20 JULIO:
• INSCRIPCIÓN: $70 (Incluye 2 series, 3 juegos c/u)
• INSC + 3 REENGANCHES: $122
• INSC + 5 REENGANCHES: $153
• INSC + 8 REENGANCHES: $201
• +DESESPERADO: Agregar $22

DESPUÉS 20 JULIO:
• INSCRIPCIÓN: $80 (Incluye 2 series, 3 juegos c/u)
• INSC + 3 REENGANCHES: $132
• INSC + 5 REENGANCHES: $163
• INSC + 8 REENGANCHES: $210
• +DESESPERADO: Agregar $22

PREMIOS:
HÁNDICAP:
• 1ER LUGAR: $2,500
• Premios hasta el puesto 16

SCRATCH:
• 1ER LUGAR: $700
• 3 primeros lugares

SENIOR MASCULINO:
• 1ER LUGAR: $1,000

SENIOR FEMENINO:
• 1ER LUGAR: $1,000

PREMIO AL PRIMER 300 SCRATCH O LA LÍNEA MÁS ALTA SCRATCH

IMPORTANTE:
• NO SE HACE DEVOLUCIÓN DE DINERO
• NO SE PUEDEN PASAR REENGANCHES DE UN JUGADOR A OTRO

Hospedaje recomendado: Villas del Río https://es.villasdelrio.com/
Para más información contactar a Bryan Matarrita.

Patrón de aceite: Kegel Recreation Series - STONE STREET - 9642
• Oil Pattern Distance: 42 Feet
• Forward Oil Total: 11.5 mL
• Forward Boards Crossed: 230 Boards
• Reverse Brush Drop: 50 uL
• Reverse Oil Total: 23.15 mL
• Reverse Boards Crossed: 463 Boards
• Oil Per Board: 11.65 mL
• Volume Oil Total: 233 Boards
• Total Boards Crossed: Forward Oil + Reverse Oil

Contacto:
(+506) 2208-5027
boliche@country.co.cr
`

  const downloadPDF = () => {
    // Open the PDF in a new tab instead of downloading
    window.open("https://acrobat.adobe.com/id/urn:aaid:sc:US:f8e1e12e-6b07-45ab-8257-66d490b2b06e", "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg bg-white/10 backdrop-blur-sm"
        >
          <FileText className="w-6 h-6 mr-2" />
          Ver Reglamento del Torneo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Reglamento Torneo La Negrita 2025
          </DialogTitle>
          <DialogDescription>Reglamento oficial del torneo. Lea cuidadosamente antes de registrarse.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{regulationContent}</pre>
        </ScrollArea>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
          <Button onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Ver PDF Completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
