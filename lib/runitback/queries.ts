import type { Match, MatchPlayer, MatchResult, MatchWithPlayers, MotmVote, PeerRating, Player, PlayerStats, RatingAttribute } from './types'
import { CURRENT_SEASON, RATING_ATTRIBUTES } from './config'

/** Columns safe to return to the browser — excludes password_hash. */
export const PUBLIC_PLAYER_COLUMNS =
  'id, name, nickname, position, avatar_url, is_regular, registered_via_link, username, favorite_team, country, role, traits, can_vote, created_at'

/** Determine a player's result (W/L/D) for a given match. */
function resultFor(mp: MatchPlayer, match: Match): MatchResult {
  const { team_a_score, team_b_score } = match
  if (team_a_score === team_b_score) return 'D'
  const teamAWon = team_a_score > team_b_score
  if ((mp.team === 'A' && teamAWon) || (mp.team === 'B' && !teamAWon)) return 'W'
  return 'L'
}

/** Monday-of-week key (YYYY-MM-DD) for grouping matches into calendar weeks. */
function weekKey(dateStr: string): string {
  const d = new Date(dateStr)
  const day = (d.getUTCDay() + 6) % 7 // 0 = Monday ... 6 = Sunday
  d.setUTCDate(d.getUTCDate() - day)
  return d.toISOString().slice(0, 10)
}

/** Scale a 0-100-ish raw rating to the 60-99 FIFA card range. */
function scaleOverall(raw: number): number {
  const clamped = Math.max(0, Math.min(100, raw))
  return Math.round(60 + (clamped / 100) * 39)
}

/**
 * Build per-player aggregate stats from raw match/match_player rows.
 * Matches are sorted oldest -> newest to derive form and streak.
 */
