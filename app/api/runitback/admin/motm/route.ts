import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isModRequest } from '@/lib/runitback/adminAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import { getMotmTally, getMotmLeader } from '@/lib/runitback/queries'
import type { MotmVote } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  if (!(await isModRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: votes, error }, { data: players }] = await Promise.all([
    supabase
      .from('motm_votes')
      .select('*')
      .eq('season', CURRENT_SEASON)
      .order('created_at', { ascending: false })
      .returns<MotmVote[]>(),
    supabase.from('players').select('id, name, nickname'),
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const allVotes = votes ?? []
  const matchIds = Array.from(new Set(allVotes.map((v) => v.match_id)))
  const tallies = Object.fromEntries(
    matchIds.map((matchId) => [matchId, getMotmTally(matchId, allVotes)])
  )
  const leaders = Object.fromEntries(matchIds.map((matchId) => [matchId, getMotmLeader(matchId, allVotes)]))

  return NextResponse.json({
    season: CURRENT_SEASON,
    votes: allVotes,
    players: players ?? [],
    tallies,
    leaders,
  })
}

/** Mod approval: award MOTM to whoever leads the vote for a match. */
export async function POST(req: NextRequest) {
  if (!(await isModRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { match_id } = await req.json()
  if (typeof match_id !== 'string' || !match_id) {
    return NextResponse.json({ error: 'Invalid match.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: votes, error: votesError } = await supabase
    .from('motm_votes')
    .select('*')
    .eq('match_id', match_id)
    .returns<MotmVote[]>()

  if (votesError) {
    return NextResponse.json({ error: votesError.message }, { status: 500 })
  }

  const winnerId = getMotmLeader(match_id, votes ?? [])
  if (!winnerId) {
    return NextResponse.json({ error: 'No clear winner — resolve the tie manually before approving.' }, { status: 409 })
  }

  const { error: clearError } = await supabase
    .from('match_players')
    .update({ is_motm: false })
    .eq('match_id', match_id)
  if (clearError) {
    return NextResponse.json({ error: clearError.message }, { status: 500 })
  }

  const { error: setError } = await supabase
    .from('match_players')
    .update({ is_motm: true })
    .eq('match_id', match_id)
    .eq('player_id', winnerId)
  if (setError) {
    return NextResponse.json({ error: setError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, winnerId })
}
