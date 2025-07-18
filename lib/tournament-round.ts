export interface TournamentRound {
  id: number
  name: string
  description: string
  start_date: string | null
  end_date: string | null
  is_active: boolean
  round_order: number
  created_at: string
  updated_at: string
}
