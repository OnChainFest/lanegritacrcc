import { getSupabase } from "./supabase-server"

export interface PlayerProfile {
  id: string
  name: string
  email: string
  payment_status: string
  created_at: string
  series: PlayerSeries[]
  achievements: PlayerAchievement[]
  standings: PlayerStanding[]
}

export interface PlayerSeries {
  id: string
  round_number: number
  game_1: number
  game_2: number
  game_3: number
  total_score: number
  created_at: string
}

export interface PlayerAchievement {
  id: string
  achievement_type: string
  description: string
  points_awarded: number
  created_at: string
}

export interface PlayerStanding {
  id: string
  tournament_round: number
  position: number
  total_score: number
  games_played: number
  created_at: string
}

export class ResultsService {
  static async getPlayerProfile(playerId: string): Promise<PlayerProfile> {
    try {
      console.log(`🎯 ResultsService: Fetching profile for player ${playerId}`)

      const supabase = getSupabase()

      // Get player basic info
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("id, name, email, payment_status, created_at")
        .eq("id", playerId)
        .single()

      if (playerError) {
        console.error("🎯 ResultsService: Error fetching player:", playerError)
        throw new Error(`Player not found: ${playerError.message}`)
      }

      console.log("🎯 ResultsService: Player found:", player)

      // Get player series (if table exists)
      let series: PlayerSeries[] = []
      try {
        const { data: seriesData, error: seriesError } = await supabase
          .from("player_series")
          .select("*")
          .eq("player_id", playerId)
          .order("round_number", { ascending: true })

        if (!seriesError && seriesData) {
          series = seriesData
        }
      } catch (error) {
        console.log("🎯 ResultsService: player_series table not found or empty")
      }

      // Get player achievements (if table exists)
      let achievements: PlayerAchievement[] = []
      try {
        const { data: achievementsData, error: achievementsError } = await supabase
          .from("player_achievements")
          .select("*")
          .eq("player_id", playerId)
          .order("created_at", { ascending: false })

        if (!achievementsError && achievementsData) {
          achievements = achievementsData
        }
      } catch (error) {
        console.log("🎯 ResultsService: player_achievements table not found or empty")
      }

      // Get player standings (if table exists)
      let standings: PlayerStanding[] = []
      try {
        const { data: standingsData, error: standingsError } = await supabase
          .from("player_standings")
          .select("*")
          .eq("player_id", playerId)
          .order("tournament_round", { ascending: true })

        if (!standingsError && standingsData) {
          standings = standingsData
        }
      } catch (error) {
        console.log("🎯 ResultsService: player_standings table not found or empty")
      }

      const profile: PlayerProfile = {
        id: player.id,
        name: player.name,
        email: player.email,
        payment_status: player.payment_status,
        created_at: player.created_at,
        series,
        achievements,
        standings,
      }

      console.log("🎯 ResultsService: Profile compiled successfully")
      return profile
    } catch (error) {
      console.error("🎯 ResultsService: Error in getPlayerProfile:", error)
      throw error
    }
  }

  static async getAllPlayers(): Promise<any[]> {
    try {
      console.log("🎯 ResultsService: Fetching all verified players")

      const supabase = getSupabase()

      const { data, error } = await supabase
        .from("players")
        .select("id, name, email, payment_status, created_at")
        .eq("payment_status", "verified")
        .order("name", { ascending: true })

      if (error) {
        console.error("🎯 ResultsService: Error fetching players:", error)
        throw new Error(`Failed to fetch players: ${error.message}`)
      }

      console.log(`🎯 ResultsService: Found ${data?.length || 0} verified players`)
      return data || []
    } catch (error) {
      console.error("🎯 ResultsService: Error in getAllPlayers:", error)
      throw error
    }
  }

  static async getPlayerSeries(playerId: string): Promise<PlayerSeries[]> {
    try {
      console.log(`🎯 ResultsService: Fetching series for player ${playerId}`)

      const supabase = getSupabase()

      const { data, error } = await supabase
        .from("player_series")
        .select("*")
        .eq("player_id", playerId)
        .order("round_number", { ascending: true })

      if (error) {
        console.error("🎯 ResultsService: Error fetching series:", error)
        return []
      }

      console.log(`🎯 ResultsService: Found ${data?.length || 0} series for player`)
      return data || []
    } catch (error) {
      console.error("🎯 ResultsService: Error in getPlayerSeries:", error)
      return []
    }
  }

  static async addPlayerSeries(
    playerId: string,
    roundNumber: number,
    game1: number,
    game2: number,
    game3: number,
  ): Promise<boolean> {
    try {
      console.log(`🎯 ResultsService: Adding series for player ${playerId}, round ${roundNumber}`)

      const supabase = getSupabase()
      const totalScore = game1 + game2 + game3

      const { error } = await supabase.from("player_series").insert({
        player_id: playerId,
        round_number: roundNumber,
        game_1: game1,
        game_2: game2,
        game_3: game3,
        total_score: totalScore,
      })

      if (error) {
        console.error("🎯 ResultsService: Error adding series:", error)
        throw new Error(`Failed to add series: ${error.message}`)
      }

      console.log("🎯 ResultsService: Series added successfully")
      return true
    } catch (error) {
      console.error("🎯 ResultsService: Error in addPlayerSeries:", error)
      throw error
    }
  }

  static async getTournamentRounds(): Promise<any[]> {
    try {
      console.log("🎯 ResultsService: Fetching tournament rounds")

      const supabase = getSupabase()

      const { data, error } = await supabase
        .from("tournament_rounds")
        .select("*")
        .order("round_number", { ascending: true })

      if (error) {
        console.error("🎯 ResultsService: Error fetching rounds:", error)
        return []
      }

      console.log(`🎯 ResultsService: Found ${data?.length || 0} tournament rounds`)
      return data || []
    } catch (error) {
      console.error("🎯 ResultsService: Error in getTournamentRounds:", error)
      return []
    }
  }

  static async getStandings(): Promise<any[]> {
    try {
      console.log("🎯 ResultsService: Fetching current standings")

      const supabase = getSupabase()

      // Try to get standings from view first, fallback to manual calculation
      try {
        const { data, error } = await supabase
          .from("player_standings_with_names")
          .select("*")
          .order("total_score", { ascending: false })

        if (!error && data) {
          console.log(`🎯 ResultsService: Found ${data.length} standings from view`)
          return data
        }
      } catch (viewError) {
        console.log("🎯 ResultsService: View not available, calculating manually")
      }

      // Manual calculation fallback
      const { data: players, error: playersError } = await supabase
        .from("players")
        .select("id, name")
        .eq("payment_status", "verified")

      if (playersError || !players) {
        console.error("🎯 ResultsService: Error fetching players for standings:", playersError)
        return []
      }

      const standings = []
      for (const player of players) {
        const { data: series } = await supabase.from("player_series").select("total_score").eq("player_id", player.id)

        const totalScore = series?.reduce((sum, s) => sum + (s.total_score || 0), 0) || 0
        const gamesPlayed = series?.length || 0

        standings.push({
          player_id: player.id,
          player_name: player.name,
          total_score: totalScore,
          games_played: gamesPlayed,
        })
      }

      standings.sort((a, b) => b.total_score - a.total_score)
      console.log(`🎯 ResultsService: Calculated ${standings.length} standings manually`)
      return standings
    } catch (error) {
      console.error("🎯 ResultsService: Error in getStandings:", error)
      return []
    }
  }
}
