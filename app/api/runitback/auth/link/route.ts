import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { clearPendingCookie, readPendingCookie, setSessionCookie } from '@/lib/runitback/playerAuth'

export async function POST(req: NextRequest) {
  const pending = readPendingCookie(req)
  if (!pending) {
    return NextResponse.json(
      { error: 'Registration session expired. Please register again.' },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { player_id } = body
  if (typeof player_id !== 'string') {
    return NextResponse.json({ error: 'Missing player_id.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: target, error: fetchError } = await supabase
    .from('players')
    .select('id, password_hash')
    .eq('id', player_id)
    .maybeSingle()

  if (fetchError || !target) {
    return NextResponse.json({ error: 'Player not found.' }, { status: 404 })
  }
  if (target.password_hash) {
    return NextResponse.json({ error: 'That profile has already been claimed.' }, { status: 409 })
  }

  const { error } = await supabase
    .from('players')
    .update({ username: pending.username, password_hash: pending.passwordHash })
    .eq('id', player_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  clearPendingCookie(res)
  setSessionCookie(res, player_id)
  return res
}
