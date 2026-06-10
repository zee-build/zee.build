import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { createClient } from '@/lib/runitback/supabase'
import { buildHeadToHead, buildMatchesWithPlayers, buildPlayerStats } from '@/lib/runitback/queries'
import FifaCard from '@/components/runitback/FifaCard'
import StatBar from '@/components/runitback/StatBar'
import type { Match, MatchPlayer, Player } from '@/lib/runitback/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getData(id: string) {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select('*').returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []

  const player = allPlayers.find((p) => p.id === id)
  if (!player) return null

  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers).find(
    (s) => s.player.id === id
  )!

  const matchesWithPlayers = buildMatchesWithPlayers(allMatches, allMatchPlayers, allPlayers).filter(
    (m) => m.players.some((p) => p.player_id === id)
  )

  const headToHead = buildHeadToHead(id, allPlayers, allMatches, allMatchPlayers)

  return { player, stats, matches: matchesWithPlayers, headToHead }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) return { title: 'Player Not Found — Run It Back' }
  return {
    title: `${data.player.name} — Run It Back`,
    description: `${data.player.name}'s stats, match history, and head-to-head record.`,
  }
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) notFound()

  const { player, stats, matches, headToHead } = data

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/runitback/players" className="rib-heading text-xs text-rib-muted inline-flex items-center gap-1.5 mb-6 hover:text-rib-acc">
        <ArrowLeft size={14} /> BACK TO PLAYERS
      </Link>

      <div className="mb-8">
        <FifaCard stats={stats} variant="full" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'GAMES', value: stats.games },
          { label: 'GOALS', value: stats.goals },
          { label: 'ASSISTS', value: stats.assists },
          { label: 'MOTM', value: stats.motm },
          { label: 'WIN %', value: `${Math.round(stats.winRate)}%` },
          { label: 'STREAK', value: stats.streak },
        ].map((item) => (
          <div key={item.label} className="rib-tile rounded-lg p-3 text-center">
            <p className="rib-stat text-2xl">{item.value}</p>
            <p className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="rib-tile rounded-lg p-5 mb-8 space-y-4">
        <StatBar label="GOALS PER GAME" value={stats.goalsPerGame} max={3} suffix="" />
        <StatBar label="WIN RATE" value={stats.winRate} max={100} />
      </div>

      {/* Match history */}
      <h2 className="rib-heading text-xl mb-3">MATCH HISTORY</h2>
      {matches.length === 0 ? (
        <p className="rib-body text-sm mb-8">No matches played yet.</p>
      ) : (
        <div className="rib-tile rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rib-border">
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>DATE</th>
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>SCORE</th>
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>TEAM</th>
                <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>G</th>
                <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>A</th>
                <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>MOTM</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => {
                const entry = match.players.find((p) => p.player_id === player.id)!
                return (
                  <tr key={match.id} className="border-b border-rib-border last:border-0">
                    <td className="rib-body text-xs px-4 py-3">
                      {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="rib-stat text-sm px-4 py-3">
                      {match.team_a_score} – {match.team_b_score}
                    </td>
                    <td className="rib-heading text-xs px-4 py-3">TEAM {entry.team}</td>
                    <td className="rib-stat text-sm text-center px-4 py-3">{entry.goals}</td>
                    <td className="rib-stat text-sm text-center px-4 py-3">{entry.assists}</td>
                    <td className="text-center px-4 py-3">
                      {entry.is_motm && <Star className="inline text-[#e8c547]" size={16} fill="currentColor" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Head to head */}
      <h2 className="rib-heading text-xl mb-3">HEAD-TO-HEAD</h2>
      {headToHead.length === 0 ? (
        <p className="rib-body text-sm">No head-to-head record yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {headToHead.map((rec) => (
            <div key={rec.player.id} className="rib-tile rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="rib-heading text-sm">{rec.player.name}</span>
              <span className="rib-stat text-sm">
                {rec.wins}W - {rec.losses}L - {rec.draws}D
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
