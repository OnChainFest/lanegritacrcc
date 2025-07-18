"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"

interface BracketData {
  name: string
  description: string
  players: string[]
  winners?: string[]
  losers?: string[]
  positions?: string[]
}

export default function BracketsPage() {
  const brackets: BracketData[] = [
    {
      name: "LLAVE A",
      description: "Un juego - Los 16 Clasificados",
      players: Array(16)
        .fill("")
        .map((_, i) => `Jugador ${i + 1}`),
      winners: Array(8).fill("Ganador"),
      losers: Array(8).fill("Perdedor"),
    },
    {
      name: "LLAVE B",
      description: "Un juego - 8 ganadores de A",
      players: Array(8).fill("Ganador de A"),
      winners: Array(4).fill("Ganador"),
      losers: Array(4).fill("Perdedor"),
    },
    {
      name: "LLAVE C",
      description: "Un juego - 8 perdedores de A",
      players: Array(8).fill("Perdedor de A"),
      positions: ["Los perdedores ocupan los puestos 16,15,14,13"],
    },
    {
      name: "LLAVE D",
      description: "Un juego - 4 ganadores de B",
      players: Array(4).fill("Ganador de B"),
      winners: Array(2).fill("Ganador"),
      losers: Array(2).fill("Perdedor"),
    },
    {
      name: "LLAVE E",
      description: "Un juego - 4 Ganadores de C + 4 Perdedores de B",
      players: Array(8).fill("4 Ganadores de C + 4 Perdedores de B"),
    },
    {
      name: "LLAVE F",
      description: "Un juego - 2 Ganadores de D",
      players: Array(2).fill("Ganador de D"),
      winners: ["Ganador pasa a final"],
    },
    {
      name: "LLAVE G",
      description: "Un juego - 2 Perdedores de D + 4 Ganadores de E",
      players: Array(6).fill("2 Perdedores de D + 4 Ganadores de E"),
      positions: ["Los perdedores ocupan los puestos 8,7,6"],
    },
    {
      name: "LLAVE H",
      description: "1 perdedor de F + 3 Ganadores de G",
      players: Array(4).fill("1 Perdedor de F + 3 Ganadores de G"),
      positions: ["Los perdedores ocupan los puestos 5,4"],
    },
    {
      name: "LLAVE I",
      description: "Un juego - 2 Ganadores de H",
      players: Array(2).fill("Ganador de H"),
      winners: ["Ganador pasa a final"],
      losers: ["El perdedor ocupa Puesto 3"],
    },
  ]

  const finalRound = {
    name: "RONDA FINAL",
    players: ["Ganador de D", "Ganador de I"],
    positions: ["perdedor puesto 2", "ganador puesto 1"],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/images/tournament-logo-bg.png')`,
            backgroundSize: "200px 150px",
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 font-semibold shadow-lg border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistema de Llaves - Torneo La Negrita 2025
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema de doble eliminación. Clasifican las 15 series más altas a la final, más el ganador del desesperado.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
          {brackets.map((bracket, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-center">{bracket.name}</CardTitle>
                <p className="text-sm text-gray-600 text-center">{bracket.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {bracket.players.slice(0, 8).map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span>{playerIndex + 1}</span>
                      <div className="flex-1 mx-2 border-b border-gray-300"></div>
                      <span className="text-gray-500">{player}</span>
                    </div>
                  ))}

                  {bracket.players.length > 8 && (
                    <>
                      <div className="text-center text-xs text-gray-500 py-1">...</div>
                      {bracket.players.slice(8).map((player, playerIndex) => (
                        <div
                          key={playerIndex + 8}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <span>{playerIndex + 9}</span>
                          <div className="flex-1 mx-2 border-b border-gray-300"></div>
                          <span className="text-gray-500">{player}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {bracket.winners && (
                  <div className="pt-2 border-t">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                      Ganadores
                    </Badge>
                    <div className="text-sm text-green-700">{bracket.winners.length} jugadores avanzan</div>
                  </div>
                )}

                {bracket.losers && (
                  <div className="pt-2 border-t">
                    <Badge variant="secondary" className="bg-red-100 text-red-800 mb-2">
                      Perdedores
                    </Badge>
                    <div className="text-sm text-red-700">{bracket.losers.length} jugadores eliminados</div>
                  </div>
                )}

                {bracket.positions && (
                  <div className="pt-2 border-t">
                    <Badge variant="outline" className="mb-2">
                      Posiciones
                    </Badge>
                    {bracket.positions.map((position, posIndex) => (
                      <div key={posIndex} className="text-sm text-gray-600">
                        {position}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Round */}
        <Card className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-yellow-800">
              <Trophy className="w-6 h-6" />
              {finalRound.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {finalRound.players.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-medium">{index + 1}</span>
                  <span className="text-gray-700">{player}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-yellow-200">
              <Badge className="bg-yellow-600 text-white mb-2">Resultado Final</Badge>
              {finalRound.positions.map((position, index) => (
                <div key={index} className="text-sm text-yellow-800">
                  • {position}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200 shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-900 mb-3">Información Importante</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Las finales inician apenas termina el desesperado</li>
                <li>• Sistema de doble eliminación en todas las rondas</li>
                <li>• Los jugadores avanzan según su desempeño en cada llave</li>
                <li>• Las posiciones finales se determinan por el orden de eliminación</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
