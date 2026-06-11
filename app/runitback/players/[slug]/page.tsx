import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { createClient } from '@/lib/runitback/supabase'
import { buildHeadToHead, buildMatchesWithPlayers, buildPlayerStats, getInitials, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { CURRENT_SEASON, RATING_ATTRIBUTES } from '@/lib/runitback/config'
import FifaCard from '@/components/runitback/FifaCard'
import StatBar from '@/components/runitback/StatBar'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getData(id: string) {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('season', CURRENT_SEASON).returns<PeerRating[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []

  const player = allPlayers.find((p) => p.id === id)
  if (!player) return null

  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers, ratings ?? []).find(
    (s) => s.player.id === id
  )!

  const matchesWithPlayers = buildMatchesWithPlayers(allMatches, allMatchPlayers, allPlayers).filter(
    (m) => m.players.some((p) => p.player_id === id)
  )

  const headToHead = buildHeadToHead(id, allPlayers, allMatches, allMatchPlayers)

  const playerById = new Map(allPlayers.map((p) => [p.id, p]))
  const receivedRatings = (ratings ?? [])
    .filter((r) => r.ratee_id === id)
    .map((r) => ({
      rater: playerById.get(r.rater_id) ?? null,
      attrs: r,
    }))

  return { player, stats, matches: matchesWithPlayers, headToHead, receivedRatings }
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

  const { player, stats, matches, headToHead, receivedRatings } = data

  return (
    <div className="rib-page max-w-4xl mx-auto">
      <Link href="/runitback/players" className="rib-heading text-xs text-rib-muted inline-flex items-center gap-1.5 mb-6 hover:text-rib-acc" style={{ letterSpacing: '2px' }}>
        <ArrowLeft size={14} /> BACK TO PLAYERS
      </Link>

      {/* Card + key stats side-by-side on desktop */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
        <div className="shrink-0 flex justify-center w-full md:w-auto">
          <FifaCard stats={stats} variant="full" />
        </div>

        {/* Stats panel */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="rib-heading text-4xl text-white leading-none">{player.name}</h1>
            {player.nickname && <p className="rib-body text-sm mt-1">&ldquo;{player.nickname}&rdquo;</p>}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {player.position && (
                <span className="rib-heading text-[10px] px-2 py-0.5 rounded" style={{ letterSpacing: '2px', background: 'color-mix(in srgb, var(--acc) 15%, transparent)', color: 'var(--acc)', border: '1px solid color-mix(in srgb, var(--acc) 30%, transparent)' }}>
                  {player.position}
                </span>
              )}
              <span className="rib-heading text-[10px] px-2 py-0.5 rounded" style={{ letterSpacing: '2px', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                {player.is_regular ? 'REGULAR' : 'GUEST'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'GAMES', value: stats.games },
              { label: 'GOALS', value: stats.goals },
              { label: 'ASSISTS', value: stats.assists },
              { label: 'MOTM', value: stats.motm },
              { label: 'WIN %', value: `${Math.round(stats.winRate)}%` },
              { label: 'STREAK', value: `${stats.streak}W` },
            ].map((item) => (
              <div key={item.label} className="rib-tile rounded-lg p-3 text-center">
                <p className="rib-stat text-2xl">{item.value}</p>
                <p className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rib-tile rounded-lg p-4 space-y-3">
            <StatBar label="GOALS PER GAME" value={stats.goalsPerGame} max={3} suffix="" />
            <StatBar label="WIN RATE" value={stats.winRate} max={100} />
          </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
          {headToHead.map((rec) => (
            <Link key={rec.player.id} href={`/runitback/players/${rec.player.id}`} className="rib-tile rounded-lg px-4 py-3 flex items-center justify-between hover:border-rib-acc transition-colors">
              <span className="rib-heading text-sm">{rec.player.name}</span>
              <span className="rib-stat text-sm">
                {rec.wins}W – {rec.losses}L – {rec.draws}D
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Peer ratings — public so the squad can keep each other honest */}
      <h2 className="rib-heading text-xl mb-3">PEER RATINGS — {CURRENT_SEASON}</h2>
      {receivedRatings.length === 0 ? (
        <p className="rib-body text-sm">No teammates have rated {player.name.split(' ')[0]} yet.</p>
      ) : (
        <div className="rib-tile rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rib-border">
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>RATED BY</th>
                {RATING_ATTRIBUTES.map((a) => (
                  <th key={a.key} className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>
                    {a.label.slice(0, 3)}
                  </th>
                ))}
                <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>AVG</th>
              </tr>
            </thead>
            <tbody>
              {receivedRatings.map(({ rater, attrs }) => {
                const avg = RATING_ATTRIBUTES.reduce((sum, a) => sum + attrs[a.key], 0) / RATING_ATTRIBUTES.length
                return (
                  <tr key={attrs.id} className="border-b border-rib-border last:border-0">
                    <td className="px-4 py-3">
                      {rater ? (
                        <Link href={`/runitback/players/${rater.id}`} className="rib-heading text-xs hover:text-rib-acc inline-flex items-center gap-2" style={{ letterSpacing: '1.5px' }}>
                          {getInitials(rater.name)} · {rater.name}
                        </Link>
                      ) : (
                        <span className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '1.5px' }}>UNKNOWN</span>
                      )}
                    </td>
                    {RATING_ATTRIBUTES.map((a) => (
                      <td key={a.key} className="rib-stat text-sm text-center px-3 py-3">{attrs[a.key]}</td>
                    ))}
                    <td className="rib-stat text-sm text-center px-4 py-3 text-rib-acc">{avg.toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
