import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import PlayersGrid from '@/components/runitback/PlayersGrid'
import type { LeagueSettings, Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Players',
  description: 'Full FIFA-style roster of every player in the squad.',
}

export default async function PlayersPage() {
  const supabase = createClient()
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }, { data: settingsRow }] =
    await Promise.all([
      supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
      supabase.from('matches').select('*').returns<Match[]>(),
      supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
      supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
      supabase.from('league_settings').select('ratings_public').eq('id', 'global').single<Pick<LeagueSettings, 'ratings_public'>>(),
    ])

  const me = (players ?? []).find((p) => p.id === playerId)
  const isMod = me?.role === 'mod' || me?.role === 'admin'
  const ratingsPublic = settingsRow?.ratings_public ?? true
  const showRatings = isMod || ratingsPublic

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [], ratings ?? [])

  return (
    <div className="rib-page">
      <h1 className="rib-heading text-3xl mb-6">PLAYERS</h1>
      <PlayersGrid stats={stats} showRatings={showRatings} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
