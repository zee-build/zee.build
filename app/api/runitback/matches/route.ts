import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isModRequest } from '@/lib/runitback/adminAuth'

const VALID_DAYS = ['Friday', 'Tuesday']
const VALID_TEAMS = ['A', 'B']

export async function POST(req: NextRequest) {
  if (!(await isModRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { date, day_of_week, location, notes, team_a_score, team_b_score, players } = body

  if (typeof date !== 'string' || !date) {
    return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
  }
  if (!VALID_DAYS.includes(day_of_week)) {
    return NextResponse.json({ error: 'Invalid day of week.' }, { status: 400 })
  }
  if (!Array.isArray(players) || players.length === 0) {
    return NextResponse.json({ error: 'At least one player is required.' }, { status: 400 })
  }
  for (const p of players) {
    if (!p.player_id || !VALID_TEAMS.includes(p.team)) {
      return NextResponse.json({ error: 'Invalid player entry.' }, { status: 400 })
    }
  }

  const supabase = createServiceClient()

  const { match_time } = body
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      date,
      day_of_week,
      location: location || 'Sharjah',
      match_time: match_time || null,
      team_a_score: team_a_score ?? 0,
      team_b_score: team_b_score ?? 0,
      notes: notes || null,
    })
    .select()
    .single()

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 })
  }

  const rows = players.map((p: { player_id: string; team: string; goals?: number; assists?: number; is_motm?: boolean }) => ({
    match_id: match.id,
    player_id: p.player_id,
    team: p.team,
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    is_motm: p.is_motm ?? false,
  }))

  const { error: rosterError } = await supabase.from('match_players').insert(rows)

  if (rosterError) {
    // Roll back the match if roster insert fails.
    await supabase.from('matches').delete().eq('id', match.id)
    return NextResponse.json({ error: rosterError.message }, { status: 500 })
  }

  return NextResponse.json({ match }, { status: 201 })
}
