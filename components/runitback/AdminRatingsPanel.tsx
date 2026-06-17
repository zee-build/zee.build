'use client'

import { useEffect, useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import { RATING_ATTRIBUTES } from '@/lib/runitback/config'
import type { RatingAttribute } from '@/lib/runitback/types'

interface RatingRow {
  id: string
  season: number
  rater_id: string
  ratee_id: string
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  created_at: string
}

interface PlayerLite {
  id: string
  name: string
  nickname: string | null
}

function avgOf(r: RatingRow): number {
  return (r.pace + r.shooting + r.passing + r.dribbling + r.defending + r.physical) / 6
}

export default function AdminRatingsPanel() {
  const [ratings, setRatings] = useState<RatingRow[] | null>(null)
  const [players, setPlayers] = useState<PlayerLite[]>([])
  const [season, setSeason] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<RatingAttribute, number>>({
    pace: 5,
    shooting: 5,
    passing: 5,
    dribbling: 5,
    defending: 5,
    physical: 5,
  })
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
        setRatings(data.ratings ?? [])
        setPlayers(data.players ?? [])
      })
      .catch(() => setError('Could not load ratings.'))
  }

  useEffect(load, [])

  const nameFor = (id: string) => {
    const p = players.find((pl) => pl.id === id)
    return p ? p.name : 'Unknown'
  }

  const handleSave = async (id: string) => {
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/ratings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editValues }),
      })
      if (res.ok) {
        setRatings((prev) =>
          prev ? prev.map((r) => (r.id === id ? { ...r, ...editValues } : r)) : prev
        )
        setEditingId(null)
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rating?')) return
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/ratings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setRatings((prev) => (prev ? prev.filter((r) => r.id !== id) : prev))
      }
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <p className="rib-body text-red-400 text-sm">{error}</p>
  if (ratings === null) return <p className="rib-body text-sm">Loading...</p>

  if (ratings.length === 0) {
    return <p className="rib-body text-sm">No ratings submitted yet for SEASON {season}.</p>
  }

  // group by ratee
  const byRatee = new Map<string, RatingRow[]>()
  for (const r of ratings) {
    const list = byRatee.get(r.ratee_id) ?? []
    list.push(r)
    byRatee.set(r.ratee_id, list)
  }

  return (
    <div className="space-y-4">
      {[...byRatee.entries()].map(([rateeId, rows]) => {
        const avg = rows.reduce((sum, r) => sum + avgOf(r), 0) / rows.length
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
                <div key={r.id} className="text-sm">
                  <div className="flex items-center gap-3">
                    <span className="rib-body flex-1 min-w-0 truncate">{nameFor(r.rater_id)}</span>
                    <span className="rib-stat text-base w-10 text-center">{avgOf(r).toFixed(1)}</span>
                    {editingId === r.id ? (
                      <>
                        <button
                          onClick={() => handleSave(r.id)}
                          disabled={busyId === r.id}
                          className="text-rib-acc disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-rib-muted">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(r.id)
                            setEditValues({
                              pace: r.pace,
                              shooting: r.shooting,
                              passing: r.passing,
                              dribbling: r.dribbling,
                              defending: r.defending,
                              physical: r.physical,
                            })
                          }}
                          className="text-rib-muted hover:text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={busyId === r.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  {editingId === r.id && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pl-1">
                      {RATING_ATTRIBUTES.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-1.5 text-xs">
                          <span className="rib-body text-rib-muted w-16">{label}</span>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={editValues[key]}
                            onChange={(e) =>
                              setEditValues((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                            }
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
        )
      })}
    </div>
  )
}
