'use client'

import { useEffect, useState } from 'react'
import { Loader2, Shuffle, Star } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import type { PlayerStats, Team, WeeklyTeamPlayer } from '@/lib/runitback/types'

interface TeamPickerPanelProps {
  stats: PlayerStats[]
}

type Column = 'pool' | 'A' | 'B'

interface RotationSlot {
  start: number
  end: number
  playerId: string
}

function nextFridayOrTuesday(): string {
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const day = d.getDay() // 0 Sun ... 5 Fri, 2 Tue
    if (day === 5 || day === 2) return d.toISOString().slice(0, 10)
  }
  return today.toISOString().slice(0, 10)
}

export default function TeamPickerPanel({ stats }: TeamPickerPanelProps) {
  const statsById = new Map(stats.map((s) => [s.player.id, s]))
  const [date, setDate] = useState(() => nextFridayOrTuesday())
  const [pool, setPool] = useState<string[]>(stats.map((s) => s.player.id))
  const [teamA, setTeamA] = useState<string[]>([])
  const [teamB, setTeamB] = useState<string[]>([])
  const [gkIds, setGkIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [duration, setDuration] = useState(60)
  const [interval, setIntervalMins] = useState(10)
  const [rotationA, setRotationA] = useState<RotationSlot[] | null>(null)
  const [rotationB, setRotationB] = useState<RotationSlot[] | null>(null)

  useEffect(() => {
    setLoading(true)
    setRotationA(null)
    setRotationB(null)
    fetch(`/api/runitback/teams?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        const entries: WeeklyTeamPlayer[] = data.entries ?? []
        if (entries.length === 0) {
          setPool(stats.map((s) => s.player.id))
          setTeamA([])
          setTeamB([])
          setGkIds(new Set())
          return
        }
        const assigned = new Set(entries.map((e) => e.player_id))
        setTeamA(entries.filter((e) => e.team === 'A').map((e) => e.player_id))
        setTeamB(entries.filter((e) => e.team === 'B').map((e) => e.player_id))
        setPool(stats.map((s) => s.player.id).filter((id) => !assigned.has(id)))
        setGkIds(new Set(entries.filter((e) => e.is_gk).map((e) => e.player_id)))
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const findColumn = (id: string): Column => {
    if (teamA.includes(id)) return 'A'
    if (teamB.includes(id)) return 'B'
    return 'pool'
  }

  const moveTo = (id: string, target: Column) => {
    const from = findColumn(id)
    if (from === target) return
    if (from === 'pool') setPool((p) => p.filter((x) => x !== id))
    if (from === 'A') setTeamA((p) => p.filter((x) => x !== id))
    if (from === 'B') setTeamB((p) => p.filter((x) => x !== id))
    if (target === 'pool') setPool((p) => [...p, id])
    if (target === 'A') setTeamA((p) => [...p, id])
    if (target === 'B') setTeamB((p) => [...p, id])
    if (target === 'pool') setGkIds((s) => { const next = new Set(s); next.delete(id); return next })
  }

  const toggleGk = (id: string) => {
    setGkIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const autoBalance = () => {
    const allIds = [...pool, ...teamA, ...teamB]
    const sorted = [...allIds].sort(
      (a, b) => (statsById.get(b)?.overall ?? 60) - (statsById.get(a)?.overall ?? 60)
    )
    const a: string[] = []
    const b: string[] = []
    let aSum = 0
    let bSum = 0
    for (const id of sorted) {
      const ov = statsById.get(id)?.overall ?? 60
      if (aSum <= bSum) {
        a.push(id)
        aSum += ov
      } else {
        b.push(id)
        bSum += ov
      }
    }
    const gkA = a.find((id) => statsById.get(id)?.player.position === 'GK') ?? a[0]
    const gkB = b.find((id) => statsById.get(id)?.player.position === 'GK') ?? b[0]
    setTeamA(a)
    setTeamB(b)
    setPool([])
    setGkIds(new Set([gkA, gkB].filter(Boolean) as string[]))
    setRotationA(null)
    setRotationB(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const entries = [
        ...teamA.map((id) => ({ player_id: id, team: 'A' as Team, is_gk: gkIds.has(id) })),
        ...teamB.map((id) => ({ player_id: id, team: 'B' as Team, is_gk: gkIds.has(id) })),
      ]
      const res = await adminFetch('/api/runitback/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, entries }),
      })
      if (res.ok) {
        setMessage('Lineup saved.')
      } else {
        const data = await res.json()
        setMessage(data.error ?? 'Something went wrong.')
      }
    } finally {
      setSaving(false)
    }
  }

  const generateRotation = (teamIds: string[]): RotationSlot[] => {
    const slots = Math.max(1, Math.ceil(duration / interval))
    const shuffled = [...teamIds]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const schedule: RotationSlot[] = []
    for (let i = 0; i < slots; i++) {
      const start = i * interval
      const end = Math.min(duration, start + interval)
      schedule.push({ start, end, playerId: shuffled[i % shuffled.length] })
    }
    return schedule
  }

  const handleGenerateRotation = () => {
    if (teamA.length === 0 && teamB.length === 0) return
    setRotationA(teamA.length > 0 ? generateRotation(teamA) : null)
    setRotationB(teamB.length > 0 ? generateRotation(teamB) : null)
  }

  const renderCard = (id: string, column: Column) => {
    const s = statsById.get(id)
    if (!s) return null
    const isGk = gkIds.has(id)
    return (
      <div
        key={id}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
        className="rib-tile rounded-lg px-3 py-2 flex items-center gap-2 cursor-grab active:cursor-grabbing"
      >
        <span className="rib-stat text-sm w-7 text-center text-rib-acc">{s.overall}</span>
        <div className="flex-1 min-w-0">
          <p className="rib-heading text-xs truncate">{s.player.nickname || s.player.name}</p>
          <p className="rib-body text-[10px] text-rib-muted">{s.player.position ?? '—'}</p>
        </div>
        {column !== 'pool' && (
          <button
            type="button"
            onClick={() => toggleGk(id)}
            title="Toggle GK for this match"
            className={isGk ? 'text-[#e8c547]' : 'text-rib-muted hover:text-white'}
          >
            <Star size={16} fill={isGk ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
    )
  }

  const renderColumn = (label: string, ids: string[], column: Column, totalLabel?: string) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const id = e.dataTransfer.getData('text/plain')
        if (id) moveTo(id, column)
      }}
      className="rib-tile rounded-xl p-3 min-h-[200px]"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>
          {label}
        </h3>
        {totalLabel && <span className="rib-stat text-xs text-rib-acc">{totalLabel}</span>}
      </div>
      <div className="space-y-2">{ids.map((id) => renderCard(id, column))}</div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  const sumOverall = (ids: string[]) =>
    ids.reduce((sum, id) => sum + (statsById.get(id)?.overall ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            MATCH DATE
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
          />
        </div>
        <button
          type="button"
          onClick={autoBalance}
          className="rib-heading text-xs px-4 py-2.5 rounded-lg bg-rib-acc text-rib-bg flex items-center gap-1.5"
          style={{ letterSpacing: '1.5px' }}
        >
          <Shuffle size={14} /> AUTO-BALANCE
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rib-heading text-xs px-4 py-2.5 rounded-lg border border-rib-acc text-rib-acc disabled:opacity-50"
          style={{ letterSpacing: '1.5px' }}
        >
          {saving ? 'SAVING...' : 'SAVE LINEUP'}
        </button>
        {message && <span className="rib-body text-xs text-rib-muted">{message}</span>}
      </div>

      <p className="rib-body text-xs text-rib-muted">
        Drag players between columns to set up the lineup. Click the star to mark a player&apos;s
        starting GK for this match.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderColumn('AVAILABLE', pool, 'pool')}
        {renderColumn('TEAM A', teamA, 'A', teamA.length ? `OVR ${Math.round(sumOverall(teamA) / teamA.length)}` : undefined)}
        {renderColumn('TEAM B', teamB, 'B', teamB.length ? `OVR ${Math.round(sumOverall(teamB) / teamB.length)}` : undefined)}
      </div>

      {/* GK rotation */}
      <div className="rib-tile rounded-xl p-5 space-y-4">
        <h2 className="rib-heading text-xl">GK ROTATION</h2>
        <p className="rib-body text-xs text-rib-muted">
          Generate a goalkeeping rotation for the match — every player in a team takes a turn in
          goal for the chosen interval.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
              MATCH LENGTH (MIN)
            </label>
            <input
              type="number"
              min={interval}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              className="w-28 bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm rib-stat focus:outline-none focus:border-rib-acc"
            />
          </div>
          <div>
            <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
              INTERVAL (MIN)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={interval}
              onChange={(e) => setIntervalMins(Math.max(1, Number(e.target.value)))}
              className="w-28 bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm rib-stat focus:outline-none focus:border-rib-acc"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateRotation}
            disabled={teamA.length === 0 && teamB.length === 0}
            className="rib-heading text-xs px-4 py-2.5 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
            style={{ letterSpacing: '1.5px' }}
          >
            GENERATE
          </button>
        </div>

        {(rotationA || rotationB) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'TEAM A', schedule: rotationA },
              { label: 'TEAM B', schedule: rotationB },
            ].map(({ label, schedule }) =>
              schedule ? (
                <div key={label} className="rib-tile rounded-lg overflow-hidden">
                  <div className="px-4 py-2 border-b border-rib-border">
                    <h3 className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>{label} GK SCHEDULE</h3>
                  </div>
                  <div className="divide-y divide-rib-border">
                    {schedule.map((slot, i) => {
                      const s = statsById.get(slot.playerId)
                      return (
                        <div key={i} className="flex items-center justify-between px-4 py-2">
                          <span className="rib-body text-xs text-rib-muted">
                            {slot.start}&apos;–{slot.end}&apos;
                          </span>
                          <span className="rib-heading text-xs">{s?.player.nickname || s?.player.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  )
}
