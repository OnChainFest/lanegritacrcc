// Base de datos simulada en memoria para desarrollo
const mockData = {
  players: [
    {
      id: "player-1",
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "8888-1111",
      emergency_contact: "María Pérez",
      emergency_phone: "8888-2222",
      payment_status: "verified",
      qr_validated: true,
      wallet_address: "0x1234567890abcdef",
      created_at: "2025-01-10T10:00:00Z",
    },
    {
      id: "player-2",
      name: "Ana García",
      email: "ana@example.com",
      phone: "8888-3333",
      emergency_contact: "Carlos García",
      emergency_phone: "8888-4444",
      payment_status: "pending",
      qr_validated: false,
      created_at: "2025-01-11T14:30:00Z",
    },
    {
      id: "player-3",
      name: "Luis Rodríguez",
      email: "luis@example.com",
      phone: "8888-5555",
      emergency_contact: "Carmen Rodríguez",
      emergency_phone: "8888-6666",
      payment_status: "verified",
      qr_validated: true,
      created_at: "2025-01-12T09:15:00Z",
    },
  ],
  rounds: [
    {
      id: 1,
      name: "Ronda Clasificatoria",
      date: "2025-01-20",
      status: "active",
      created_at: "2025-01-15T10:00:00Z",
    },
  ],
  series: [
    {
      id: 1,
      player_id: "player-1",
      player_name: "Juan Pérez",
      round_id: 1,
      round_name: "Ronda Clasificatoria",
      game_1: 180,
      game_2: 165,
      game_3: 195,
      total: 540,
      created_at: "2025-01-15T11:00:00Z",
    },
  ],
  brackets: [
    {
      id: 1,
      name: "Eliminación Directa Principal",
      type: "single-elimination",
      status: "active",
      players_count: 0,
      created_at: "2025-01-15T12:00:00Z",
    },
  ],
}

