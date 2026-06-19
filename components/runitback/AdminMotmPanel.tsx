'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import type { MotmVote } from '@/lib/runitback/types'

interface PlayerLite {
  id: string
  name: string
  nickname: string | null
}

interface TallyEntry {
  playerId: string
  votes: number
}

export default function AdminMotmPanel() {
  const [votes, setVotes] = useState<MotmVote[] | null>(null)
  const [players, setPlayers] = useState<PlayerLite[]>([])
  const [tallies, setTallies] = useState<Record<string, TallyEntry[]>>({})
  const [leaders, setLeaders] = useState<Record<string, string | null>>({})
  const [error, setError] = useState('')
  const [busyMatchId, setBusyMatchId] = useState<string | null>(null)

  const load = () => {
    adminFetch('/api/runitback/admin/motm')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setVotes(data.votes ?? [])
        setPlayers(data.players ?? [])
        setTallies(data.tallies ?? {})
        setLeaders(data.leaders ?? {})
      })
      .catch(() => setError('Could not load MOTM votes.'))
  }

  useEffect(load, [])

  const nameFor = (id: string) => players.find((p) => p.id === id)?.name ?? 'Unknown'

  const handleApprove = async (matchId: string) => {
    setBusyMatchId(matchId)
    try {
      const res = await adminFetch('/api/runitback/admin/motm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not approve MOTM.')
        return
      }
      setError('')
      load()
    } finally {
      setBusyMatchId(null)
    }
  }

  if (error) return <p className="rib-body text-red-400 text-sm">{error}</p>
  if (votes === null) return <p className="rib-body text-sm">Loading...</p>
  if (votes.length === 0) return <p className="rib-body text-sm">No MOTM votes cast yet.</p>

  const byMatch = new Map<string, MotmVote[]>()
  for (const v of votes) {
    const list = byMatch.get(v.match_id) ?? []
    list.push(v)
    byMatch.set(v.match_id, list)
  }

  return (
    <div className="space-y-4">
      {[...byMatch.entries()].map(([matchId, matchVotes]) => {
        const tally = tallies[matchId] ?? []
        const leaderId = leaders[matchId]
        return (
          <div key={matchId} className="rib-tile rounded-lg p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="rib-heading text-sm">
                {matchVotes.length} vote{matchVotes.length === 1 ? '' : 's'}
                {tally.length > 0 && (
                  <span className="rib-body text-rib-muted text-xs ml-2">
                    Leading: {leaderId ? nameFor(leaderId) : 'Tied'}
                  </span>
                )}
              </p>
              <button
                onClick={() => handleApprove(matchId)}
                disabled={busyMatchId === matchId || !leaderId}
                className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-rib-acc text-rib-acc flex items-center gap-1.5 disabled:opacity-50"
                style={{ letterSpacing: '1.5px' }}
              >
                <Check size={12} /> APPROVE MOTM
              </button>
            </div>
            <div className="space-y-1">
              {matchVotes.map((v) => (
                <p key={v.id} className="rib-body text-xs text-rib-muted">
                  {nameFor(v.voter_id)} → <span className="text-white">{nameFor(v.votee_id)}</span>
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
