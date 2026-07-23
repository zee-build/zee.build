import type { AttributeRating, Match, MatchPlayer, MatchRating, MatchResult, MatchWithPlayers, MotmVote, Player, PlayerStats, RatingAttribute } from './types'
import { CURRENT_SEASON, RATING_ATTRIBUTES, weightsForPosition } from './config'

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
  matchRatings: MatchRating[] = [],
  attributeRatings: AttributeRating[] = []
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
  const matchDateById = new Map(matches.map((m) => [m.id, m.date]))

  // ── Weekly match ratings (1-10) → recency-weighted "form" signal ──────
  // Recent scores should visibly move a player's card instead of being
  // drowned out by a season's worth of older votes — weight each rating by
  // how long ago its match was played, halving its influence every 21 days.
  const RATING_HALF_LIFE_DAYS = 21
  function matchRatingWeight(r: MatchRating): number {
    const dateStr = matchDateById.get(r.match_id) ?? r.created_at
    const ageDays = (now.getTime() - new Date(dateStr).getTime()) / 86_400_000
    return Math.pow(0.5, Math.max(0, ageDays) / RATING_HALF_LIFE_DAYS)
  }

  const matchRatingTotals = new Map<string, { sum: number; weight: number; rawCount: number }>()
  for (const r of matchRatings) {
    if (r.season !== CURRENT_SEASON) continue
    const w = matchRatingWeight(r)
    const entry = matchRatingTotals.get(r.ratee_id) ?? { sum: 0, weight: 0, rawCount: 0 }
    entry.sum += r.score * w
    entry.weight += w
    entry.rawCount += 1
    matchRatingTotals.set(r.ratee_id, entry)
  }

  // ── Bimonthly attribute ratings (1-99) → the FIFA card face ───────────
  // Each update window replaces the card, so a player's current attributes
  // are the average of every teammate's submission from the LATEST window
  // that player has any ratings in.
  const attrRowsByPlayer = new Map<string, AttributeRating[]>()
  for (const a of attributeRatings) {
    if (a.season !== CURRENT_SEASON) continue
    const list = attrRowsByPlayer.get(a.ratee_id) ?? []
    list.push(a)
    attrRowsByPlayer.set(a.ratee_id, list)
  }

  const attrByPlayer = new Map<
    string,
    { attrs: Record<RatingAttribute, number>; gk: number | null; count: number }
  >()
  for (const [playerId, rows] of attrRowsByPlayer) {
    const latestWindow = rows.reduce((mx, r) => (r.rating_window > mx ? r.rating_window : mx), '')
    const windowRows = rows.filter((r) => r.rating_window === latestWindow)
    if (windowRows.length === 0) continue

    const attrs = {} as Record<RatingAttribute, number>
    for (const { key } of RATING_ATTRIBUTES) {
      attrs[key] = windowRows.reduce((sum, r) => sum + r[key], 0) / windowRows.length
    }
    const gkVals = windowRows.map((r) => r.goalkeeping).filter((v): v is number => typeof v === 'number')
    const gk = gkVals.length > 0 ? gkVals.reduce((s, v) => s + v, 0) / gkVals.length : null

    attrByPlayer.set(playerId, { attrs, gk, count: windowRows.length })
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

    // ── Rating data (needed early for defender DEF anchor) ────────────
    // Match ratings drive the 1-10 "form" number; attribute ratings drive
    // the 1-99 FIFA attributes and the position-weighted card overall.
    const matchRatingEntry = matchRatingTotals.get(player.id)
    const communityRating = matchRatingEntry ? matchRatingEntry.sum / matchRatingEntry.weight : null
    const communityRatingCount = matchRatingEntry?.rawCount ?? 0

    const attrEntry = attrByPlayer.get(player.id)
    const attributeRaterCount = attrEntry?.count ?? 0

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

    // ── DEF attribute anchor (defenders only) ─────────────────────────
    // A defender's peer-rated DEF attribute (1-99) is a stable observation
    // that doesn't swing with match results, so it acts as a floor for
    // defenders whose value doesn't show up in goals/assists.
    const defPeerFactor = (isDefender && attrEntry)
      ? (attrEntry.attrs.defending - 1) / 98
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

    // Per-game rate factors (goals/assists/motm/win/clean sheets) are noisy on a
    // small sample — a single standout game shouldn't read the same as a proven
    // record. Discount the whole performance score (and the games-played term)
    // by expFactor so it only reaches full weight at 6+ games. The DEF peer
    // anchor is exempt — it's an independent observation, not a per-game rate,
    // so it keeps acting as a stable floor regardless of sample size.
    const performanceRaw =
      goalsFactor    * wGoals       +
      assistsFactor  * wAssists     +
      motmFactor     * wMotm        +
      winFactor      * wWins        +
      cleanSheetRate * wCleanSheets

    const raw = expFactor * (performanceRaw + wGames) + defPeerFactor * wDefPeer

    const statsOverall = games > 0 ? scaleOverall(raw) : 60

    // ── Attribute overall (position-weighted, 1-99) ───────────────────
    // Everyone shares the same six attributes, but a player's position
    // decides how much each counts — defending barely moves a striker,
    // shooting barely moves a defender. This is the EA-style card rating.
    let attributeOverall: number | null = null
    if (attrEntry) {
      const weights = weightsForPosition(pos)
      let wSum = 0
      let vSum = 0
      for (const { key } of RATING_ATTRIBUTES) {
        const w = weights[key] ?? 0
        if (w > 0) {
          vSum += attrEntry.attrs[key] * w
          wSum += w
        }
      }
      const gkW = weights.goalkeeping ?? 0
      if (gkW > 0 && attrEntry.gk !== null) {
        vSum += attrEntry.gk * gkW
        wSum += gkW
      }
      if (wSum > 0) attributeOverall = vSum / wSum
    }

    // ── Blend attributes with match performance ───────────────────────
    // Attributes ARE the card, so the more teammates who've rated a player
    // the more the overall leans on them; with few (or no) ratings, match
    // stats carry the card so thin samples don't skew it.
    //
    //  0 raters → 100% stats
    //  1 rater  →  67% stats / 33% attributes
    //  3 raters →  31% stats / 69% attributes
    //  5+ raters → 15% stats / 85% attributes  ← cap
    let overall = statsOverall
    if (attributeOverall !== null) {
      const attrWeight = Math.min(0.85, 0.15 + attributeRaterCount * 0.18)
      overall = statsOverall * (1 - attrWeight) + attributeOverall * attrWeight
    }

    // ── Form nudge from weekly match ratings ──────────────────────────
    // Between attribute windows, recent 1-10 scores gently push the card up
    // or down (±3 max) so hot and cold streaks are felt. 5.5/10 is neutral,
    // and the nudge scales in with how many scores back it (one game can't
    // swing a card).
    if (communityRating !== null && games > 0) {
      const rawNudge = Math.max(-3, Math.min(3, ((communityRating - 5.5) / 4.5) * 3))
      const formConfidence = Math.min(1, communityRatingCount / 4)
      overall += rawNudge * formConfidence
    }

    // 0-game players: peer opinion alone can't outrank people who've shown up.
    if (games === 0) overall = Math.min(overall, 75)

    overall = Math.round(Math.max(40, Math.min(99, overall)))

    // Award-eligible: must have played at least half of this season's played matches.
    const awardsEligible = playedMatches.length > 0 && games >= playedMatches.length * 0.5

    // Current streak: consecutive wins counting back from the most recent match.
    let streak = 0
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i] === 'W') streak += 1
      else break
    }

    const form = results.slice(-5)

    // Attribute values are already on the 1-99 scale from the update windows.
    let attributeRatings: Record<RatingAttribute, number> | null = null
    if (attrEntry) {
      attributeRatings = {} as Record<RatingAttribute, number>
      for (const { key } of RATING_ATTRIBUTES) {
        attributeRatings[key] = Math.round(attrEntry.attrs[key])
      }
    }

    const gkRating = attrEntry && attrEntry.gk !== null ? Math.round(attrEntry.gk) : null

    const hasPendingRatings =
      getPendingMatchRatings(player.id, matches, matchPlayers, players, matchRatings).length > 0

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
      attributeRaterCount,
      gkRating,
      awardsEligible,
      seasonAward: null as PlayerStats['seasonAward'],
      weeklyAward: null as PlayerStats['weeklyAward'],
      hasPendingRatings,
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
  matchRatings: MatchRating[]
): PendingMatchRating[] {
  const playerById = new Map(players.map((p) => [p.id, p]))
  const ratedPairs = new Set(
    matchRatings
      .filter((r) => r.rater_id === playerId)
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

export interface MotmTallyEntry {
  playerId: string
  votes: number
}

/** Vote counts per candidate for a match, most votes first. */
export function getMotmTally(matchId: string, votes: MotmVote[]): MotmTallyEntry[] {
  const counts = new Map<string, number>()
  for (const v of votes) {
    if (v.match_id !== matchId) continue
    counts.set(v.votee_id, (counts.get(v.votee_id) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([playerId, votes]) => ({ playerId, votes }))
    .sort((a, b) => b.votes - a.votes)
}

/**
 * Who the fan vote currently favors for a match. Returns null if nobody has
 * voted yet, or if the top spot is tied — a mod must resolve ties manually.
 */
export function getMotmLeader(matchId: string, votes: MotmVote[]): string | null {
  const tally = getMotmTally(matchId, votes)
  if (tally.length === 0) return null
  if (tally.length > 1 && tally[0].votes === tally[1].votes) return null
  return tally[0].playerId
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
