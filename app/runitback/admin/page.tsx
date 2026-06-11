import type { Metadata } from 'next'
import { createClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import PinGate from '@/components/runitback/PinGate'
import AdminPanel from '@/components/runitback/AdminPanel'
import type { MatchPlayer, Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const supabase = createClient()

  const [{ data: players }, { data: matchPlayers }] = await Promise.all([
    supabase.from('players').select(PUBLIC_PLAYER_COLUMNS).order('name').returns<Player[]>(),
    supabase.from('match_players').select('*').returns<MatchPlayer[]>(),
  ])

  const gamesPlayedById: Record<string, number> = {}
  for (const mp of matchPlayers ?? []) {
    gamesPlayedById[mp.player_id] = (gamesPlayedById[mp.player_id] ?? 0) + 1
  }

  return (
    <div className="rib-page">
      <PinGate>
        <AdminPanel players={players ?? []} gamesPlayedById={gamesPlayedById} />
      </PinGate>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
