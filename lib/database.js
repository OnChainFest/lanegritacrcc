// Actualizar la clase TournamentDatabase para usar las APIs que funcionan
export class TournamentDatabase {
  // Player registration
  static async registerPlayer(playerData) {
    try {
      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error registering player:", error)
      return { success: false, error: error?.message || "Unknown error" }
    }
  }

  // Get all registered players
  static async getPlayers(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus)
      if (filters.country) params.append("country", filters.country)

      const response = await fetch(`/api/players?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error fetching players:", error)
      return { success: false, error: error?.message || "Unknown error" }
    }
  }

  // Update player payment status
  static async updatePaymentStatus(playerId, status) {
    try {
      const response = await fetch("/api/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, status }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error updating payment status:", error)
      return { success: false, error: error?.message || "Unknown error" }
    }
  }

  // Get tournament statistics
  static async getTournamentStats() {
    try {
      const response = await fetch("/api/tournament-stats")
      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error fetching tournament stats:", error)
      return { success: false, error: error?.message || "Unknown error" }
    }
  }

  // Generate brackets (placeholder)
  static async generateBrackets() {
    try {
      // Por ahora retornamos éxito simulado
      // En el futuro se puede implementar la lógica real
      return { success: true, message: "Brackets generated successfully" }
    } catch (error) {
      console.error("Error generating brackets:", error)
      return { success: false, error: error?.message || "Unknown error" }
    }
  }
}
