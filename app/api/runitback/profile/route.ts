import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { getClub } from '@/lib/runitback/config'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'

const VALID_POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']

export async function PATCH(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const update: Record<string, unknown> = {}

  if ('nickname' in body) update.nickname = body.nickname || null
  if ('position' in body) {
    if (body.position && !VALID_POSITIONS.includes(body.position)) {
      return NextResponse.json({ error: 'Invalid position.' }, { status: 400 })
    }
    update.position = body.position || null
  }
  if ('avatar_url' in body) update.avatar_url = body.avatar_url || null
  if ('favorite_team' in body) {
    if (body.favorite_team && !getClub(body.favorite_team)) {
      return NextResponse.json({ error: 'Invalid club.' }, { status: 400 })
    }
    update.favorite_team = body.favorite_team || null
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('players')
    .update(update)
    .eq('id', playerId)
    .select(PUBLIC_PLAYER_COLUMNS)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ player: data })
}
