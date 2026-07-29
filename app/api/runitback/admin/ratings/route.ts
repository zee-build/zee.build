import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { isAdminRequest } from '@/lib/runitback/adminAuth'
import { CURRENT_SEASON, RATING_ATTRIBUTES } from '@/lib/runitback/config'

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const [{ data: matchRatings, error: mErr }, { data: attributeRatings, error: aErr }, { data: players }, { data: matches }] =
    await Promise.all([
      supabase
        .from('match_ratings')
        .select('*')
        .eq('season', CURRENT_SEASON)
        .order('created_at', { ascending: false }),
      supabase
        .from('attribute_ratings')
        .select('*')
        .eq('season', CURRENT_SEASON)
        .order('created_at', { ascending: false }),
      supabase.from('players').select('id, name, nickname'),
      supabase.from('matches').select('id, date, day_of_week'),
    ])

  const error = mErr ?? aErr
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Attach each match rating's match date/day so the admin can see and sort
  // ratings by when the game was played (latest first).
  const matchById = new Map((matches ?? []).map((m) => [m.id, m]))
  const matchRatingsWithDate = (matchRatings ?? []).map((r) => {
    const m = matchById.get(r.match_id)
    return { ...r, match_date: m?.date ?? null, day_of_week: m?.day_of_week ?? null }
  })

  return NextResponse.json({
    season: CURRENT_SEASON,
    matchRatings: matchRatingsWithDate,
    attributeRatings: attributeRatings ?? [],
    players: players ?? [],
  })
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, type } = body

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid rating id.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (type === 'match') {
    const { score } = body
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > 10) {
      return NextResponse.json({ error: 'Rating must be a whole number between 1 and 10.' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('match_ratings')
      .update({ score })
      .eq('id', id)
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ rating: data })
  }

  // Attribute rating: validate all six 1-99, plus optional goalkeeping.
  const updates: Record<string, number | null> = {}
  for (const { key } of RATING_ATTRIBUTES) {
    const value = body[key]
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 99) {
      return NextResponse.json({ error: `${key} must be a whole number between 1 and 99.` }, { status: 400 })
    }
    updates[key] = value
  }
  if (body.goalkeeping !== undefined && body.goalkeeping !== null) {
    const gk = body.goalkeeping
    if (typeof gk !== 'number' || !Number.isInteger(gk) || gk < 1 || gk > 99) {
      return NextResponse.json({ error: 'goalkeeping must be a whole number between 1 and 99.' }, { status: 400 })
    }
    updates.goalkeeping = gk
  }

  const { data, error } = await supabase
    .from('attribute_ratings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rating: data })
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, type } = await req.json()

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid rating id.' }, { status: 400 })
  }

  const table = type === 'match' ? 'match_ratings' : 'attribute_ratings'
  const supabase = createServiceClient()
  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
