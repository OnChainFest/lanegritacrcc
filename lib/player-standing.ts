export interface PlayerStanding {
  id: number
  player_id: number
  round_id: number
  total_series: number
  total_games: number
  total_pins: number
  average_score: number
  highest_game: number
  highest_series: number
  current_position: number
  previous_position: number | null
  games_played: number
  last_updated: string
  created_at: string
  player?: {
    name: string
    email: string
    league?: string
    nationality?: string
  }
  round?: {
    name: string
  }
}
