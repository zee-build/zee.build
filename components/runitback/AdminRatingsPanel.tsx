'use client'

import { useEffect, useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import { RATING_ATTRIBUTES, windowLabel } from '@/lib/runitback/config'
import type { RatingAttribute } from '@/lib/runitback/types'

interface MatchRatingRow {
  id: string
  rater_id: string
  ratee_id: string
  score: number
}

interface AttributeRatingRow {
  id: string
  rating_window: string
  rater_id: string
  ratee_id: string
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  goalkeeping: number | null
}

interface PlayerLite {
  id: string
  name: string
  nickname: string | null
}

const EMPTY_ATTRS: Record<RatingAttribute, number> = {
  pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50,
}

export default function AdminRatingsPanel() {
  const [tab, setTab] = useState<'match' | 'attribute'>('match')
  const [matchRatings, setMatchRatings] = useState<MatchRatingRow[] | null>(null)
  const [attributeRatings, setAttributeRatings] = useState<AttributeRatingRow[]>([])
  const [players, setPlayers] = useState<PlayerLite[]>([])
  const [season, setSeason] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editScore, setEditScore] = useState(5)
  const [editAttrs, setEditAttrs] = useState<Record<RatingAttribute, number>>(EMPTY_ATTRS)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    adminFetch('/api/runitback/admin/ratings')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setSeason(data.season)
        setMatchRatings(data.matchRatings ?? [])
        setAttributeRatings(data.attributeRatings ?? [])
        setPlayers(data.players ?? [])
      })
      .catch(() => setError('Could not load ratings.'))
  }

  useEffect(load, [])

  const nameFor = (id: string) => players.find((pl) => pl.id === id)?.name ?? 'Unknown'

  const saveMatch = async (id: string) => {
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/ratings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'match', score: editScore }),
      })
      if (res.ok) {
        setMatchRatings((prev) => prev?.map((r) => (r.id === id ? { ...r, score: editScore } : r)) ?? prev)
        setEditingId(null)
      }
    } finally {
      setBusyId(null)
    }
  }

  const saveAttribute = async (id: string) => {
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/ratings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'attribute', ...editAttrs }),
      })
      if (res.ok) {
        setAttributeRatings((prev) => prev.map((r) => (r.id === id ? { ...r, ...editAttrs } : r)))
        setEditingId(null)
      }
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string, type: 'match' | 'attribute') => {
    if (!confirm('Delete this rating?')) return
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/ratings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      if (res.ok) {
        if (type === 'match') setMatchRatings((prev) => prev?.filter((r) => r.id !== id) ?? prev)
        else setAttributeRatings((prev) => prev.filter((r) => r.id !== id))
      }
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <p className="rib-body text-red-400 text-sm">{error}</p>
  if (matchRatings === null) return <p className="rib-body text-sm">Loading...</p>

  const tabBtn = (key: 'match' | 'attribute', label: string) => (
    <button
      onClick={() => { setTab(key); setEditingId(null) }}
      className="rib-heading text-xs px-3 py-1.5 rounded-lg"
      style={{
        letterSpacing: '1.5px',
        background: tab === key ? 'var(--acc)' : 'rgba(255,255,255,0.05)',
        color: tab === key ? 'var(--bg)' : 'var(--muted)',
      }}
    >
      {label}
    </button>
  )

  // ── Match ratings grouped by ratee ──────────────────────────────────
  const matchByRatee = new Map<string, MatchRatingRow[]>()
  for (const r of matchRatings) {
    const list = matchByRatee.get(r.ratee_id) ?? []
    list.push(r)
    matchByRatee.set(r.ratee_id, list)
  }

  // ── Attribute ratings grouped by ratee ──────────────────────────────
  const attrByRatee = new Map<string, AttributeRatingRow[]>()
  for (const r of attributeRatings) {
    const list = attrByRatee.get(r.ratee_id) ?? []
    list.push(r)
    attrByRatee.set(r.ratee_id, list)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {tabBtn('match', `MATCH RATINGS (${matchRatings.length})`)}
        {tabBtn('attribute', `ATTRIBUTES (${attributeRatings.length})`)}
      </div>

      {tab === 'match' && (
        matchRatings.length === 0 ? (
          <p className="rib-body text-sm">No match ratings yet for SEASON {season}.</p>
        ) : (
          [...matchByRatee.entries()].map(([rateeId, rows]) => {
            const avg = rows.reduce((s, r) => s + r.score, 0) / rows.length
            return (
              <div key={rateeId} className="rib-tile rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="rib-heading text-sm">{nameFor(rateeId)}</p>
                  <p className="rib-body text-xs text-rib-muted">
                    {rows.length} rating{rows.length === 1 ? '' : 's'} · avg {avg.toFixed(1)}
                  </p>
                </div>
                <div className="space-y-2">
                  {rows.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 text-sm">
                      <span className="rib-body flex-1 min-w-0 truncate">{nameFor(r.rater_id)}</span>
                      {editingId === r.id ? (
                        <>
                          <input
                            type="number" min={1} max={10} value={editScore}
                            onChange={(e) => setEditScore(Number(e.target.value))}
                            className="w-14 bg-rib-bg2 border border-rib-border rounded-lg px-2 py-1 text-white text-center"
                          />
                          <button onClick={() => saveMatch(r.id)} disabled={busyId === r.id} className="text-rib-acc disabled:opacity-50"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-rib-muted"><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <span className="rib-stat text-base w-10 text-center">{r.score}</span>
                          <button onClick={() => { setEditingId(r.id); setEditScore(r.score) }} className="text-rib-muted hover:text-white"><Pencil size={14} /></button>
                          <button onClick={() => remove(r.id, 'match')} disabled={busyId === r.id} className="text-red-400 hover:text-red-300 disabled:opacity-50"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )
      )}

      {tab === 'attribute' && (
        attributeRatings.length === 0 ? (
          <p className="rib-body text-sm">No attribute ratings yet for SEASON {season}.</p>
        ) : (
          [...attrByRatee.entries()].map(([rateeId, rows]) => (
            <div key={rateeId} className="rib-tile rounded-lg p-4">
              <p className="rib-heading text-sm mb-2">{nameFor(rateeId)}</p>
              <div className="space-y-2">
                {rows.map((r) => (
                  <div key={r.id} className="text-sm">
                    <div className="flex items-center gap-3">
                      <span className="rib-body flex-1 min-w-0 truncate">
                        {nameFor(r.rater_id)}
                        <span className="text-rib-muted text-xs"> · {windowLabel(r.rating_window)}</span>
                      </span>
                      {editingId === r.id ? (
                        <>
                          <button onClick={() => saveAttribute(r.id)} disabled={busyId === r.id} className="text-rib-acc disabled:opacity-50"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-rib-muted"><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <span className="rib-stat text-xs text-rib-muted">
                            {RATING_ATTRIBUTES.map((a) => r[a.key]).join(' / ')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(r.id)
                              setEditAttrs({
                                pace: r.pace, shooting: r.shooting, passing: r.passing,
                                dribbling: r.dribbling, defending: r.defending, physical: r.physical,
                              })
                            }}
                            className="text-rib-muted hover:text-white"
                          >
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => remove(r.id, 'attribute')} disabled={busyId === r.id} className="text-red-400 hover:text-red-300 disabled:opacity-50"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                    {editingId === r.id && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pl-1">
                        {RATING_ATTRIBUTES.map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-1.5 text-xs">
                            <span className="rib-body text-rib-muted w-16">{label}</span>
                            <input
                              type="number" min={1} max={99} value={editAttrs[key]}
                              onChange={(e) => setEditAttrs((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                              className="w-14 bg-rib-bg2 border border-rib-border rounded-lg px-2 py-1 text-white text-center"
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      )}
    </div>
  )
}
