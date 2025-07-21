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
import { FileText, Download, ExternalLink } from "lucide-react"

export function RegulationModal() {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownloadPDF = () => {
    // Open the Adobe document in a new tab
    window.open("https://acrobat.adobe.com/id/urn:aaid:sc:US:fde136a4-a823-46c4-9136-5e7bf2364767", "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-body">
          <FileText className="w-6 h-6 mr-2" />
          Ver Reglamento del Torneo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-600" />
            Reglamento Torneo La Negrita 2025
          </DialogTitle>
          <DialogDescription className="text-gray-600">5ª Edición - 2 al 9 de Agosto, 2025</DialogDescription>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Ver PDF Completo
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Documento
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[70vh] w-full pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            {/* Información General */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                INFORMACIÓN GENERAL
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1. Fechas del torneo:</strong> 2 al 9 de agosto 2025.
                </p>
                <p>
                  <strong>2. Categorías:</strong> hándicap, senior femenino y masculino y scratch.
                </p>
                <p>
                  <strong>3. Torneo modalidad 700:</strong> 2 series de 3 juegos.
                </p>
              </div>
            </section>

            {/* Inscripción */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                INSCRIPCIÓN
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1. Precio inscripción hasta el 23 de julio:</strong> $70.
                </p>
                <p>
                  <strong>2. Precio inscripción posterior al 23 de julio:</strong> $80.
                </p>
                <p className="ml-4">
                  <strong>a.</strong> Con el pago de la inscripción el jugador tiene derecho a jugar 2 series.
                </p>
                <p>
                  <strong>3. Participación en categoría scratch cuesta $22 adicionales.</strong>
                </p>
                <p>
                  <strong>4. Cada reenganche cuesta $22.</strong>
                </p>
                <p>
                  <strong>5. El Maratón de strikes cuesta $22.</strong>
                </p>
                <p>
                  <strong>6. Participación en el desperado $22.</strong> (un juego para sacar el último clasificado a la
                  final).
                </p>
              </div>
            </section>

            {/* Premios */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">PREMIOS</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1. Premio mínimo torneo hándicap US$2,500</strong> (Se van a premiar los primeros 16 lugares
                  en categoría hándicap);
                </p>
                <p>
                  <strong>3 primeros lugares torneo scratch $700;</strong>
                </p>
                <p>
                  <strong>3 primeros lugares senior masculino y femenino con hándicap $1,000;</strong>
                </p>
                <p>
                  <strong>Línea de 300:</strong> Se rifa el premio entre los que tiren 300;
                </p>
                <p>
                  <strong>Serie alta con hándicap y el ganador del maratón de strikes.</strong>
                </p>
              </div>
            </section>

            {/* Clasificación a las finales */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                CLASIFICACIÓN A LAS FINALES
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1.</strong> Clasifican a la ronda final los 15 jugadores con el acumulado de pines más alto a
                  la hora de sumar las 2 series de 3 líneas que juega cada uno. Sin un jugador juega reenganches,
                  igualmente se utilizan las 2 series con puntuación más alta, del total de series jugadas. El
                  clasificado #16 es el ganador de la línea del desperado.
                </p>
                <p>
                  <strong>2. Turnos:</strong> Se juegan mínimo 2 turnos diariamente a las 6 y 8 PM. (De ser necesario se
                  abrirán turnos adicionales). Se aceita al inicio de cada turno.
                </p>
                <p>
                  <strong>3. Patrón casa.</strong>
                </p>
              </div>
            </section>

            {/* Hándicap */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                HÁNDICAP: 215
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>1.</strong> El hándicap se saca del promedio de todas las líneas jugadas en las distintas
                  ligas que jueguen. (Se suman el total de pines en todas las líneas jugadas en cada liga, y se dividen
                  por el número de líneas jugadas en todas las ligas). Para aquellos jugadores que hayan jugado la
                  edición 2024, se utilizará el promedio que sea más alto entre el promedio de ligas y La Negrita 2024
                  (Para sacar el promedio de La Negrita 2024, no se usan las líneas de la ronda final).
                </p>
                <p>
                  <strong>2.</strong> Hándicap al 100% las mujeres; 90% los hombres, y 80% para jugadores que solo
                  tengan registro en torneos Nacionales (AJUBOL, ACOBOL, ASEBOL).
                </p>
                <p className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <strong>NOTA:</strong> si un jugador no cuenta con promedio en ningun lado debe jugar 15 lineas antes
                  de 02 de agosto y se le asignara hándicap al 70%.
                </p>
              </div>
            </section>

            {/* Ronda Final */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                RONDA FINAL - DOBLE ELIMINACIÓN
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Doble eliminación en las finales.</strong>
                </p>
                <p>Las finales inician apenas termina el desperado.</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                  <p>• Los 16 clasificados (llave A) juegan 1 línea.</p>
                  <p>• Los 8 perdedores pasan a la llave C; los 8 ganadores a la llave B.</p>
                  <p>• Los 8 jugadores de la llave C juegan 1 línea.</p>
                  <p>• Los 4 perdedores de la llave C ocupan los puestos 13, 14, 15 y 16.</p>
                  <p>• Los 4 ganadores de la llave C pasan a la llave E.</p>
                  <p>• Los 8 jugadores de la llave B juegan 1 línea.</p>
                  <p>• Los 4 perdedores pasan a la llave E.</p>
                  <p>• Los 4 ganadores a la llave D.</p>
                  <p>• Los 4 jugadores de la llave D juegan 1 línea.</p>
                  <p>• Los 2 perdedores pasan a la llave G.</p>
                  <p>• Los 2 ganadores pasan a la llave F.</p>
                  <p>• El ganador de la llave F pasa a la final.</p>
                  <p>• El perdedor pasa a la llave H.</p>
                  <p>• Los 8 jugadores de la llave E juegan 1 línea.</p>
                  <p>• Los 4 ganadores pasan a la llave G.</p>
                  <p>• Los 4 perdedores ocupan los puestos 9, 10, 11 y 12.</p>
                  <p>• Los jugadores de la llave G juegan 1 línea.</p>
                  <p>• Los 3 ganadores pasan a la llave H</p>
                  <p>• Los 3 perdedores ocupan los puestos 6, 7 y 8.</p>
                  <p>• Los jugadores de la llave H juegan 1 línea.</p>
                  <p>• Los 2 ganadores pasan a la llave I.</p>
                  <p>• Los 2 perdedores ocupan los lugares 4 y 5.</p>
                  <p>• Los jugadores de la llave I juegan 1 línea.</p>
                  <p>• El ganador pasa a la final.</p>
                  <p>• El perdedor ocupa el 3er lugar.</p>
                  <p>• Si el ganador de la llave F pierde en la final, tiene derecho de defender una línea más.</p>
                </div>
              </div>
            </section>

            {/* Eventos Adicionales */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                EVENTOS ADICIONALES
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>En paralelo a las clasificaciones para las finales se van a jugar varias actividades:</p>
                <p className="text-sm italic">
                  (Todas estas actividades se deben pagar en efectivo antes del inicio del turno).
                </p>

                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p>
                      <strong>1. Virusa (₡5,000):</strong>
                    </p>
                    <p className="text-sm">
                      Se paga el 70% del monto recaudado - 40% 1er lugar 20% al 2do lugar, y 10% al 3er lugar.
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded">
                    <p>
                      <strong>2. Premiación para strikes en las 3 líneas de cada serie en los frames 3,6 y 9.</strong>
                    </p>
                    <p className="text-sm">
                      Se entrega 70% del premio al jugador ganador. Si nadie gana en la primera fecha, el premio se
                      acumula a la segunda fecha y así sucesivamente. Si no hay ningún ganador el premio le queda al
                      club. (A partir de ₡2,000)
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded">
                    <p>
                      <strong>3. Premiación a la línea alta con hándicap (₡2,000):</strong>
                    </p>
                    <p className="text-sm">
                      Se premia el 70% de lo recaudado. (Mínimo 3 jugadores por turno). Score máximo es de 300. Si se da
                      un empate se rifa el premio entre los que empaten.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded">
                    <p>
                      <strong>4. Brackets.</strong>
                    </p>
                  </div>
                </div>

                <p className="text-sm italic">
                  Las fechas para cada una de estas actividades se estarán anunciando oportunamente.
                </p>
              </div>
            </section>

            {/* Métodos de Pago */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                MÉTODOS DE PAGO - COSTA RICA COUNTRY CLUB, S.A.
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">NACIONALES - Para pagos en Colones (CRC):</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Beneficiario:</strong> Costa Rica Country Club, S.A.
                    </p>
                    <p>
                      <strong>Cédula Jurídica:</strong> 3-101-002477
                    </p>
                    <p>
                      <strong>Banco:</strong> BAC San José
                    </p>
                    <p>
                      <strong>SWIFT:</strong> BSNJCRSJ
                    </p>
                    <p>
                      <strong>Cuenta Cliente:</strong> 10200009090951681
                    </p>
                    <p>
                      <strong>Cuenta Corriente:</strong> 909095168
                    </p>
                    <p>
                      <strong>Cuenta IBAN:</strong> CR81010200009090951681
                    </p>
                    <p>
                      <strong>Moneda:</strong> CRC (Colones)
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">EXTRANJEROS - Para pagos en Dólares (USD):</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Beneficiario:</strong> Costa Rica Country Club, S.A.
                    </p>
                    <p>
                      <strong>Cédula Jurídica:</strong> 3-101-002477
                    </p>
                    <p>
                      <strong>Banco:</strong> BAC San José
                    </p>
                    <p>
                      <strong>SWIFT:</strong> BSNJCRSJ
                    </p>
                    <p>
                      <strong>Cuenta Cliente:</strong> 10200009090951847
                    </p>
                    <p>
                      <strong>Cuenta Corriente:</strong> 909095184
                    </p>
                    <p>
                      <strong>Cuenta IBAN:</strong> CR61010200009090951847
                    </p>
                    <p>
                      <strong>Moneda:</strong> USD (Dólar)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-yellow-800 mb-2">Instrucciones Importantes</h4>
                <div className="text-sm space-y-1">
                  <p>Al realizar el pago incluir en el detalle de la transferencia la siguiente información:</p>
                  <p>• Nombre completo del(los) jugador(es)</p>
                  <p>• Liga en la que participa(n)</p>
                  <p>
                    Una vez realizado el pago, enviar el comprobante al correo: <strong>boliche@country.co.cr</strong>.
                  </p>
                  <p>Agradecemos su puntualidad y colaboración.</p>
                </div>
              </div>
            </section>

            {/* Paquetes para Jugadores de Costa Rica */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                PAQUETES PARA JUGADORES DE COSTA RICA
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">HASTA EL 19 DE JULIO:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>INSCRIPCIÓN:</strong> ₡36,000 (Incluye 2 series, 3 juegos c/u)
                    </p>
                    <p>
                      <strong>INSC + 3 REENGANCHES:</strong> ₡65,000
                    </p>
                    <p>
                      <strong>INSC + 4 REENGANCHES:</strong> ₡72,000
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-bold text-red-800 mb-2">DESPUÉS DEL 19 DE JULIO:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>INSCRIPCIÓN:</strong> ₡42,000 (Incluye 2 series, 3 juegos c/u)
                    </p>
                    <p>
                      <strong>INSC + 3 REENGANCHES:</strong> ₡71,000
                    </p>
                    <p>
                      <strong>INSC + 4 REENGANCHES:</strong> ₡78,000
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Paquetes para Jugadores Extranjeros */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                PAQUETES PARA JUGADORES EXTRANJEROS
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">HASTA EL 19 DE JULIO:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>INSCRIPCIÓN:</strong> $70 (Incluye 2 series, 3 juegos c/u)
                    </p>
                    <p>
                      <strong>INSC + 3 REENGANCHES:</strong> $122
                    </p>
                    <p>
                      <strong>INSC + 5 REENGANCHES:</strong> $153
                    </p>
                    <p>
                      <strong>INSC + 8 REENGANCHES:</strong> $201
                    </p>
                    <p>
                      <strong>+DESPERADO:</strong> Agregar $22
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-bold text-red-800 mb-2">DESPUÉS DEL 19 DE JULIO:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>INSCRIPCIÓN:</strong> $80 (Incluye 2 series, 3 juegos c/u)
                    </p>
                    <p>
                      <strong>INSC + 3 REENGANCHES:</strong> $132
                    </p>
                    <p>
                      <strong>INSC + 5 REENGANCHES:</strong> $163
                    </p>
                    <p>
                      <strong>INSC + 8 REENGANCHES:</strong> $210
                    </p>
                    <p>
                      <strong>+DESPERADO:</strong> Agregar $22
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Premios Detallados */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                PREMIOS DETALLADOS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-yellow-800 mb-2">HÁNDICAP</h4>
                  <p className="text-2xl font-bold text-yellow-900">$2,500</p>
                  <p className="text-sm">1ER LUGAR</p>
                  <p className="text-xs">Premios hasta el puesto 16</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-blue-800 mb-2">SCRATCH</h4>
                  <p className="text-2xl font-bold text-blue-900">$700</p>
                  <p className="text-sm">1ER LUGAR</p>
                  <p className="text-xs">3 primeros lugares</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-green-800 mb-2">SENIOR FEM</h4>
                  <p className="text-2xl font-bold text-green-900">$1,000</p>
                  <p className="text-sm">1ER LUGAR</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-purple-800 mb-2">SENIOR MASC</h4>
                  <p className="text-2xl font-bold text-purple-900">$1,000</p>
                  <p className="text-sm">1ER LUGAR</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mt-4 text-center">
                <h4 className="font-bold text-orange-800 mb-2">PREMIO AL PRIMER 300 SCRATCH</h4>
                <p className="text-sm">Se rifa entre todos los que logren 300</p>
              </div>
            </section>

            {/* Notas Importantes */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                IMPORTANTE
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>• NO SE HACE DEVOLUCIÓN DE DINERO</strong>
                  </p>
                  <p>
                    <strong>• NO SE PUEDEN PASAR REENGANCHES DE UN JUGADOR A OTRO</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section>
              <h3 className="text-lg font-heading font-bold text-red-600 mb-3 border-b border-red-200 pb-1">
                INFORMACIÓN DE CONTACTO
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Teléfono:</strong> (+506) 2208-5027
                  </p>
                  <p>
                    <strong>Email:</strong> boliche@country.co.cr
                  </p>
                  <p>
                    <strong>Fechas:</strong> Del 2 al 9 de Agosto, 2025
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4">
          <Button onClick={handleDownloadPDF} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
            <Download className="w-5 h-5 mr-2" />
            Ver Documento Completo
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
