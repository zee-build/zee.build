import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import { createClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import RatePlayersForm from '@/components/runitback/RatePlayersForm'
import type { LeagueSettings, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Rate the Squad',
  description: 'Rate your teammates for this season.',
}

export default async function RatePage() {
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  if (!playerId) {
    redirect('/runitback/login')
  }

  const supabase = createClient()
  const [{ data: players }, { data: settingsRow }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).eq('id', playerId).single<Player>(),
    supabase.from('league_settings').select('voting_open').eq('id', 'global').single<Pick<LeagueSettings, 'voting_open'>>(),
  ])

  const isMod = players?.role === 'mod' || players?.role === 'admin'
  const votingOpen = settingsRow?.voting_open ?? true

  if (!isMod && !votingOpen) {
    return (
      <div className="rib-page min-h-[70vh] py-8 flex items-center justify-center">
        <div className="rib-tile rounded-xl p-10 text-center max-w-sm">
          <p className="rib-heading text-2xl mb-3">VOTING CLOSED</p>
          <p className="rib-body text-sm text-rib-muted">
            Mods have temporarily disabled peer ratings. Check back later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rib-page min-h-[70vh] py-8">
      <RatePlayersForm />
    </div>
  )
}
