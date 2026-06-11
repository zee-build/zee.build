import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'

const VALID_POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']
const VALID_ROLES = ['player', 'mod', 'admin']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const update: Record<string, unknown> = {}

  if (typeof body.name === 'string') {
    if (body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }
    update.name = body.name.trim()
  }
  if ('nickname' in body) update.nickname = body.nickname || null
  if ('position' in body) {
    if (body.position && !VALID_POSITIONS.includes(body.position)) {
      return NextResponse.json({ error: 'Invalid position.' }, { status: 400 })
    }
    update.position = body.position || null
  }
  if (typeof body.is_regular === 'boolean') update.is_regular = body.is_regular
  if ('avatar_url' in body) update.avatar_url = body.avatar_url || null
  if ('role' in body) {
    if (!VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
    }
    update.role = body.role
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('players')
    .update(update)
    .eq('id', id)
    .select(PUBLIC_PLAYER_COLUMNS)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ player: data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('players').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
