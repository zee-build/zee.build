import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import { getPendingRatingTargets, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { PeerRating, Player } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: players }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase
      .from('peer_ratings')
      .select('*')
      .eq('season', CURRENT_SEASON)
      .eq('rater_id', playerId)
      .returns<PeerRating[]>(),
  ])

  const targets = getPendingRatingTargets(playerId, players ?? [], ratings ?? [])

  return NextResponse.json({ season: CURRENT_SEASON, players: targets })
}

export async function POST(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { ratee_id, rating } = body

  if (typeof ratee_id !== 'string' || ratee_id === playerId) {
    return NextResponse.json({ error: 'Invalid player.' }, { status: 400 })
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 10) {
    return NextResponse.json({ error: 'Rating must be a whole number between 1 and 10.' }, { status: 400 })
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
    rating,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
