import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'
import { checkRateLimit } from '@/lib/runitback/rateLimit'

const VALID_POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, nickname, position, is_regular, avatar_url } = body

  if (typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
  }

  if (position && !VALID_POSITIONS.includes(position)) {
    return NextResponse.json({ error: 'Invalid position.' }, { status: 400 })
  }

  const admin = isAdminRequest(req)

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

  const { data, error } = await supabase
    .from('players')
    .insert({
      name: name.trim(),
      nickname: nickname || null,
      position: position || null,
      is_regular: is_regular ?? true,
      avatar_url: avatar_url || null,
      registered_via_link: !admin,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ player: data }, { status: 201 })
}
