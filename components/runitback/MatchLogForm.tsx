'use client'

import { useMemo, useState } from 'react'
import { adminFetch } from '@/lib/runitback/admin'
import type { DayOfWeek, Player, Team } from '@/lib/runitback/types'

interface RosterRow {
  playerId: string
  team: Team
  goals: number
  assists: number
  isMotm: boolean
}

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'Friday', label: 'FRIDAY' },
  { value: 'Tuesday', label: 'TUESDAY' },
]

export default function MatchLogForm({ players }: { players: Player[] }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Friday')
  const [location, setLocation] = useState('Muweilah')
  const [notes, setNotes] = useState('')
  const [roster, setRoster] = useState<RosterRow[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [scoreOverride, setScoreOverride] = useState<{ a: number | null; b: number | null }>({
    a: null,
    b: null,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const availablePlayers = players.filter((p) => !roster.some((r) => r.playerId === p.id))

  const autoScores = useMemo(() => {
    const a = roster.filter((r) => r.team === 'A').reduce((sum, r) => sum + r.goals, 0)
    const b = roster.filter((r) => r.team === 'B').reduce((sum, r) => sum + r.goals, 0)
    return { a, b }
  }, [roster])

  const teamAScore = scoreOverride.a ?? autoScores.a
  const teamBScore = scoreOverride.b ?? autoScores.b

  const addPlayer = () => {
    if (!selectedPlayer) return
    setRoster((prev) => [
      ...prev,
      { playerId: selectedPlayer, team: 'A', goals: 0, assists: 0, isMotm: false },
    ])
    setSelectedPlayer('')
  }

  const updateRow = (playerId: string, patch: Partial<RosterRow>) => {
    setRoster((prev) => prev.map((r) => (r.playerId === playerId ? { ...r, ...patch } : r)))
  }

  const removeRow = (playerId: string) => {
    setRoster((prev) => prev.filter((r) => r.playerId !== playerId))
  }

  const reset = () => {
    setDate(new Date().toISOString().slice(0, 10))
    setDayOfWeek('Friday')
    setLocation('Muweilah')
    setNotes('')
    setRoster([])
    setScoreOverride({ a: null, b: null })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (roster.length === 0) {
      setError('Add at least one player.')
      return
    }

    setSubmitting(true)
    try {
      const res = await adminFetch('/api/runitback/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          day_of_week: dayOfWeek,
          location,
          notes: notes.trim() || null,
          team_a_score: teamAScore,
          team_b_score: teamBScore,
          players: roster.map((r) => ({
            player_id: r.playerId,
            team: r.team,
            goals: r.goals,
            assists: r.assists,
            is_motm: r.isMotm,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rib-tile rounded-xl p-8 text-center">
        <h2 className="rib-heading text-2xl mb-2 text-rib-acc">MATCH LOGGED!</h2>
        <p className="rib-body text-sm mb-4">The result has been added to the season.</p>
        <button
          onClick={() => {
            reset()
            setSuccess(false)
          }}
          className="rib-heading text-sm px-5 py-2.5 rounded-lg bg-rib-acc text-rib-bg"
          style={{ letterSpacing: '2px' }}
        >
          LOG ANOTHER MATCH
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            DATE
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
          />
        </div>
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            DAY
          </label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => setDayOfWeek(day.value)}
                className={`flex-1 rib-heading text-xs py-2 rounded-lg border transition-colors ${
                  dayOfWeek === day.value ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            LOCATION
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
          />
        </div>
      </div>

      <div>
        <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
          ADD PLAYER
        </label>
        <div className="flex gap-2">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="flex-1 bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
          >
            <option value="">Select a player...</option>
            {availablePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addPlayer}
            disabled={!selectedPlayer}
            className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
            style={{ letterSpacing: '1.5px' }}
          >
            ADD
          </button>
        </div>
      </div>

      {roster.length > 0 && (
        <div className="space-y-2">
          {roster.map((row) => {
            const player = players.find((p) => p.id === row.playerId)!
            return (
              <div
                key={row.playerId}
                className="flex flex-wrap items-center gap-2 rib-tile rounded-lg px-3 py-2"
              >
                <span className="rib-heading text-sm flex-1 min-w-[100px]">{player.name}</span>
                <div className="flex gap-1">
                  {(['A', 'B'] as Team[]).map((team) => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => updateRow(row.playerId, { team })}
                      className={`rib-heading text-xs w-9 py-1.5 rounded border transition-colors ${
                        row.team === team ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={0}
                  value={row.goals}
                  onChange={(e) => updateRow(row.playerId, { goals: Number(e.target.value) })}
                  placeholder="GOL"
                  className="w-16 bg-rib-bg2 border border-rib-border rounded px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-rib-acc"
                />
                <input
                  type="number"
                  min={0}
                  value={row.assists}
                  onChange={(e) => updateRow(row.playerId, { assists: Number(e.target.value) })}
                  placeholder="AST"
                  className="w-16 bg-rib-bg2 border border-rib-border rounded px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-rib-acc"
                />
                <label className="flex items-center gap-1.5 rib-heading text-xs text-rib-muted">
                  <input
                    type="checkbox"
                    checked={row.isMotm}
                    onChange={(e) => updateRow(row.playerId, { isMotm: e.target.checked })}
                  />
                  MOTM
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(row.playerId)}
                  className="rib-heading text-xs text-red-400 px-2"
                >
                  REMOVE
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-w-xs">
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            TEAM A SCORE
          </label>
          <input
            type="number"
            min={0}
            value={teamAScore}
            onChange={(e) => setScoreOverride((s) => ({ ...s, a: Number(e.target.value) }))}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm rib-stat focus:outline-none focus:border-rib-acc"
          />
        </div>
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            TEAM B SCORE
          </label>
          <input
            type="number"
            min={0}
            value={teamBScore}
            onChange={(e) => setScoreOverride((s) => ({ ...s, b: Number(e.target.value) }))}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm rib-stat focus:outline-none focus:border-rib-acc"
          />
        </div>
      </div>

      <div>
        <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
          NOTES (OPTIONAL)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
        />
      </div>

      {error && <p className="rib-body text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rib-heading text-sm px-6 py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
        style={{ letterSpacing: '2px' }}
      >
        {submitting ? 'SAVING...' : 'SUBMIT MATCH'}
      </button>
    </form>
  )
}
