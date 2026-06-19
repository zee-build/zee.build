import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { createClient } from '@/lib/runitback/supabase'
import { buildMatchesWithPlayers, getInitials, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { RATING_ATTRIBUTES } from '@/lib/runitback/config'
import type { Match, MatchPlayer, PeerRating, Player } from '@/lib/runitback/types'

interface PageProps {
  params: Promise<{ id: string }>
}

const DAY_PILL_CLASS: Record<string, string> = {
  Friday: 'bg-rib-acc/20 text-rib-acc',
  Tuesday: 'bg-rib-acc2/20 text-rib-acc2',
  Other: 'bg-rib-muted/20 text-rib-muted',
}

async function getData(id: string) {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: ratings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('peer_ratings').select('*').eq('match_id', id).returns<PeerRating[]>(),
  ])

  const matchesWithPlayers = buildMatchesWithPlayers(matches ?? [], matchPlayers ?? [], players ?? [])
  const match = matchesWithPlayers.find((m) => m.id === id)
  if (!match) return null

  const playerById = new Map((players ?? []).map((p) => [p.id, p]))
  const matchRatings = (ratings ?? []).map((r) => ({
    rater: playerById.get(r.rater_id) ?? null,
    ratee: playerById.get(r.ratee_id) ?? null,
    attrs: r,
  }))

  return { match, matchRatings }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getData(id)
  if (!data) return { title: 'Match Not Found — Run It Back' }
  const { match } = data
  return {
    title: `${match.team_a_score}–${match.team_b_score} · ${new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} — Run It Back`,
    description: `Match details, roster, and peer ratings for ${match.day_of_week} at ${match.location}.`,
  }
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getData(id)
  if (!data) notFound()

  const { match, matchRatings } = data
  const date = new Date(match.date)
  const motm = match.players.find((p) => p.is_motm)
  const teamA = match.players.filter((p) => p.team === 'A')
  const teamB = match.players.filter((p) => p.team === 'B')

  return (
    <div className="rib-page max-w-4xl mx-auto">
      <Link href="/runitback/matches" className="rib-heading text-xs text-rib-muted inline-flex items-center gap-1.5 mb-6 hover:text-rib-acc" style={{ letterSpacing: '2px' }}>
        <ArrowLeft size={14} /> BACK TO MATCHES
      </Link>

      {/* Match summary */}
      <div className="rib-tile rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="rib-heading text-sm bg-rib-bg2 border border-rib-border rounded px-3 py-1">
            {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <span
            className={`rib-heading text-[10px] px-2 py-1 rounded ${DAY_PILL_CLASS[match.day_of_week] ?? DAY_PILL_CLASS.Other}`}
            style={{ letterSpacing: '1.5px' }}
          >
            {match.day_of_week.toUpperCase()}
          </span>
          <span className="rib-body text-xs">{match.location}</span>
        </div>

        <div className="rib-heading text-4xl md:text-5xl text-center mb-3">
          <span className="text-white">TEAM A</span>{' '}
          <span className="text-rib-acc">{match.team_a_score}</span>
          <span className="text-rib-muted mx-2">–</span>
          <span className="text-rib-acc">{match.team_b_score}</span>{' '}
          <span className="text-white">TEAM B</span>
        </div>

        {motm && (
          <p className="flex items-center justify-center gap-1.5 text-[#e8c547] rib-heading text-sm">
            <Star size={14} fill="currentColor" /> MOTM: {motm.player.name}
          </p>
        )}

        {match.notes && <p className="rib-body text-xs text-center mt-2 italic">{match.notes}</p>}
      </div>

      {/* Rosters */}
      <h2 className="rib-heading text-xl mb-3">ROSTER</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'TEAM A', roster: teamA },
          { label: 'TEAM B', roster: teamB },
        ].map(({ label, roster }) => (
          <div key={label} className="rib-tile rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-rib-border">
              <h3 className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>{label}</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rib-border">
                  <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>PLAYER</th>
                  <th className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>POS</th>
                  <th className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>G</th>
                  <th className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>A</th>
                  <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>MOTM</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((mp) => (
                  <tr key={mp.id} className="border-b border-rib-border last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/runitback/players/${mp.player.id}`} className="rib-heading text-xs hover:text-rib-acc" style={{ letterSpacing: '1.5px' }}>
                        {mp.player.name}
                      </Link>
                    </td>
                    <td className="rib-body text-xs text-center px-3 py-3 text-rib-muted">
                      {mp.played_position ?? mp.player.position ?? '—'}
                    </td>
                    <td className="rib-stat text-sm text-center px-3 py-3">{mp.goals}</td>
                    <td className="rib-stat text-sm text-center px-3 py-3">{mp.assists}</td>
                    <td className="text-center px-4 py-3">
                      {mp.is_motm && <Star className="inline text-[#e8c547]" size={14} fill="currentColor" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Peer ratings for this match — public so the squad can keep each other honest */}
      <h2 className="rib-heading text-xl mb-3">MATCH RATINGS</h2>
      {matchRatings.length === 0 ? (
        <p className="rib-body text-sm">No teammates have rated each other for this match yet.</p>
      ) : (
        <div className="rib-tile rounded-lg overflow-hidden">
          <div className="rib-table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rib-border">
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>RATED BY</th>
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>PLAYER</th>
                {RATING_ATTRIBUTES.map((a) => (
                  <th key={a.key} className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>
                    {a.label.slice(0, 3)}
                  </th>
                ))}
                <th className="rib-heading text-xs text-rib-muted text-center px-4 py-2" style={{ letterSpacing: '1.5px' }}>AVG</th>
              </tr>
            </thead>
            <tbody>
              {matchRatings.map(({ rater, ratee, attrs }) => {
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
                    <td className="px-4 py-3">
                      {ratee ? (
                        <Link href={`/runitback/players/${ratee.id}`} className="rib-heading text-xs hover:text-rib-acc inline-flex items-center gap-2" style={{ letterSpacing: '1.5px' }}>
                          {getInitials(ratee.name)} · {ratee.name}
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
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
