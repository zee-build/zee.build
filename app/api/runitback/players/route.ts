import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'
import { checkRateLimit } from '@/lib/runitback/rateLimit'
import { hashPassword } from '@/lib/runitback/playerAuth'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'

const VALID_POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,20}$/

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, nickname, position, is_regular, avatar_url, username, password } = body

  if (typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
  }

  if (position && !VALID_POSITIONS.includes(position)) {
    return NextResponse.json({ error: 'Invalid position.' }, { status: 400 })
  }

  const admin = isAdminRequest(req)

  // New joiners (non-admin) set up their login credentials at registration time.
  let passwordHash: string | null = null
  if (!admin) {
    if (typeof username !== 'string' || !USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters (letters, numbers, _ or .).' },
        { status: 400 }
      )
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }
    passwordHash = hashPassword(password)
  }

  // Public registration (via /runitback/join) is rate-limited per IP.
  if (!admin) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'You can only register once per hour. Try again later.' },
        { status: 429 }
      )
    }
  }

  // Use anon client for public registration (RLS allows insert when registered_via_link = true),
  // service role for admin-added players.
  const supabase = admin ? createServiceClient() : createClient()

  // Case-insensitive duplicate name check.
  const { data: existing } = await supabase
    .from('players')
    .select('id, name')
    .ilike('name', name.trim())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Someone with that name already joined!' }, { status: 409 })
  }

  if (!admin && username) {
    const { data: existingUsername } = await supabase
      .from('players')
      .select('id')
      .ilike('username', username)
      .maybeSingle()

    if (existingUsername) {
      return NextResponse.json({ error: 'That username is taken.' }, { status: 409 })
    }
  }

  const { data, error } = await supabase
    .from('players')
    .insert({
      name: name.trim(),
      nickname: nickname || null,
      position: position || null,
      is_regular: is_regular ?? true,
      avatar_url: avatar_url || null,
      registered_via_link: !admin,
      ...(passwordHash ? { username, password_hash: passwordHash } : {}),
    })
    .select(PUBLIC_PLAYER_COLUMNS)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ player: data }, { status: 201 })
}
