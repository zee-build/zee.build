import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowLeft, Star } from 'lucide-react'
import { createClient } from '@/lib/runitback/supabase'
import { buildHeadToHead, buildMatchesWithPlayers, buildPlayerStats, getInitials, getPendingMatchRatings, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { CURRENT_SEASON, RATING_ATTRIBUTES, TRAITS, windowLabel } from '@/lib/runitback/config'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import FifaCard from '@/components/runitback/FifaCard'
import StatBar from '@/components/runitback/StatBar'
import RatingHistoryChart, { type RatingHistoryPoint } from '@/components/runitback/RatingHistoryChart'
import type { AttributeRating, LeagueSettings, Match, MatchPlayer, MatchRating, Player } from '@/lib/runitback/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getData(id: string) {
  const supabase = createClient()

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: matchRatings }, { data: attributeRatings }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
    supabase.from('matches').select('*').returns<Match[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
    supabase.from('match_ratings').select('*').eq('season', CURRENT_SEASON).returns<MatchRating[]>(),
    supabase.from('attribute_ratings').select('*').eq('season', CURRENT_SEASON).returns<AttributeRating[]>(),
  ])

  const allPlayers = players ?? []
  const allMatches = matches ?? []
  const allMatchPlayers = matchPlayers ?? []
  const allMatchRatings = matchRatings ?? []
  const allAttributeRatings = attributeRatings ?? []

  const player = allPlayers.find((p) => p.id === id)
  if (!player) return null

  const stats = buildPlayerStats(allPlayers, allMatches, allMatchPlayers, allMatchRatings, allAttributeRatings).find(
    (s) => s.player.id === id
  )!

  const matchesWithPlayers = buildMatchesWithPlayers(allMatches, allMatchPlayers, allPlayers).filter(
    (m) => m.players.some((p) => p.player_id === id)
  )

  const headToHead = buildHeadToHead(id, allPlayers, allMatches, allMatchPlayers)

  const playerById = new Map(allPlayers.map((p) => [p.id, p]))
  const matchById = new Map(allMatches.map((m) => [m.id, m]))

  // ── Weekly match ratings received (1-10), averaged per match ──────────
  const ratingsByMatch = new Map<string, { sum: number; count: number; date: string; dayOfWeek: typeof allMatches[number]['day_of_week'] }>()
  for (const r of allMatchRatings) {
    if (r.ratee_id !== id) continue
    const match = matchById.get(r.match_id)
    if (!match) continue
    const entry = ratingsByMatch.get(r.match_id) ?? { sum: 0, count: 0, date: match.date, dayOfWeek: match.day_of_week }
    entry.sum += r.score
    entry.count += 1
    ratingsByMatch.set(r.match_id, entry)
  }
  const ratingHistory: RatingHistoryPoint[] = Array.from(ratingsByMatch.entries())
    .map(([matchId, { sum, count, date, dayOfWeek }]) => ({ matchId, date, dayOfWeek, avg: sum / count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // ── Attribute ratings received (1-99) — latest window only ────────────
  const attrRows = allAttributeRatings.filter((r) => r.ratee_id === id)
  const latestWindow = attrRows.reduce((mx, r) => (r.rating_window > mx ? r.rating_window : mx), '')
  const attributeRatingsReceived = attrRows
    .filter((r) => r.rating_window === latestWindow)
    .map((r) => ({ rater: playerById.get(r.rater_id) ?? null, attrs: r }))
    .sort((a, b) => (a.rater?.name ?? '').localeCompare(b.rater?.name ?? ''))

  return {
    player,
    stats,
    matches: matchesWithPlayers,
    headToHead,
    ratingHistory,
    attributeRatingsReceived,
    attributeWindow: latestWindow,
    raw: {
      players: allPlayers,
      matches: allMatches,
      matchPlayers: allMatchPlayers,
      matchRatings: allMatchRatings,
    },
  }
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

  // Check viewer's role and settings for ratings visibility
  const supabase = createClient()
  const cookieStore = await cookies()
  const viewerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  const [{ data: viewerRow }, { data: settingsRow }] = await Promise.all([
    viewerId ? supabase.from('players').select('role').eq('id', viewerId).single<Pick<Player, 'role'>>() : Promise.resolve({ data: null }),
    supabase.from('league_settings').select('ratings_public').eq('id', 'global').single<Pick<LeagueSettings, 'ratings_public'>>(),
  ])
  const ratingsPublic = settingsRow?.ratings_public ?? true
  const showRatings = ratingsPublic
  const isMod = viewerRow?.role === 'mod' || viewerRow?.role === 'admin'

  const { player, stats, matches, headToHead, ratingHistory, attributeRatingsReceived, attributeWindow, raw } = data
  const isGK = player.position === 'GK'

  // A logged-in player who still owes match ratings sees other players' cards
  // blurred until they finish voting (their own card stays visible).
  const viewerPending = viewerId
    ? getPendingMatchRatings(viewerId, raw.matches, raw.matchPlayers, raw.players, raw.matchRatings)
        .reduce((sum, p) => sum + p.teammates.length, 0)
    : 0
  const cardLocked = !!viewerId && !isMod && viewerId !== player.id && viewerPending > 0

  return (
    <div className="rib-page max-w-4xl mx-auto">
      <Link href="/runitback/players" className="rib-heading text-xs text-rib-muted inline-flex items-center gap-1.5 mb-6 hover:text-rib-acc" style={{ letterSpacing: '2px' }}>
        <ArrowLeft size={14} /> BACK TO PLAYERS
      </Link>

      {/* Card + key stats side-by-side on desktop */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
        <div className="shrink-0 flex flex-col items-center gap-3 w-full md:w-auto">
          <FifaCard stats={stats} variant="full" showRatings={showRatings} locked={cardLocked} />
          {cardLocked && (
            <Link href="/runitback/rate" className="rib-heading text-xs text-rib-acc inline-flex items-center gap-1.5" style={{ letterSpacing: '1.5px' }}>
              <Star size={12} /> FINISH RATING TO UNLOCK
            </Link>
          )}
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
            {player.traits.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {player.traits.map((id) => {
                  const trait = TRAITS.find((t) => t.id === id)
                  if (!trait) return null
                  return (
                    <span
                      key={id}
                      className="rib-heading text-[10px] px-2 py-0.5 rounded"
                      style={{ letterSpacing: '1.5px', background: 'rgba(232,197,71,0.12)', color: '#e8c547', border: '1px solid rgba(232,197,71,0.3)' }}
                    >
                      {trait.label}
                    </span>
                  )
                })}
              </div>
            )}
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
          <div className="rib-table-wrap">
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

      {/* Ratings — only visible when ratings are public or viewer is mod */}
      {showRatings && <>
      {/* Weekly form — average match rating out of 10 over the season */}
      <h2 className="rib-heading text-xl mb-3">FORM — {CURRENT_SEASON}</h2>
      {ratingHistory.length > 1 ? (
        <div className="mb-8"><RatingHistoryChart data={ratingHistory} /></div>
      ) : (
        <p className="rib-body text-sm mb-8">Not enough match ratings yet to chart {player.name.split(' ')[0]}&apos;s form.</p>
      )}

      {/* Attribute ratings — the 1-99 breakdown from the latest update window */}
      <h2 className="rib-heading text-xl mb-3">
        ATTRIBUTE RATINGS{attributeWindow ? ` — ${windowLabel(attributeWindow)}` : ''}
      </h2>
      {attributeRatingsReceived.length === 0 ? (
        <p className="rib-body text-sm">No one has rated {player.name.split(' ')[0]}&apos;s attributes yet.</p>
      ) : (
        <div className="rib-tile rounded-lg overflow-hidden">
          <div className="rib-table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rib-border">
                <th className="rib-heading text-xs text-rib-muted text-left px-4 py-2" style={{ letterSpacing: '1.5px' }}>RATED BY</th>
                {RATING_ATTRIBUTES.map((a) => (
                  <th key={a.key} className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>
                    {a.label.slice(0, 3)}
                  </th>
                ))}
                {isGK && (
                  <th className="rib-heading text-xs text-rib-muted text-center px-3 py-2" style={{ letterSpacing: '1.5px' }}>GK</th>
                )}
              </tr>
            </thead>
            <tbody>
              {attributeRatingsReceived.map(({ rater, attrs }) => (
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
                  {isGK && (
                    <td className="rib-stat text-sm text-center px-3 py-3">{attrs.goalkeeping ?? '—'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      </>}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
