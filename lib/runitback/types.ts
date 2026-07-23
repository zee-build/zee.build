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
  /** Averaged 1-99 attribute values from bimonthly update windows. */
  attributeRatings: Record<RatingAttribute, number> | null
  /** Number of teammates whose attribute submissions feed attributeRatings. */
  attributeRaterCount: number
  gkRating: number | null
  awardsEligible: boolean
  seasonAward: 'toty' | 'hero' | null
  weeklyAward: 'potw' | null
  /** True if this player still owes ratings for a match within the last 7 days. */
  hasPendingRatings: boolean
}

export interface MatchWithPlayers extends Match {
  players: (MatchPlayer & { player: Player })[]
}

/** Legacy per-match 6-attribute rating (archived — the app no longer writes these). */
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

/** One quick 1-10 "how did they play" score per teammate per match. */
export interface MatchRating {
  id: string
  season: number
  match_id: string
  rater_id: string
  ratee_id: string
  score: number
  created_at: string
}

/**
 * Bimonthly EA-style attribute update (1-99), submitted once per rater per
 * ratee per rating window (Jan/Mar/May/Jul/Sep/Nov, keyed 'YYYY-MM').
 */
export interface AttributeRating {
  id: string
  season: number
  rating_window: string
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
  updated_at: string
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
