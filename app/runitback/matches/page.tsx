import type { Metadata } from 'next'
import { createClient } from '@/lib/runitback/supabase'
import { buildMatchesWithPlayers } from '@/lib/runitback/queries'
import MatchesTimeline from '@/components/runitback/MatchesTimeline'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Matches',
  description: 'Match history timeline with results and scorelines.',
}

export default async function MatchesPage() {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select('*').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const matchesWithPlayers = buildMatchesWithPlayers(matches ?? [], matchPlayers ?? [], players ?? [])

  return (
    <div>
      <h1 className="rib-heading text-3xl mb-6">MATCHES</h1>
      <MatchesTimeline matches={matchesWithPlayers} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
