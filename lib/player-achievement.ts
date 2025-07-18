export interface PlayerAchievement {
  id: number
  player_id: number
  achievement_type: string
  title: string
  description: string
  value: number | null
  achieved_at: string
  series_id: number | null
  metadata: any
}
