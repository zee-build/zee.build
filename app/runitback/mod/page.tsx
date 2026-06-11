import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS, buildMatchesWithPlayers } from '@/lib/runitback/queries'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import ModPanel from '@/components/runitback/ModPanel'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Mod',
  robots: { index: false, follow: false },
}

export default async function ModPage() {
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  if (!playerId) {
    redirect('/runitback/login')
  }

  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).order('name').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const me = (players ?? []).find((p) => p.id === playerId)
  if (!me || (me.role !== 'mod' && me.role !== 'admin')) {
    redirect('/runitback')
  }

  const matchesWithPlayers = buildMatchesWithPlayers(matches ?? [], matchPlayers ?? [], players ?? [])

  return (
    <div className="rib-page">
      <ModPanel players={players ?? []} matches={matchesWithPlayers} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
