export type Position = 'GK' | 'CB' | 'RB' | 'LB' | 'CM' | 'CAM' | 'ST' | 'LW' | 'RW'

export interface Player {
  id: string
  name: string
  nickname: string | null
  position: Position | string | null
  avatar_url: string | null
  is_regular: boolean
  registered_via_link: boolean
  created_at: string
}

export type DayOfWeek = 'Friday' | 'Tuesday' | 'Other'

export interface Match {
  id: string
  date: string
  day_of_week: DayOfWeek
  location: string
  team_a_score: number
  team_b_score: number
  notes: string | null
  created_at: string
}

export type Team = 'A' | 'B'

export interface MatchPlayer {
  id: string
  match_id: string
  player_id: string
  team: Team
  goals: number
  assists: number
  is_motm: boolean
  created_at: string
}

export type MatchResult = 'W' | 'L' | 'D'

export interface PlayerStats {
  player: Player
  games: number
  goals: number
  assists: number
  motm: number
  wins: number
  losses: number
  draws: number
  winRate: number
  streak: number
  form: MatchResult[]
  overall: number
  goalsPerGame: number
}

export interface MatchWithPlayers extends Match {
  players: (MatchPlayer & { player: Player })[]
}