export const database = {
  // Obtener todos los jugadores
  async getPlayers() {
    try {
      console.log("🗄️  Database: Obteniendo jugadores...")
      return {
        success: true,
        players: mockData.players,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        players: [],
        error: "Error obteniendo jugadores",
      }
    }
  },

  // Obtener estadísticas del torneo
  async getTournamentStats() {
    try {
      console.log("🗄️  Database: Calculando estadísticas...")
      const totalPlayers = mockData.players.length
      const verifiedPlayers = mockData.players.filter((p) => p.payment_status === "verified").length
      const pendingPlayers = totalPlayers - verifiedPlayers
      const totalRevenue = verifiedPlayers * 25000 // 25,000 CRC por jugador

      return {
        success: true,
        total_players: totalPlayers,
        verified_players: verifiedPlayers,
        pending_players: pendingPlayers,
        total_revenue: totalRevenue,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        total_players: 0,
        verified_players: 0,
        pending_players: 0,
        total_revenue: 0,
        error: "Error calculando estadísticas",
      }
    }
  },

  // Actualizar estado de pago de jugador
  async updatePlayerPaymentStatus(playerId, status) {
    try {
      console.log(`🗄️  Database: Actualizando pago ${playerId} -> ${status}`)
      const playerIndex = mockData.players.findIndex((p) => p.id === playerId)

      if (playerIndex === -1) {
        return {
          success: false,
          error: "Jugador no encontrado",
        }
      }

      mockData.players[playerIndex].payment_status = status
      return {
        success: true,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error actualizando estado de pago",
      }
    }
  },

  // Validar QR de jugador
  async validatePlayerQR(playerId) {
    try {
      console.log(`🗄️  Database: Validando QR para ${playerId}`)
      const playerIndex = mockData.players.findIndex((p) => p.id === playerId)

      if (playerIndex === -1) {
        return {
          success: false,
          error: "Jugador no encontrado",
        }
      }

      mockData.players[playerIndex].qr_validated = true
      return {
        success: true,
        player: mockData.players[playerIndex],
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error validando QR",
      }
    }
  },

  // Obtener rondas
  async getRounds() {
    try {
      console.log("🗄️  Database: Obteniendo rondas...")
      return {
        success: true,
        rounds: mockData.rounds,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        rounds: [],
        error: "Error obteniendo rondas",
      }
    }
  },

  // Crear nueva ronda
  async createRound(name, date) {
    try {
      console.log(`🗄️  Database: Creando ronda ${name}`)
      const newRound = {
        id: mockData.rounds.length + 1,
        name,
        date,
        status: "active",
        created_at: new Date().toISOString(),
      }

      mockData.rounds.push(newRound)
      return {
        success: true,
        round: newRound,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error creando ronda",
      }
    }
  },

  // Agregar serie de jugador
  async addPlayerSeries(playerId, roundId, game1, game2, game3) {
    try {
      console.log(`🗄️  Database: Agregando serie para ${playerId}`)
      const player = mockData.players.find((p) => p.id === playerId)
      const round = mockData.rounds.find((r) => r.id === roundId)

      if (!player || !round) {
        return {
          success: false,
          error: "Jugador o ronda no encontrados",
        }
      }

      const newSeries = {
        id: mockData.series.length + 1,
        player_id: playerId,
        player_name: player.name,
        round_id: roundId,
        round_name: round.name,
        game_1: game1,
        game_2: game2,
        game_3: game3,
        total: game1 + game2 + game3,
        created_at: new Date().toISOString(),
      }

      mockData.series.push(newSeries)
      return {
        success: true,
        series: newSeries,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error agregando serie",
      }
    }
  },

  // Obtener clasificaciones
  async getStandings() {
    try {
      console.log("🗄️  Database: Calculando clasificaciones...")
      const standings = []

      // Agrupar series por jugador
      const playerStats = {}
      mockData.series.forEach((series) => {
        if (!playerStats[series.player_id]) {
          playerStats[series.player_id] = {
            player_id: series.player_id,
            player_name: series.player_name,
            total_score: 0,
            games_played: 0,
          }
        }
        playerStats[series.player_id].total_score += series.total
        playerStats[series.player_id].games_played += 3 // 3 juegos por serie
      })

      // Convertir a array y calcular promedios
      Object.values(playerStats).forEach((stats) => {
        standings.push({
          ...stats,
          average_score: Math.round(stats.total_score / stats.games_played),
        })
      })

      // Ordenar por puntaje total descendente
      standings.sort((a, b) => b.total_score - a.total_score)

      return {
        success: true,
        standings,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        standings: [],
        error: "Error calculando clasificaciones",
      }
    }
  },

  // Obtener brackets
  async getBrackets() {
    try {
      console.log("🗄️  Database: Obteniendo brackets...")
      return {
        success: true,
        brackets: mockData.brackets,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        brackets: [],
        error: "Error obteniendo brackets",
      }
    }
  },

  // Crear bracket
  async createBracket(name, type) {
    try {
      console.log(`🗄️  Database: Creando bracket ${name}`)
      const newBracket = {
        id: mockData.brackets.length + 1,
        name,
        type,
        status: "active",
        players_count: 0,
        created_at: new Date().toISOString(),
      }

      mockData.brackets.push(newBracket)
      return {
        success: true,
        bracket: newBracket,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error creando bracket",
      }
    }
  },

  // Agregar jugador a bracket
  async addPlayerToBracket(bracketId, playerId) {
    try {
      console.log(`🗄️  Database: Agregando jugador ${playerId} al bracket ${bracketId}`)
      const bracketIndex = mockData.brackets.findIndex((b) => b.id === bracketId)
      const player = mockData.players.find((p) => p.id === playerId)

      if (bracketIndex === -1 || !player) {
        return {
          success: false,
          error: "Bracket o jugador no encontrados",
        }
      }

      // Incrementar contador de jugadores
      mockData.brackets[bracketIndex].players_count += 1

      return {
        success: true,
        error: null,
      }
    } catch (error) {
      console.error("🗄️  Database Error:", error)
      return {
        success: false,
        error: "Error agregando jugador al bracket",
      }
    }
  },
}
