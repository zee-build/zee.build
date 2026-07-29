import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'
import { hashPassword } from '@/lib/runitback/playerAuth'

// A player who forgot their password submits their username and a NEW
// password here. Nothing changes yet — it creates a pending request that a
// mod/admin approves (after checking the person is who they say). This keeps
// resets self-serve without needing email, while a human still verifies.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (typeof username !== 'string' || username.trim().length === 0) {
    return NextResponse.json({ error: 'Username required.' }, { status: 400 })
  }
  if (typeof password !== 'string' || password.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .ilike('username', username.trim())
    .maybeSingle<{ id: string }>()

  // Only create a request if the username exists — but always return the same
  // response so we don't reveal which usernames are registered.
  if (player) {
    // Keep just one pending request per player: clear old pending ones first.
    await supabase
      .from('password_reset_requests')
      .delete()
      .eq('player_id', player.id)
      .eq('status', 'pending')

    const { error } = await supabase.from('password_reset_requests').insert({
      username: username.trim(),
      player_id: player.id,
      new_password_hash: hashPassword(password),
      status: 'pending',
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
