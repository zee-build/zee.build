import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('players')
    .select(PUBLIC_PLAYER_COLUMNS)
    .is('password_hash', null)
    .returns<Player[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ players: data ?? [] })
}
