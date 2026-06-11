'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Pencil, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/runitback/admin'
import MatchLogForm from './MatchLogForm'
import type { MatchWithPlayers, Player } from '@/lib/runitback/types'

interface ModPanelProps {
  players: Player[]
  matches: MatchWithPlayers[]
}

export default function ModPanel({ players, matches }: ModPanelProps) {
  const router = useRouter()
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null)
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null)

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('Delete this match? This cannot be undone and will affect everyone\'s stats.')) return
    setDeletingMatchId(id)
    try {
      const res = await adminFetch(`/api/runitback/matches/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeletingMatchId(null)
    }
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="rib-heading text-3xl">MOD</h1>
        <Link
          href="/runitback/mod/teams"
          className="rib-heading text-xs px-4 py-2.5 rounded-lg border border-rib-acc text-rib-acc flex items-center gap-1.5"
          style={{ letterSpacing: '1.5px' }}
        >
          <Users size={14} /> TEAM PICKER
        </Link>
      </div>

      {/* Log new match */}
      <section className="rib-tile rounded-xl p-5">
        <h2 className="rib-heading text-xl mb-4">LOG NEW MATCH</h2>
        <MatchLogForm players={players} />
      </section>

      {/* Manage matches */}
      <section className="rib-tile rounded-xl p-5">
        <h2 className="rib-heading text-xl mb-4">MANAGE MATCHES</h2>
        <div className="space-y-2">
          {matches.map((match) => (
            <div key={match.id} className="rib-tile rounded-lg px-4 py-3">
              {editingMatchId === match.id ? (
                <MatchLogForm
                  players={players}
                  match={match}
                  onSaved={() => {
                    setEditingMatchId(null)
                    router.refresh()
                  }}
                  onCancel={() => setEditingMatchId(null)}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <p className="rib-heading text-sm">
                      {match.date} · {match.day_of_week}
                    </p>
                    <p className="rib-body text-xs">
                      {match.location} · {match.team_a_score}-{match.team_b_score} ·{' '}
                      {match.players.length} players
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingMatchId(match.id)}
                    className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
                    style={{ letterSpacing: '1.5px' }}
                  >
                    <Pencil size={12} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    disabled={deletingMatchId === match.id}
                    className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-red-900 text-red-400 hover:bg-red-950 flex items-center gap-1.5 disabled:opacity-50"
                    style={{ letterSpacing: '1.5px' }}
                  >
                    <Trash2 size={12} /> DELETE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
