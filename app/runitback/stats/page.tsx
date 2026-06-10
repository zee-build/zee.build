import type { Metadata } from 'next'
import { Flame } from 'lucide-react'
import { createClient } from '@/lib/runitback/supabase'
import { buildPlayerStats } from '@/lib/runitback/queries'
import { GoalsOverTimeChart, GoalsPerPlayerChart, WinRateChart } from '@/components/runitback/StatsCharts'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Stats',
  description: 'Deep dive numbers: goals over time, leaders, biggest results and hat-tricks.',
}

export default async function StatsPage() {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select('*').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []
  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers)

  const sortedMatches = [...allMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const goalsOverTime = sortedMatches.map((m) => ({
    label: new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    value: m.team_a_score + m.team_b_score,
  }))

  const goalsPerPlayer = [...stats]
    .filter((s) => s.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)
    .map((s) => ({ label: s.player.name, value: s.goals }))

  const winRateData = [...stats]
    .filter((s) => s.games > 0)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 10)
    .map((s) => ({ label: s.player.name, value: Math.round(s.winRate) }))

  const highestScoring = [...allMatches].sort(
    (a, b) => b.team_a_score + b.team_b_score - (a.team_a_score + a.team_b_score)
  )[0]

  const biggestWin = [...allMatches].sort(
    (a, b) => Math.abs(b.team_a_score - b.team_b_score) - Math.abs(a.team_a_score - a.team_b_score)
  )[0]

  const mostActive = [...stats].sort((a, b) => b.games - a.games)[0]

  const playerById = new Map(allPlayers.map((p) => [p.id, p]))
  const matchById = new Map(allMatches.map((m) => [m.id, m]))
  const hatTricks = allMatchPlayers
    .filter((mp) => mp.goals >= 3)
    .map((mp) => ({
      player: playerById.get(mp.player_id),
      match: matchById.get(mp.match_id),
      goals: mp.goals,
    }))
    .filter((h) => h.player && h.match)
    .sort((a, b) => new Date(b.match!.date).getTime() - new Date(a.match!.date).getTime())

  return (
    <div className="space-y-8">
      <h1 className="rib-heading text-3xl">STATS</h1>

      {allMatches.length === 0 ? (
        <div className="rib-tile rounded-xl p-12 text-center">
          <p className="rib-heading text-xl mb-2">NO DATA YET</p>
          <p className="rib-body text-sm">Stats will appear once matches are logged.</p>
        </div>
      ) : (
        <>
          <div className="rib-tile rounded-lg p-5">
            <h2 className="rib-heading text-lg mb-4">GOALS OVER TIME</h2>
            <GoalsOverTimeChart data={goalsOverTime} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rib-tile rounded-lg p-5">
              <h2 className="rib-heading text-lg mb-4">GOALS PER PLAYER</h2>
              <GoalsPerPlayerChart data={goalsPerPlayer} />
            </div>
            <div className="rib-tile rounded-lg p-5">
              <h2 className="rib-heading text-lg mb-4">WIN RATE COMPARISON</h2>
              <WinRateChart data={winRateData} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {highestScoring && (
              <div className="rib-tile rounded-lg p-5">
                <p className="rib-heading text-xs text-rib-acc mb-2" style={{ letterSpacing: '1.5px' }}>
                  HIGHEST SCORING MATCH
                </p>
                <p className="rib-stat text-3xl">
                  {highestScoring.team_a_score} – {highestScoring.team_b_score}
                </p>
                <p className="rib-body text-xs mt-1">
                  {new Date(highestScoring.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            {biggestWin && (
              <div className="rib-tile rounded-lg p-5">
                <p className="rib-heading text-xs text-rib-acc mb-2" style={{ letterSpacing: '1.5px' }}>
                  BIGGEST WIN
                </p>
                <p className="rib-stat text-3xl">
                  {biggestWin.team_a_score} – {biggestWin.team_b_score}
                </p>
                <p className="rib-body text-xs mt-1">
                  {new Date(biggestWin.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            {mostActive && mostActive.games > 0 && (
              <div className="rib-tile rounded-lg p-5">
                <p className="rib-heading text-xs text-rib-acc mb-2" style={{ letterSpacing: '1.5px' }}>
                  MOST ACTIVE PLAYER
                </p>
                <p className="rib-heading text-2xl">{mostActive.player.name}</p>
                <p className="rib-body text-xs mt-1">{mostActive.games} games played</p>
              </div>
            )}
          </div>

          {hatTricks.length > 0 && (
            <div>
              <h2 className="rib-heading text-lg mb-3 flex items-center gap-2">
                <Flame className="text-rib-acc" size={20} /> HAT-TRICK ALERTS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hatTricks.map((h, i) => (
                  <div key={i} className="rib-tile rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="rib-heading text-sm">{h.player!.name}</span>
                    <span className="rib-stat text-lg">{h.goals} goals</span>
                    <span className="rib-body text-xs">
                      {new Date(h.match!.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
