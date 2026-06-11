'use client'

import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import FifaCard from './FifaCard'
import { RATING_ATTRIBUTES } from '@/lib/runitback/config'
import type { PlayerStats, RatingAttribute } from '@/lib/runitback/types'

const DEFAULT_VALUES: Record<RatingAttribute, number> = {
  pace: 5,
  shooting: 5,
  passing: 5,
  dribbling: 5,
  defending: 5,
  physical: 5,
}

export default function RatePlayersForm() {
  const [season, setSeason] = useState<number | null>(null)
  const [stats, setStats] = useState<PlayerStats[] | null>(null)
  const [selected, setSelected] = useState<PlayerStats | null>(null)
  const [values, setValues] = useState<Record<RatingAttribute, number>>(DEFAULT_VALUES)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/runitback/ratings')
      .then((res) => res.json())
      .then((data) => {
        setSeason(data.season)
        setStats(data.stats ?? [])
      })
      .catch(() => setError('Could not load players to rate.'))
  }, [])

  const openRating = (player: PlayerStats) => {
    setError('')
    setValues(DEFAULT_VALUES)
    setSelected(player)
  }

  const handleSubmit = async () => {
    if (!selected) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratee_id: selected.player.id, ...values }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      const ratedId = selected.player.id
      setStats((prev) => (prev ? prev.filter((s) => s.player.id !== ratedId) : prev))
      setSelected(null)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (stats === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  if (stats.length === 0) {
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
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="rib-heading text-2xl mb-1 text-center">RATE THE SQUAD</h1>
      <p className="rib-body text-sm mb-6 text-center">
        Tap a teammate&apos;s card and rate their attributes — once per player, per season.
      </p>
      {error && !selected && <p className="rib-body text-red-400 text-sm text-center mb-4">{error}</p>}

      <div className="flex flex-wrap justify-center gap-4">
        {stats.map((s) => (
          <FifaCard key={s.player.id} stats={s} variant="mini" onClick={() => openRating(s)} />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => !submitting && setSelected(null)}
        >
          <div
            className="rib-tile rounded-xl p-6 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              disabled={submitting}
              className="absolute top-3 right-3 text-rib-muted hover:text-white disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="rib-heading text-xs text-rib-muted mb-1" style={{ letterSpacing: '1.5px' }}>
              RATE
            </p>
            <h2 className="rib-heading text-xl mb-4">
              {selected.player.nickname || selected.player.name}
            </h2>

            <div className="space-y-4">
              {RATING_ATTRIBUTES.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '1.5px' }}>
                      {label}
                    </span>
                    <span className="rib-stat text-lg">{values[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={values[key]}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                    className="w-full accent-rib-acc"
                  />
                </div>
              ))}
            </div>

            {error && <p className="rib-body text-red-400 text-sm mt-4">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-6 rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
              style={{ letterSpacing: '2px' }}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT RATING'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
