import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import { buildPlayerStats, getPendingMotmVotes, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { Match, MatchPlayer, MotmVote, PeerRating, Player } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }, { data: votes }] =
    await Promise.all([
      supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
      supabase.from('matches').select('*').returns<Match[]>(),
      supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
      supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
      supabase.from('motm_votes').select('*').eq('season', CURRENT_SEASON).returns<MotmVote[]>(),
    ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []
  const allRatings = ratings ?? []
  const allVotes = votes ?? []

  const pendingMatches = getPendingMotmVotes(playerId, allMatches, allMatchPlayers, allPlayers, allVotes)
  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers, allRatings)
  const statsById = new Map(stats.map((s) => [s.player.id, s]))

  const pending = pendingMatches.map(({ match, teammates }) => ({
    matchId: match.id,
    date: match.date,
    dayOfWeek: match.day_of_week,
    teammates: teammates.map((p) => statsById.get(p.id)).filter(Boolean),
  }))

  return NextResponse.json({ season: CURRENT_SEASON, pending })
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
  const { match_id, votee_id } = body

  if (typeof match_id !== 'string' || !match_id) {
    return NextResponse.json({ error: 'Invalid match.' }, { status: 400 })
  }
  if (typeof votee_id !== 'string' || votee_id === playerId) {
    return NextResponse.json({ error: 'You cannot vote for yourself.' }, { status: 400 })
  }

  const { data: roster } = await supabase
    .from('match_players')
    .select('player_id')
    .eq('match_id', match_id)
    .returns<{ player_id: string }[]>()

  const rosterIds = new Set((roster ?? []).map((r) => r.player_id))
  if (!rosterIds.has(playerId) || !rosterIds.has(votee_id)) {
    return NextResponse.json({ error: 'Both players must have played in this match.' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('motm_votes')
    .select('id')
    .eq('match_id', match_id)
    .eq('voter_id', playerId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You already voted for this match.' }, { status: 409 })
  }

  const { error } = await supabase.from('motm_votes').insert({
    season: CURRENT_SEASON,
    match_id,
    voter_id: playerId,
    votee_id,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You already voted for this match.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
