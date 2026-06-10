import type { Match, MatchPlayer, MatchResult, MatchWithPlayers, Player, PlayerStats } from './types'

/** Determine a player's result (W/L/D) for a given match. */
function resultFor(mp: MatchPlayer, match: Match): MatchResult {
  const { team_a_score, team_b_score } = match
  if (team_a_score === team_b_score) return 'D'
  const teamAWon = team_a_score > team_b_score
  if ((mp.team === 'A' && teamAWon) || (mp.team === 'B' && !teamAWon)) return 'W'
  return 'L'
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
  matchPlayers: MatchPlayer[]
): PlayerStats[] {
  const matchById = new Map(matches.map((m) => [m.id, m]))
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const matchOrder = new Map(sortedMatches.map((m, i) => [m.id, i]))

  return players.map((player) => {
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
    const motmRate = games > 0 ? (motm / games) * 100 : 0
    const gamesFactor = Math.min((games / 20) * 100, 100)

    // Weighted blend of per-90-style metrics, normalized to 0-100, then scaled to 60-99.
    const raw =
      goalsPerGame * 30 + (motmRate / 100) * 25 + (winRate / 100) * 25 + (gamesFactor / 100) * 20
    const overall = games > 0 ? scaleOverall(raw) : 60

    // Current streak: consecutive wins counting back from the most recent match.
    let streak = 0
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i] === 'W') streak += 1
      else break
    }

    const form = results.slice(-5)

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
    }
  })
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
