import type { Metadata } from 'next'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import LeaderboardTabs from '@/components/runitback/LeaderboardTabs'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Leaderboard',
  description: 'Season rankings for goals, assists, MOTM, win rate, games and streaks.',
}

export default async function LeaderboardPage() {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
  ])

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [], ratings ?? [])

  return (
    <div className="rib-page">
      <h1 className="rib-heading text-3xl mb-6">LEADERBOARD</h1>
      <LeaderboardTabs stats={stats} totalMatches={(matches ?? []).length} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
