import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { readSessionToken, SESSION_COOKIE_NAME } from '@/lib/runitback/playerAuth'
import RatePlayersForm from '@/components/runitback/RatePlayersForm'

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

  return (
    <div className="rib-page min-h-[70vh] py-8">
      <RatePlayersForm />
    </div>
  )
}
