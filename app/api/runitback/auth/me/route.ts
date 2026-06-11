import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

export async function GET(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ player: null })
  }

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('players')
    .select(PUBLIC_PLAYER_COLUMNS)
    .eq('id', playerId)
    .maybeSingle()
    .returns<Player>()

  return NextResponse.json({ player: data ?? null })
}
