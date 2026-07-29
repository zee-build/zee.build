import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/runitback/supabase'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { buildPlayerStats, getPendingMatchRatings, PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { CURRENT_SEASON } from '@/lib/runitback/config'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import PlayersGrid from '@/components/runitback/PlayersGrid'
import type { AttributeRating, LeagueSettings, Match, MatchPlayer, MatchRating, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Players',
  description: 'Full FIFA-style roster of every player in the squad.',
}

export default async function PlayersPage() {
  const supabase = createClient()
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  const [{ data: players }, { data: matches }, { data: matchPlayers }, { data: matchRatings }, { data: attributeRatings }, { data: settingsRow }] =
    await Promise.all([
      supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).returns<Player[]>(),
      supabase.from('matches').select('*').returns<Match[]>(),
      supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
      supabase.from('match_ratings').select('*').eq('season', CURRENT_SEASON).returns<MatchRating[]>(),
      supabase.from('attribute_ratings').select('*').eq('season', CURRENT_SEASON).returns<AttributeRating[]>(),
      supabase.from('league_settings').select('ratings_public').eq('id', 'global').single<Pick<LeagueSettings, 'ratings_public'>>(),
    ])

  const me = (players ?? []).find((p) => p.id === playerId)
  const isMod = me?.role === 'mod' || me?.role === 'admin'
  const ratingsPublic = settingsRow?.ratings_public ?? true
  const showRatings = isMod || ratingsPublic

  const stats = buildPlayerStats(players ?? [], matches ?? [], matchPlayers ?? [], matchRatings ?? [], attributeRatings ?? [])

  // A logged-in player who still owes match ratings has everyone else's cards
  // blurred until they finish — finishing their votes unlocks the whole squad.
  const viewerPending = playerId
    ? getPendingMatchRatings(playerId, matches ?? [], matchPlayers ?? [], players ?? [], matchRatings ?? [])
        .reduce((sum, p) => sum + p.teammates.length, 0)
    : 0
  const cardsLocked = !!playerId && !isMod && viewerPending > 0

  return (
    <div className="rib-page">
      <h1 className="rib-heading text-3xl mb-6">PLAYERS</h1>

      {cardsLocked && (
        <Link
          href="/runitback/rate"
          className="rib-tile rounded-xl p-4 mb-6 flex items-center gap-3 hover:border-rib-acc transition-colors"
        >
          <Lock size={18} className="text-rib-acc shrink-0" />
          <span className="rib-body text-sm">
            <span className="rib-heading text-rib-acc" style={{ letterSpacing: '1px' }}>
              {viewerPending} rating{viewerPending === 1 ? '' : 's'} left
            </span>{' '}
            — finish rating your teammates to unlock everyone&apos;s cards.
          </span>
        </Link>
      )}

      <PlayersGrid stats={stats} showRatings={showRatings} cardsLocked={cardsLocked} viewerId={playerId} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