export function buildPlayerStats(
  players: Player[],
  matches: Match[],
  matchPlayers: MatchPlayer[],
  ratings: PeerRating[] = []
): PlayerStats[] {
  // Only count matches that have already been played.
  // If a match has a kickoff time, compare the full datetime so a same-day
  // scheduled game isn't counted until after kickoff. Both sides of the
  // comparison must use the same timezone basis (UTC) — mixing
  // toISOString() (UTC) with Date.setHours() (server-local time) caused
  // newly logged matches to be silently excluded from stats.
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const playedMatches = matches.filter((m) => {
    if (m.date > todayStr) return false
    if (m.date === todayStr && m.match_time) {
      const [h, min] = m.match_time.split(':').map(Number)
      const kickoff = new Date(`${m.date}T00:00:00.000Z`)
      kickoff.setUTCHours(h, min, 0, 0)
      return now >= kickoff
    }
    return true
  })

  const matchById = new Map(playedMatches.map((m) => [m.id, m]))
  const sortedMatches = [...playedMatches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const matchOrder = new Map(sortedMatches.map((m, i) => [m.id, i]))

  // Average community rating (overall + per-attribute) per player for the current season.
  const ratingTotals = new Map<
    string,
    { sum: number; count: number; attrSum: Record<RatingAttribute, number> }
  >()
  const gkTotals = new Map<string, { sum: number; count: number }>()
  for (const r of ratings) {
    if (r.season !== CURRENT_SEASON) continue
    const avgAttr = (r.pace + r.shooting + r.passing + r.dribbling + r.defending + r.physical) / 6
    const entry = ratingTotals.get(r.ratee_id) ?? {
      sum: 0,
      count: 0,
      attrSum: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
    }
    entry.sum += avgAttr
    entry.count += 1
    for (const { key } of RATING_ATTRIBUTES) entry.attrSum[key] += r[key]
    ratingTotals.set(r.ratee_id, entry)

    if (typeof r.goalkeeping === 'number') {
      const gkEntry = gkTotals.get(r.ratee_id) ?? { sum: 0, count: 0 }
      gkEntry.sum += r.goalkeeping
      gkEntry.count += 1
      gkTotals.set(r.ratee_id, gkEntry)
    }
  }

  const stats = players.map((player) => {
    const entries = matchPlayers
      .filter((mp) => mp.player_id === player.id && matchById.has(mp.match_id))
      .sort((a, b) => (matchOrder.get(a.match_id) ?? 0) - (matchOrder.get(b.match_id) ?? 0))

    let goals = 0
    let assists = 0
    let motm = 0
    let wins = 0
    let losses = 0
    let draws = 0
    const results: MatchResult[] = []

    for (const mp of entries) {
      const match = matchById.get(mp.match_id)!
      goals += mp.goals
      assists += mp.assists
      if (mp.is_motm) motm += 1
      const result = resultFor(mp, match)
      results.push(result)
      if (result === 'W') wins += 1
      else if (result === 'L') losses += 1
      else draws += 1
    }

    const games = entries.length
    const winRate = games > 0 ? (wins / games) * 100 : 0
    const goalsPerGame = games > 0 ? goals / games : 0
    const assistsPerGame = games > 0 ? assists / games : 0
    const motmRate = games > 0 ? (motm / games) * 100 : 0

    // ── Peer rating data (needed early for defender DEF anchor) ──────
    const ratingEntry = ratingTotals.get(player.id)
    const communityRating = ratingEntry ? ratingEntry.sum / ratingEntry.count : null
    const communityRatingCount = ratingEntry?.count ?? 0

    // ── Position flags ────────────────────────────────────────────────
    const pos = player.position ?? ''
    const isDefender = ['GK', 'CB', 'RB', 'LB'].includes(pos)
    const isMidfielder = ['CM', 'CAM'].includes(pos)
    const isAttacker = ['ST', 'LW', 'RW'].includes(pos)

    // ── Clean sheets (defenders only) ─────────────────────────────────
    // A clean sheet = team conceded 0 in that match.
    let cleanSheets = 0
    for (const mp of entries) {
      const match = matchById.get(mp.match_id)!
      const conceded = mp.team === 'A' ? match.team_b_score : match.team_a_score
      if (conceded === 0) cleanSheets += 1
    }
    const cleanSheetRate = games > 0 ? cleanSheets / games : 0

    // ── DEF peer attribute anchor (defenders only) ────────────────────
    // Peer DEF ratings are permanent records — they don't fluctuate when
    // new matches are played, so they act as a stable floor for defenders.
    const defPeerFactor = (isDefender && ratingEntry && ratingEntry.count > 0)
      ? (ratingEntry.attrSum.defending / ratingEntry.count - 1) / 9
      : 0

    // ── Position-aware weights ────────────────────────────────────────
    // Defenders : wins + clean sheets + DEF peer anchor = primary metrics
    // Midfielders: goals ≈ assists, wins matter, playmaking rewarded
    // Attackers  : goals first, assists close (punishes selfishness)
    // No position: balanced across everything
    let wGoals: number, wAssists: number, wMotm: number, wWins: number, wGames: number
    let wCleanSheets: number, wDefPeer: number

    // Same benchmark for all positions — in 5-a-side a CM goal = a ST goal.
    const benchGoals = 0.5
    const benchAssists = 0.4

    if (isDefender) {
      // Wins alone ≠ good defending — clean sheet + DEF peer anchor are the real metrics
      wGoals = 8;  wAssists = 10; wMotm = 10; wWins = 15; wGames = 7
      wCleanSheets = 25; wDefPeer = 20
    } else if (isMidfielder) {
      wGoals = 32; wAssists = 30; wMotm = 16; wWins = 14; wGames = 8
      wCleanSheets = 0;  wDefPeer = 0
    } else if (isAttacker) {
      wGoals = 35; wAssists = 27; wMotm = 14; wWins = 16; wGames = 8
      wCleanSheets = 0;  wDefPeer = 0
    } else {
      wGoals = 30; wAssists = 26; wMotm = 16; wWins = 18; wGames = 10
      wCleanSheets = 0;  wDefPeer = 0
    }

    const goalsFactor   = benchGoals   > 0 ? Math.min(goalsPerGame   / benchGoals,   1.0) : 0
    const assistsFactor = benchAssists > 0 ? Math.min(assistsPerGame  / benchAssists, 1.0) : 0
    const motmFactor    = motmRate / 100
    const winFactor     = winRate  / 100
    // Full weight after 6 games — early season stays grounded.
    const expFactor     = Math.min(games / 6, 1.0)

    const raw =
      goalsFactor    * wGoals       +
      assistsFactor  * wAssists     +
      motmFactor     * wMotm        +
      winFactor      * wWins        +
      expFactor      * wGames       +
      cleanSheetRate * wCleanSheets +
      defPeerFactor  * wDefPeer

    const statsOverall = games > 0 ? scaleOverall(raw) : 60

    // ── Community blend ───────────────────────────────────────────────
    // Stats and community go hand in hand — 50/50 at 5+ votes.
    // With fewer votes, stats still dominate so thin samples don't skew.
    //
    //  0 votes → 100% stats
    //  1 vote  →  90% stats / 10% community
    //  3 votes →  70% stats / 30% community
    //  5 votes →  50% stats / 50% community  ← cap
    //
    // 0-game players: show community rating only (capped at 75).
    let overall = statsOverall
    if (communityRating !== null) {
      const communityOverall = 60 + ((communityRating - 1) / 9) * 39
      if (games === 0) {
        overall = Math.round(Math.min(communityOverall, 75))
      } else {
        const weight = Math.min(0.70, communityRatingCount * 0.14)
        overall = Math.round(statsOverall * (1 - weight) + communityOverall * weight)
      }
    }

    // Award-eligible: must have played at least half of this season's played matches.
    const awardsEligible = playedMatches.length > 0 && games >= playedMatches.length * 0.5

    // Current streak: consecutive wins counting back from the most recent match.
    let streak = 0
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i] === 'W') streak += 1
      else break
    }

    const form = results.slice(-5)

    let attributeRatings: Record<RatingAttribute, number> | null = null
    if (ratingEntry) {
      attributeRatings = {} as Record<RatingAttribute, number>
      for (const { key } of RATING_ATTRIBUTES) {
        const avg = ratingEntry.attrSum[key] / ratingEntry.count
        attributeRatings[key] = Math.round(60 + ((avg - 1) / 9) * 39)
      }
    }

    const gkEntry = gkTotals.get(player.id)
    const gkRating = gkEntry && gkEntry.count > 0
      ? Math.round(60 + ((gkEntry.sum / gkEntry.count - 1) / 9) * 39)
      : null

    return {
      player,
      games,
      goals,
      assists,
      motm,
      wins,
      losses,
      draws,
      winRate,
      streak,
      form,
      overall,
      goalsPerGame,
      communityRating,
      communityRatingCount,
      attributeRatings,
      gkRating,
      awardsEligible,
      seasonAward: null as PlayerStats['seasonAward'],
      weeklyAward: null as PlayerStats['weeklyAward'],
    }
  })

  // Assign one-of-a-kind season award cards: TOTY (Team of the Year) goes to
  // the player with the highest overall this season, Hero goes to the top
  // scorer (a different player, if there is one). Only players who've played
  // at least half of this season's matches are eligible.
  const eligible = stats.filter((s) => s.awardsEligible)
  if (eligible.length > 0) {
    const topOverall = eligible.reduce((best, s) => (s.overall > best.overall ? s : best))
    topOverall.seasonAward = 'toty'

    const scorers = eligible.filter((s) => s.goals > 0 && s.player.id !== topOverall.player.id)
    if (scorers.length > 0) {
      const topScorer = scorers.reduce((best, s) => (s.goals > best.goals ? s : best))
      topScorer.seasonAward = 'hero'
    }
  }

  // Player of the Week: best individual performance in the most recently
  // played calendar week (Mon-Sun), scored by goals/assists/MOTM/result.
  if (playedMatches.length > 0) {
    const latestWeek = playedMatches.reduce(
      (latest, m) => (weekKey(m.date) > latest ? weekKey(m.date) : latest),
      ''
    )
    const weekMatchIds = new Set(
      playedMatches.filter((m) => weekKey(m.date) === latestWeek).map((m) => m.id)
    )

    const weeklyScores = new Map<string, number>()
    for (const mp of matchPlayers) {
      if (!weekMatchIds.has(mp.match_id)) continue
      const match = matchById.get(mp.match_id)
      if (!match) continue
      const result = resultFor(mp, match)
      const score =
        mp.goals * 3 +
        mp.assists * 2 +
        (mp.is_motm ? 5 : 0) +
        (result === 'W' ? 3 : result === 'D' ? 1 : 0)
      weeklyScores.set(mp.player_id, (weeklyScores.get(mp.player_id) ?? 0) + score)
    }

    let bestPlayerId: string | null = null
    let bestScore = 0
    for (const [playerId, score] of weeklyScores) {
      if (score > bestScore) {
        bestScore = score
        bestPlayerId = playerId
      }
    }

    if (bestPlayerId) {
      const winner = stats.find((s) => s.player.id === bestPlayerId)
      if (winner) winner.weeklyAward = 'potw'
    }
  }

  return stats
}

