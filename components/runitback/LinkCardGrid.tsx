'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import FifaCard from './FifaCard'
import { buildPlayerStats } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

export default function LinkCardGrid() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[] | null>(null)
  const [error, setError] = useState('')
  const [linkingId, setLinkingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/runitback/auth/unclaimed')
      .then((res) => res.json())
      .then((data) => setPlayers(data.players ?? []))
      .catch(() => setError('Could not load player cards.'))
  }, [])

  const handlePick = async (playerId: string) => {
    setError('')
    setLinkingId(playerId)
    try {
      const res = await fetch('/api/runitback/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        setLinkingId(null)
        return
      }
      router.push('/runitback/profile')
      router.refresh()
    } catch {
      setError('Something went wrong.')
      setLinkingId(null)
    }
  }

  if (players === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="rib-tile rounded-xl p-12 text-center max-w-md mx-auto">
        <p className="rib-heading text-xl mb-2">NO CARDS LEFT TO CLAIM</p>
        <p className="rib-body text-sm">
          Every profile has already been linked. If yours is missing, ask the admin to add it.
        </p>
      </div>
    )
  }

  const stats = buildPlayerStats(players, [], [], [])

  return (
    <div>
      <h1 className="rib-heading text-2xl mb-1 text-center">LINK YOUR PLAYER CARD</h1>
      <p className="rib-body text-sm mb-6 text-center">Tap your card to claim it.</p>
      {error && <p className="rib-body text-red-400 text-sm text-center mb-4">{error}</p>}
      <div className="flex flex-wrap gap-5 justify-center">
        {stats.map((s) => (
          <button
            key={s.player.id}
            onClick={() => handlePick(s.player.id)}
            disabled={linkingId !== null}
            className="transition-transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50"
          >
            <FifaCard stats={s} />
          </button>
        ))}
      </div>
    </div>
  )
}
