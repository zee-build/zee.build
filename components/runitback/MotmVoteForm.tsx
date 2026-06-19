'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import FifaCard from './FifaCard'
import type { DayOfWeek, PlayerStats } from '@/lib/runitback/types'

interface PendingMatch {
  matchId: string
  date: string
  dayOfWeek: DayOfWeek
  teammates: PlayerStats[]
}

export default function MotmVoteForm() {
  const [season, setSeason] = useState<number | null>(null)
  const [pending, setPending] = useState<PendingMatch[] | null>(null)
  const [error, setError] = useState('')
  const [submittingMatchId, setSubmittingMatchId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/runitback/motm')
      .then((res) => res.json())
      .then((data) => {
        setSeason(data.season)
        setPending(data.pending ?? [])
      })
      .catch(() => setError('Could not load players to vote for.'))
  }, [])

  const vote = async (matchId: string, votee: PlayerStats) => {
    setError('')
    setSubmittingMatchId(matchId)
    try {
      const res = await fetch('/api/runitback/motm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId, votee_id: votee.player.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setPending((prev) => (prev ?? []).filter((m) => m.matchId !== matchId))
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmittingMatchId(null)
    }
  }

  if (pending === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <div className="rib-tile rounded-xl p-12 text-center max-w-md mx-auto">
        <p className="rib-heading text-xl mb-2">ALL CAUGHT UP</p>
        <p className="rib-body text-sm">
          You&apos;ve cast your MOTM vote for every match this {season ? `SEASON ${season}` : 'season'}.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="rib-heading text-2xl mb-1 text-center">VOTE MOTM</h1>
      <p className="rib-body text-sm mb-6 text-center">
        Pick the man of the match — one vote per match, you can&apos;t vote for yourself.
      </p>
      {error && <p className="rib-body text-red-400 text-sm text-center mb-4">{error}</p>}

      <div className="space-y-8">
        {pending.map((match) => (
          <div key={match.matchId}>
            <h2 className="rib-heading text-sm text-rib-muted mb-3" style={{ letterSpacing: '2px' }}>
              {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
              {match.dayOfWeek.toUpperCase()}
            </h2>
            <div className="flex flex-wrap gap-4">
              {match.teammates.map((s) => (
                <FifaCard
                  key={s.player.id}
                  stats={s}
                  variant="mini"
                  onClick={() => vote(match.matchId, s)}
                />
              ))}
            </div>
            {submittingMatchId === match.matchId && (
              <p className="rib-body text-xs text-rib-muted mt-2">Submitting vote...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
