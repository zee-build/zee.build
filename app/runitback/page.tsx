import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats, getPendingMatchRatings, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import FifaMenuGrid from '@/components/runitback/FifaMenuGrid'
import WelcomeSplash from '@/components/runitback/WelcomeSplash'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Home',
  description: 'FIFA-style stats hub for the Friday & Tuesday five-a-side crew.',
}

export default async function RunItBackHome() {
  const supabase = createClient()
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').order('date', { ascending: false }).returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []
  const allRatings = ratings ?? []

  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers, allRatings)

  const topScorer = [...stats].sort((a, b) => b.goals - a.goals)[0] ?? null
  const topStreakStat = [...stats].sort((a, b) => b.streak - a.streak)[0] ?? null

  const lastMatch = allMatches[0] ?? null
  const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0)

  const me = playerId ? allPlayers.find((p) => p.id === playerId) ?? null : null
  const isMod = me?.role === 'mod' || me?.role === 'admin'

  const pendingCount = playerId
    ? getPendingMatchRatings(playerId, allMatches, allMatchPlayers, allPlayers, allRatings).reduce(
        (sum, p) => sum + p.teammates.length,
        0
      )
    : 0

  return (
    <>
    <WelcomeSplash />
    <FifaMenuGrid
      topScorer={topScorer && topScorer.goals > 0 ? topScorer : null}
      playerCount={allPlayers.length}
      matchCount={allMatches.length}
      lastResult={lastMatch ? { a: lastMatch.team_a_score, b: lastMatch.team_b_score } : null}
      topStreak={topStreakStat ? { player: topStreakStat } : null}
      totalGoals={totalGoals}
      pendingRatings={pendingCount}
      isMod={isMod}
    />
    </>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
