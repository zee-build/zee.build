'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Trash2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/runitback/admin'
import MatchLogForm from './MatchLogForm'
import PlayerForm from './PlayerForm'
import type { Player } from '@/lib/runitback/types'

interface AdminPanelProps {
  players: Player[]
  gamesPlayedById: Record<string, number>
}

export default function AdminPanel({ players, gamesPlayedById }: AdminPanelProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://zeebuild.com'}/runitback/join`

  const copyLink = async () => {
    await navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this player? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await adminFetch(`/api/runitback/players/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <h1 className="rib-heading text-3xl">ADMIN</h1>

      {/* Log new match */}
      <section className="rib-tile rounded-xl p-5">
        <h2 className="rib-heading text-xl mb-4">LOG NEW MATCH</h2>
        <MatchLogForm players={players} />
      </section>

      {/* Manage players */}
      <section className="rib-tile rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="rib-heading text-xl">MANAGE PLAYERS</h2>
          <button
            onClick={() => setAdding((a) => !a)}
            className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg"
            style={{ letterSpacing: '1.5px' }}
          >
            {adding ? 'CLOSE' : 'ADD PLAYER MANUALLY'}
          </button>
        </div>

        {adding && (
          <div className="mb-5 pb-5 border-b border-rib-border">
            <PlayerForm
              onSaved={() => {
                setAdding(false)
                router.refresh()
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className="rib-tile rounded-lg px-4 py-3">
              {editingId === player.id ? (
                <PlayerForm
                  player={player}
                  onSaved={() => {
                    setEditingId(null)
                    router.refresh()
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <p className="rib-heading text-sm">{player.name}</p>
                    <p className="rib-body text-xs">
                      {player.position ?? '—'} · {player.is_regular ? 'Regular' : 'Guest'} ·{' '}
                      {gamesPlayedById[player.id] ?? 0} games
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(player.id)}
                    className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
                    style={{ letterSpacing: '1.5px' }}
                  >
                    <Pencil size={12} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    disabled={deletingId === player.id}
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

      {/* Share registration link */}
      <section className="rib-tile rounded-xl p-5">
        <h2 className="rib-heading text-xl mb-4">SHARE REGISTRATION LINK</h2>
        <p className="rib-body text-sm mb-4">
          Share this in the group chat — players register themselves.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={joinUrl} size={120} />
          </div>
          <div className="flex-1 w-full">
            <div className="flex gap-2">
              <input
                readOnly
                value={joinUrl}
                className="flex-1 bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={copyLink}
                className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg flex items-center gap-1.5"
                style={{ letterSpacing: '1.5px' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED' : 'COPY LINK'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