export interface PendingMatchRating {
  match: Match
  teammates: { player: Player; playedPosition: string | null }[]
}

/**
 * For each match `playerId` played in, the other players from that match
 * they haven't rated yet. Only matches from the current season are considered.
 */
export function getPendingMatchRatings(
  playerId: string,
  matches: Match[],
  matchPlayers: MatchPlayer[],
  players: Player[],
  ratings: PeerRating[]
): PendingMatchRating[] {
  const playerById = new Map(players.map((p) => [p.id, p]))
  const ratedPairs = new Set(
    ratings
      .filter((r) => r.rater_id === playerId && r.match_id)
      .map((r) => `${r.match_id}:${r.ratee_id}`)
  )

  // Only open rating for matches in the last 7 days; exclude future/unplayed matches.
  const ratingNow = new Date()
  const ratingTodayStr = ratingNow.toISOString().slice(0, 10)
  const cutoff = new Date()
  cutoff.setUTCDate(cutoff.getUTCDate() - 7)

  const pending: PendingMatchRating[] = []
  for (const match of matches) {
    if (new Date(match.date).getFullYear() !== CURRENT_SEASON) continue
    if (match.date > ratingTodayStr) continue
    if (match.date === ratingTodayStr && match.match_time) {
      const [h, min] = match.match_time.split(':').map(Number)
      const kickoff = new Date(`${match.date}T00:00:00.000Z`)
      kickoff.setUTCHours(h, min, 0, 0)
      if (ratingNow < kickoff) continue
    }
    if (new Date(match.date) < cutoff) continue
    const roster = matchPlayers.filter((mp) => mp.match_id === match.id)
    const playedInMatch = roster.some((mp) => mp.player_id === playerId)
    if (!playedInMatch) continue

    const teammates = roster
      .filter((mp) => mp.player_id !== playerId && !ratedPairs.has(`${match.id}:${mp.player_id}`))
      .map((mp) => {
        const player = playerById.get(mp.player_id)
        return player ? { player, playedPosition: mp.played_position } : null
      })
      .filter((t): t is { player: Player; playedPosition: string | null } => Boolean(t))

    if (teammates.length > 0) pending.push({ match, teammates })
  }

  return pending.sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
}

