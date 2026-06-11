import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON, RATING_ATTRIBUTES } from '@/lib/runitback/config'
import { buildPlayerStats, getPendingRatingTargets, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
  ])

  const myRatings = (ratings ?? []).filter((r) => r.rater_id === playerId)
  const targets = getPendingRatingTargets(playerId, players ?? [], myRatings)
  const targetIds = new Set(targets.map((p) => p.id))

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [], ratings ?? []).filter(
    (s) => targetIds.has(s.player.id)
  )

  return NextResponse.json({ season: CURRENT_SEASON, stats })
}

export async function POST(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { ratee_id } = body

  if (typeof ratee_id !== 'string' || ratee_id === playerId) {
    return NextResponse.json({ error: 'Invalid player.' }, { status: 400 })
  }

  const attrs: Record<string, number> = {}
  for (const { key } of RATING_ATTRIBUTES) {
    const value = body[key]
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 10) {
      return NextResponse.json(
        { error: `${key} must be a whole number between 1 and 10.` },
        { status: 400 }
      )
    }
    attrs[key] = value
  }

  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('peer_ratings')
    .select('id')
    .eq('season', CURRENT_SEASON)
    .eq('rater_id', playerId)
    .eq('ratee_id', ratee_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You already rated this player this season.' }, { status: 409 })
  }

  const { error } = await supabase.from('peer_ratings').insert({
    season: CURRENT_SEASON,
    rater_id: playerId,
    ratee_id,
    ...attrs,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
