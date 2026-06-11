'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

export default function RatePlayersForm() {
  const [season, setSeason] = useState<number | null>(null)
  const [players, setPlayers] = useState<Player[] | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/runitback/ratings')
      .then((res) => res.json())
      .then((data) => {
        setSeason(data.season)
        setPlayers(data.players ?? [])
      })
      .catch(() => setError('Could not load players to rate.'))
  }, [])

  const handleSubmit = async (playerId: string) => {
    setError('')
    const rating = ratings[playerId] ?? 5
    setSubmittingId(playerId)
    try {
      const res = await fetch('/api/runitback/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratee_id: playerId, rating }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setPlayers((prev) => (prev ? prev.filter((p) => p.id !== playerId) : prev))
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmittingId(null)
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
        <p className="rib-heading text-xl mb-2">ALL CAUGHT UP</p>
        <p className="rib-body text-sm">
          You&apos;ve rated the whole squad for {season ? `SEASON ${season}` : 'this season'}.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="rib-heading text-2xl mb-1 text-center">RATE THE SQUAD</h1>
      <p className="rib-body text-sm mb-6 text-center">
        Rate each teammate 1-10 — one rating per player, per season.
      </p>
      {error && <p className="rib-body text-red-400 text-sm text-center mb-4">{error}</p>}
      <div className="space-y-3">
        {players.map((player) => {
          const value = ratings[player.id] ?? 5
          return (
            <div key={player.id} className="rib-tile rounded-lg p-4 flex items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rib-acc2 text-white rib-heading text-sm overflow-hidden shrink-0">
                {player.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={player.avatar_url} alt={player.name} className="h-full w-full object-cover" />
                ) : (
                  getInitials(player.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="rib-heading text-sm truncate">{player.name}</p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={value}
                  onChange={(e) =>
                    setRatings((prev) => ({ ...prev, [player.id]: Number(e.target.value) }))
                  }
                  className="w-full mt-2 accent-rib-acc"
                />
              </div>
              <div className="rib-stat text-2xl w-8 text-center shrink-0">{value}</div>
              <button
                type="button"
                onClick={() => handleSubmit(player.id)}
                disabled={submittingId !== null}
                className="rib-heading text-xs px-3 py-2 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50 shrink-0"
                style={{ letterSpacing: '1.5px' }}
              >
                {submittingId === player.id ? '...' : 'RATE'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
