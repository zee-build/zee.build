import type { Match, MatchPlayer, MatchResult, MatchWithPlayers, PeerRating, Player, PlayerStats, RatingAttribute } from './types'
import { CURRENT_SEASON, RATING_ATTRIBUTES } from './config'

/** Columns safe to return to the browser — excludes password_hash. */
export const PUBLIC_PLAYER_COLUMNS =
  'id, name, nickname, position, avatar_url, is_regular, registered_via_link, username, favorite_team, country, created_at'

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
  const matchById = new Map(matches.map((m) => [m.id, m]))
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const matchOrder = new Map(sortedMatches.map((m, i) => [m.id, i]))

  // Average community rating (overall + per-attribute) per player for the current season.
  const ratingTotals = new Map<
    string,
    { sum: number; count: number; attrSum: Record<RatingAttribute, number> }
  >()
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
    const gamesFactor = Math.min((games / 20) * 100, 100)

    // Weighted blend of per-90-style metrics, normalized to 0-100, then scaled to 60-99.
    // Goals and assists carry equal weight so passers are rewarded as much as scorers.
    const raw =
      goalsPerGame * 15 +
      assistsPerGame * 15 +
      (motmRate / 100) * 25 +
      (winRate / 100) * 25 +
      (gamesFactor / 100) * 20
    const statsOverall = games > 0 ? scaleOverall(raw) : 60

    // Blend in the squad's community rating (1-10 -> 60-99 scale), weighted
    // by how many teammates have rated this player (caps at 40%).
    const ratingEntry = ratingTotals.get(player.id)
    const communityRating = ratingEntry ? ratingEntry.sum / ratingEntry.count : null
    const communityRatingCount = ratingEntry?.count ?? 0
    let overall = statsOverall
    if (communityRating !== null) {
      const communityOverall = 60 + ((communityRating - 1) / 9) * 39
      if (games === 0) {
        // Players who haven't played this season are capped — peer opinion
        // alone can't carry someone past a regular who's shown up.
        overall = Math.round(Math.min(communityOverall, 70))
      } else {
        const weight = Math.min(0.8, 0.3 + communityRatingCount * 0.15)
        overall = Math.round(statsOverall * (1 - weight) + communityOverall * weight)
      }
    }

    // Award-eligible: must have played at least half of this season's matches.
    const awardsEligible = matches.length > 0 && games >= matches.length * 0.5

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
  if (matches.length > 0) {
    const latestWeek = matches.reduce(
      (latest, m) => (weekKey(m.date) > latest ? weekKey(m.date) : latest),
      ''
    )
    const weekMatchIds = new Set(
      matches.filter((m) => weekKey(m.date) === latestWeek).map((m) => m.id)
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

/** Players (excluding self) that `playerId` hasn't rated yet this season. */
export function getPendingRatingTargets(
  playerId: string,
  players: Player[],
  ratings: PeerRating[]
): Player[] {
  const ratedIds = new Set(
    ratings
      .filter((r) => r.season === CURRENT_SEASON && r.rater_id === playerId)
      .map((r) => r.ratee_id)
  )
  return players.filter((p) => p.id !== playerId && !ratedIds.has(p.id))
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
