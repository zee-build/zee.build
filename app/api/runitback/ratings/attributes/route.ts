import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { readSession } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON, getOpenWindow, RATING_ATTRIBUTES } from '@/lib/runitback/config'

// Submit (or update) an attribute rating for the current update window.
// Only allowed while a window is open; one submission per rater per ratee
// per window, editable until the window closes.
export async function POST(req: NextRequest) {
  const playerId = readSession(req)
  if (!playerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const openWindow = getOpenWindow()
  if (!openWindow) {
    return NextResponse.json({ error: 'The ratings update window is closed.' }, { status: 403 })
  }

  const supabase = createServiceClient()
  const { data: voter } = await supabase
    .from('players')
    .select('can_vote')
    .eq('id', playerId)
    .single<{ can_vote: boolean }>()
  if (voter?.can_vote === false) {
    return NextResponse.json({ error: 'Your voting rights have been suspended.' }, { status: 403 })
  }

  const body = await req.json()
  const { ratee_id } = body

  if (typeof ratee_id !== 'string' || ratee_id === playerId) {
    return NextResponse.json({ error: 'Invalid player.' }, { status: 400 })
  }

  const attrs: Record<string, number> = {}
  for (const { key } of RATING_ATTRIBUTES) {
    const value = body[key]
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 99) {
      return NextResponse.json(
        { error: `${key} must be a whole number between 1 and 99.` },
        { status: 400 }
      )
    }
    attrs[key] = value
  }

  let goalkeeping: number | null = null
  if (body.goalkeeping !== undefined && body.goalkeeping !== null) {
    if (
      typeof body.goalkeeping !== 'number' ||
      !Number.isInteger(body.goalkeeping) ||
      body.goalkeeping < 1 ||
      body.goalkeeping > 99
    ) {
      return NextResponse.json({ error: 'goalkeeping must be a whole number between 1 and 99.' }, { status: 400 })
    }
    goalkeeping = body.goalkeeping
  }

  // Confirm the ratee exists.
  const { data: ratee } = await supabase
    .from('players')
    .select('id')
    .eq('id', ratee_id)
    .maybeSingle()
  if (!ratee) {
    return NextResponse.json({ error: 'Player not found.' }, { status: 400 })
  }

  const { error } = await supabase.from('attribute_ratings').upsert(
    {
      season: CURRENT_SEASON,
      rating_window: openWindow,
      rater_id: playerId,
      ratee_id,
      ...attrs,
      goalkeeping,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'rating_window,rater_id,ratee_id' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
