import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import {
  CURRENT_SEASON,
  getNextWindow,
  getOpenWindow,
  windowLabel,
} from '@/lib/runitback/config'
import { buildPlayerStats, getPendingMatchRatings, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { AttributeRating, Match, MatchPlayer, MatchRating, Player } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [
    { data: players },
    { data: matches },
    { data: matchPlayers },
    { data: matchRatings },
    { data: attributeRatings },
  ] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('match_ratings').select('*').eq('season', CURRENT_SEASON).returns<MatchRating[]>(),
    supabase.from('attribute_ratings').select('*').eq('season', CURRENT_SEASON).returns<AttributeRating[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []
  const allMatchRatings = matchRatings ?? []
  const allAttributeRatings = attributeRatings ?? []

  const pendingMatches = getPendingMatchRatings(playerId, allMatches, allMatchPlayers, allPlayers, allMatchRatings)
  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers, allMatchRatings, allAttributeRatings)
  const statsById = new Map(stats.map((s) => [s.player.id, s]))

  const pending = pendingMatches.map(({ match, teammates }) => ({
    matchId: match.id,
    date: match.date,
    dayOfWeek: match.day_of_week,
    teammates: teammates
      .map((t) => {
        const teammateStats = statsById.get(t.player.id)
        return teammateStats ? { stats: teammateStats, playedPosition: t.playedPosition } : null
      })
      .filter(Boolean),
  }))

  // ── Attribute update window ────────────────────────────────────────
  const openWindow = getOpenWindow()
  const activeWindow = openWindow ?? getNextWindow()

  // The rater's own submissions for the active window, keyed by ratee.
  const mySubs = new Map(
    allAttributeRatings
      .filter((a) => a.rater_id === playerId && a.rating_window === activeWindow)
      .map((a) => [a.ratee_id, a])
  )

  // Everyone the player can rate (all registered squad members except self).
  const squad = stats
    .filter((s) => s.player.id !== playerId)
    .sort((a, b) => a.player.name.localeCompare(b.player.name))
    .map((s) => ({ stats: s, mySubmission: mySubs.get(s.player.id) ?? null }))

  return NextResponse.json({
    season: CURRENT_SEASON,
    pending,
    attributeWindow: {
      key: activeWindow,
      label: windowLabel(activeWindow),
      open: openWindow !== null,
    },
    squad,
  })
}

export async function POST(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: voter } = await supabase
    .from('players')
    .select('can_vote')
    .eq('id', playerId)
    .single<{ can_vote: boolean }>()
  if (voter?.can_vote === false) {
    return NextResponse.json({ error: 'Your voting rights have been suspended.' }, { status: 403 })
  }

  const body = await req.json()
  const { match_id, ratee_id, score } = body

  if (typeof match_id !== 'string' || !match_id) {
    return NextResponse.json({ error: 'Invalid match.' }, { status: 400 })
  }
  if (typeof ratee_id !== 'string' || ratee_id === playerId) {
    return NextResponse.json({ error: 'Invalid player.' }, { status: 400 })
  }
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > 10) {
    return NextResponse.json({ error: 'Rating must be a whole number between 1 and 10.' }, { status: 400 })
  }

  const { data: roster } = await supabase
    .from('match_players')
    .select('player_id')
    .eq('match_id', match_id)
    .returns<{ player_id: string }[]>()

  const rosterIds = new Set((roster ?? []).map((r) => r.player_id))
  if (!rosterIds.has(playerId) || !rosterIds.has(ratee_id)) {
    return NextResponse.json({ error: 'Both players must have played in this match.' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('match_ratings')
    .select('id')
    .eq('match_id', match_id)
    .eq('rater_id', playerId)
    .eq('ratee_id', ratee_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You already rated this player for this match.' }, { status: 409 })
  }

  const { error } = await supabase.from('match_ratings').insert({
    season: CURRENT_SEASON,
    match_id,
    rater_id: playerId,
    ratee_id,
    score,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
