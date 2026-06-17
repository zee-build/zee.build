import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isModRequest } from '@/lib/runitback/adminAuth'
import type { LeagueSettings } from '@/lib/runitback/types'

const DEFAULTS: Omit<LeagueSettings, 'id' | 'updated_at'> = {
  ratings_public: true,
  voting_open: true,
}

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('league_settings')
    .select('*')
    .eq('id', 'global')
    .single<LeagueSettings>()

  if (error || !data) {
    return NextResponse.json({ ...DEFAULTS, id: 'global', updated_at: new Date().toISOString() })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!(await isModRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const patch: Partial<Omit<LeagueSettings, 'id' | 'updated_at'>> = {}

  if (typeof body.ratings_public === 'boolean') patch.ratings_public = body.ratings_public
  if (typeof body.voting_open === 'boolean') patch.voting_open = body.voting_open

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('league_settings')
    .upsert({ id: 'global', ...patch, updated_at: new Date().toISOString() })
    .select()
    .single<LeagueSettings>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
