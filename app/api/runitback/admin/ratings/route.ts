import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: ratings, error }, { data: players }] = await Promise.all([
    supabase
      .from('peer_ratings')
      .select('*')
      .eq('season', CURRENT_SEASON)
      .order('created_at', { ascending: false }),
    supabase.from('players').select('id, name, nickname'),
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ season: CURRENT_SEASON, ratings: ratings ?? [], players: players ?? [] })
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, rating } = await req.json()

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid rating id.' }, { status: 400 })
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 10) {
    return NextResponse.json({ error: 'Rating must be a whole number between 1 and 10.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('peer_ratings')
    .update({ rating })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rating: data })
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid rating id.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('peer_ratings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
