import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { hashPassword, setPendingCookie } from '@/lib/runitback/playerAuth'

const USERNAME_RE = /^[a-zA-Z0-9_.]{3,20}$/

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (typeof username !== 'string' || !USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: 'Username must be 3-20 characters (letters, numbers, _ or .).' },
      { status: 400 }
    )
  }
  if (typeof password !== 'string' || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .ilike('username', username)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'That username is taken.' }, { status: 409 })
  }

  const passwordHash = hashPassword(password)
  const res = NextResponse.json({ ok: true })
  setPendingCookie(res, username, passwordHash)
  return res
}
