import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isModRequest } from '@/lib/runitback/adminAuth'
import type { WeeklyTeamPlayer } from '@/lib/runitback/types'

const VALID_TEAMS = ['A', 'B']

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('weekly_teams')
    .select('*')
    .eq('match_date', date)
    .returns<WeeklyTeamPlayer[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await isModRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { date, entries } = body

  if (typeof date !== 'string' || !date) {
    return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
  }
  if (!Array.isArray(entries)) {
    return NextResponse.json({ error: 'Entries must be an array.' }, { status: 400 })
  }
  for (const e of entries) {
    if (!e.player_id || !VALID_TEAMS.includes(e.team)) {
      return NextResponse.json({ error: 'Invalid entry.' }, { status: 400 })
    }
    if (e.is_sub !== undefined && typeof e.is_sub !== 'boolean') {
      return NextResponse.json({ error: 'Invalid is_sub value.' }, { status: 400 })
    }
  }

  const supabase = createServiceClient()

  const { error: deleteError } = await supabase.from('weekly_teams').delete().eq('match_date', date)
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (entries.length === 0) {
    return NextResponse.json({ ok: true })
  }

  const rows = entries.map((e: { player_id: string; team: string; is_gk?: boolean; is_sub?: boolean }) => ({
    match_date: date,
    player_id: e.player_id,
    team: e.team,
    is_gk: e.is_gk ?? false,
    is_sub: e.is_sub ?? false,
  }))

  const { error: insertError } = await supabase.from('weekly_teams').insert(rows)
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
