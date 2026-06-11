import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/runitback/supabase'
import { PUBLIC_PLAYER_COLUMNS } from '@/lib/runitback/queries'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import ProfileForm from '@/components/runitback/ProfileForm'
import type { Player } from '@/lib/runitback/types'

export const metadata: Metadata = {
  title: 'Run It Back — My Profile',
  description: 'Manage your player profile.',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const playerId = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)

  if (!playerId) {
    redirect('/runitback/login')
  }

  const supabase = createServiceClient()
  const { data: player } = await supabase
    .from('players')
    .select(PUBLIC_PLAYER_COLUMNS)
    .eq('id', playerId)
    .single<Player>()

  if (!player) {
    redirect('/runitback/login')
  }

  return (
    <div className="rib-page flex items-center justify-center min-h-[70vh]">
      <ProfileForm player={player} />
    </div>
  )
}
