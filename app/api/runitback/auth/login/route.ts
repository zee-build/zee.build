import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { setSessionCookie, verifyPassword } from '@/lib/runitback/playerAuth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Username and password required.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: player } = await supabase
    .from('players')
    .select('id, password_hash')
    .ilike('username', username)
    .maybeSingle()

  if (!player || !player.password_hash || !verifyPassword(password, player.password_hash)) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  setSessionCookie(res, player.id)
  return res
}
