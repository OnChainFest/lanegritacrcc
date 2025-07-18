export interface TournamentEvent {
  id: number
  player_id: number
  player_name?: string
  event_type: string
  title: string
  description: string
  metadata: any
  created_at: string
}
