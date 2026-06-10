import type { Metadata } from 'next'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats } from '@/lib/runitback/queries'
import FifaMenuGrid from '@/components/runitback/FifaMenuGrid'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Home',
  description: 'FIFA-style stats hub for the Friday & Tuesday five-a-side crew at Muweilah.',
}

export default async function RunItBackHome() {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select('*').returns<Player[]>(),
    supabase.from('matches').select('*').order('date', { ascending: false }).returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []

  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers)

  const topScorer = [...stats].sort((a, b) => b.goals - a.goals)[0] ?? null
  const topStreakStat = [...stats].sort((a, b) => b.streak - a.streak)[0] ?? null

  const lastMatch = allMatches[0] ?? null
  const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0)

  return (
    <FifaMenuGrid
      topScorer={topScorer && topScorer.goals > 0 ? topScorer : null}
      playerCount={allPlayers.length}
      matchCount={allMatches.length}
      lastResult={lastMatch ? { a: lastMatch.team_a_score, b: lastMatch.team_b_score } : null}
      topStreak={topStreakStat ? { player: topStreakStat } : null}
      totalGoals={totalGoals}
    />
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
