import type { Metadata } from 'next'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats } from '@/lib/runitback/queries'
import PlayersGrid from '@/components/runitback/PlayersGrid'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Players',
  description: 'Full FIFA-style roster of every player in the squad.',
}

export default async function PlayersPage() {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select('*').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [])

  return (
    <div>
      <h1 className="rib-heading text-3xl mb-6">PLAYERS</h1>
      <PlayersGrid stats={stats} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
