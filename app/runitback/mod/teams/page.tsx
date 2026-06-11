import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS, buildPlayerStats } from '@/lib/runitback/queries'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import TeamPickerPanel from '@/components/runitback/TeamPickerPanel'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Team Picker',
  robots: { index: false, follow: false },
}

export default async function TeamPickerPage() {
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  if (!playerId) {
    redirect('/runitback/login')
  }

  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).order('name').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
  ])

  const me = (players ?? []).find((p) => p.id === playerId)
  if (!me || (me.role !== 'mod' && me.role !== 'admin')) {
    redirect('/runitback')
  }

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [], ratings ?? [])

  return (
    <div className="rib-page max-w-5xl mx-auto">
      <h1 className="rib-heading text-3xl mb-6">TEAM PICKER</h1>
      <TeamPickerPanel stats={stats} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