export interface PendingMotmVote {
  match: Match
  teammates: Player[]
}

/**
 * Matches `playerId` played in (current season, last 7 days) for which they
 * haven't yet cast their one MOTM vote. Excludes themselves from the
 * votable teammate list.
 */
export function getPendingMotmVotes(
  playerId: string,
  matches: Match[],
  matchPlayers: MatchPlayer[],
  players: Player[],
  votes: MotmVote[]
): PendingMotmVote[] {
  const playerById = new Map(players.map((p) => [p.id, p]))
  const votedMatchIds = new Set(votes.filter((v) => v.voter_id === playerId).map((v) => v.match_id))

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const cutoff = new Date()
  cutoff.setUTCDate(cutoff.getUTCDate() - 7)

  const pending: PendingMotmVote[] = []
  for (const match of matches) {
    if (new Date(match.date).getFullYear() !== CURRENT_SEASON) continue
    if (match.date > todayStr) continue
    if (match.date === todayStr && match.match_time) {
      const [h, min] = match.match_time.split(':').map(Number)
      const kickoff = new Date(`${match.date}T00:00:00.000Z`)
      kickoff.setUTCHours(h, min, 0, 0)
      if (now < kickoff) continue
    }
    if (new Date(match.date) < cutoff) continue
    if (votedMatchIds.has(match.id)) continue

    const roster = matchPlayers.filter((mp) => mp.match_id === match.id)
    const playedInMatch = roster.some((mp) => mp.player_id === playerId)
    if (!playedInMatch) continue

    const teammates = roster
      .filter((mp) => mp.player_id !== playerId)
      .map((mp) => playerById.get(mp.player_id))
      .filter((p): p is Player => Boolean(p))

    if (teammates.length > 0) pending.push({ match, teammates })
  }

  return pending.sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
}

