export interface PlayerSeries {
  id: number
  player_id: number
  round_id: number
  series_number: number
  game_1: number
  game_2: number
  game_3: number
  total_score: number
  average_score: number
  played_at: string
  created_at: string
  updated_at: string
  player?: {
    name: string
    email: string
  }
  round?: {
    name: string
  }
}
