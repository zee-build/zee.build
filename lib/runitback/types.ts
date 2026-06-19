export type Position = 'GK' | 'CB' | 'RB' | 'LB' | 'CM' | 'CAM' | 'ST' | 'LW' | 'RW'

export type PlayerRole = 'player' | 'mod' | 'admin'

export interface Player {
  id: string
  name: string
  nickname: string | null
  position: Position | string | null
  avatar_url: string | null
  is_regular: boolean
  registered_via_link: boolean
  username: string | null
  favorite_team: string | null
  country: string | null
  role: PlayerRole
  traits: string[]
  can_vote: boolean
  created_at: string
}

export type DayOfWeek = 'Friday' | 'Tuesday'

export interface Match {
  id: string
  date: string
  day_of_week: DayOfWeek
  location: string
  match_time: string | null
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
  played_position: string | null
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
  communityRating: number | null
  communityRatingCount: number
  attributeRatings: Record<RatingAttribute, number> | null
  gkRating: number | null
  awardsEligible: boolean
  seasonAward: 'toty' | 'hero' | null
  weeklyAward: 'potw' | null
}

export interface MatchWithPlayers extends Match {
  players: (MatchPlayer & { player: Player })[]
}

export interface PeerRating {
  id: string
  season: number
  match_id: string | null
  rater_id: string
  ratee_id: string
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  goalkeeping: number | null
  created_at: string
}

export type RatingAttribute = 'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'

export interface WeeklyTeamPlayer {
  id: string
  match_date: string
  team: Team
  player_id: string
  is_gk: boolean
  is_sub: boolean
  created_at: string
}

export interface LeagueSettings {
  id: string
  ratings_public: boolean
  voting_open: boolean
  updated_at: string
}

export type PlayerTier = 1 | 2 | 3

export interface MotmVote {
  id: string
  season: number
  match_id: string
  voter_id: string
  votee_id: string
  created_at: string
}