/** Pull together matches with their roster of players for display. */
export function buildMatchesWithPlayers(
  matches: Match[],
  matchPlayers: MatchPlayer[],
  players: Player[]
): MatchWithPlayers[] {
  const playerById = new Map(players.map((p) => [p.id, p]))

  return matches
    .map((match) => ({
      ...match,
      players: matchPlayers
        .filter((mp) => mp.match_id === match.id && playerById.has(mp.player_id))
        .map((mp) => ({ ...mp, player: playerById.get(mp.player_id)! })),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function tierForRating(overall: number): 'gold' | 'silver' | 'bronze' {
  if (overall >= 85) return 'gold'
  if (overall >= 75) return 'silver'
  return 'bronze'
}

/** Head-to-head W/L/D record for one player against every other regular. */
export function buildHeadToHead(
  playerId: string,
  players: Player[],
  matches: Match[],
  matchPlayers: MatchPlayer[]
) {
  const matchById = new Map(matches.map((m) => [m.id, m]))
  const myEntries = matchPlayers.filter((mp) => mp.player_id === playerId)

  const records = new Map<string, { wins: number; losses: number; draws: number }>()

  for (const mine of myEntries) {
    const match = matchById.get(mine.match_id)
    if (!match) continue
    const myResult = resultFor(mine, match)

    const opponents = matchPlayers.filter(
      (mp) => mp.match_id === mine.match_id && mp.player_id !== playerId && mp.team !== mine.team
    )

    for (const opp of opponents) {
      const opponentPlayer = players.find((p) => p.id === opp.player_id)
      if (!opponentPlayer || !opponentPlayer.is_regular) continue

      if (!records.has(opp.player_id)) {
        records.set(opp.player_id, { wins: 0, losses: 0, draws: 0 })
      }
      const rec = records.get(opp.player_id)!
      if (myResult === 'W') rec.wins += 1
      else if (myResult === 'L') rec.losses += 1
      else rec.draws += 1
    }
  }

  return Array.from(records.entries())
    .map(([playerId, record]) => ({
      player: players.find((p) => p.id === playerId)!,
      ...record,
    }))
    .filter((r) => r.player)
    .sort((a, b) => a.player.name.localeCompare(b.player.name))
}
