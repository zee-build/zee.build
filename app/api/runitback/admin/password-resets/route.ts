import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'

interface ResetRow {
  id: string
  username: string
  player_id: string | null
  new_password_hash: string
  status: string
  created_at: string
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: requests, error } = await supabase
    .from('password_reset_requests')
    .select('id, username, player_id, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .returns<Omit<ResetRow, 'new_password_hash'>[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const playerIds = [...new Set((requests ?? []).map((r) => r.player_id).filter(Boolean))] as string[]
  const { data: players } = playerIds.length
    ? await supabase.from('players').select('id, name').in('id', playerIds)
    : { data: [] as { id: string; name: string }[] }
  const nameById = new Map((players ?? []).map((p) => [p.id, p.name]))

  const resets = (requests ?? []).map((r) => ({
    id: r.id,
    username: r.username,
    playerName: r.player_id ? nameById.get(r.player_id) ?? null : null,
    created_at: r.created_at,
  }))

  return NextResponse.json({ resets })
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, action } = await req.json()
  if (typeof id !== 'string' || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: request } = await supabase
    .from('password_reset_requests')
    .select('id, player_id, new_password_hash, status')
    .eq('id', id)
    .maybeSingle<ResetRow>()

  if (!request || request.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already handled.' }, { status: 404 })
  }

  if (action === 'approve') {
    if (!request.player_id) {
      return NextResponse.json({ error: 'Request has no linked player.' }, { status: 400 })
    }
    const { error: updErr } = await supabase
      .from('players')
      .update({ password_hash: request.new_password_hash })
      .eq('id', request.player_id)
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }
  }

  const { error } = await supabase
    .from('password_reset_requests')
    .update({ status: action === 'approve' ? 'approved' : 'rejected', resolved_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
