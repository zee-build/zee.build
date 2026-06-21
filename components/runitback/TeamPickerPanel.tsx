'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Shuffle, RefreshCw, Star, Share2, UserPlus, CalendarPlus } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import TeamExportSheet from './TeamExportSheet'
import type { Player, PlayerStats, PlayerTier, Team, WeeklyTeamPlayer } from '@/lib/runitback/types'

const POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']

interface TeamPickerPanelProps {
  stats: PlayerStats[]
}

type Column = 'bench' | 'tier1' | 'tier2' | 'tier3' | 'A' | 'B'

interface RotationSlot {
  start: number
  end: number
  playerId: string
}

const FORMAT_OPTIONS = [
  { label: '5v5', size: 5, subs: 2 },
  { label: '6v6', size: 6, subs: 2 },
  { label: '7v7', size: 7, subs: 2 },
  { label: '8v8', size: 8, subs: 3 },
  { label: '9v9', size: 9, subs: 3 },
]

function nextFridayOrTuesday(): string {
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const day = d.getDay()
    if (day === 5 || day === 2) return d.toISOString().slice(0, 10)
  }
  return today.toISOString().slice(0, 10)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TeamPickerPanel({ stats: initialStats }: TeamPickerPanelProps) {
  const [localStats, setLocalStats] = useState<PlayerStats[]>(initialStats)
  const statsById = new Map(localStats.map((s) => [s.player.id, s]))

  const [date, setDate] = useState(() => nextFridayOrTuesday())
  const [formatIdx, setFormatIdx] = useState(0)
  const format = FORMAT_OPTIONS[formatIdx]

  // Bench = not playing today; tiers 1/2/3 = in the pool; A/B = assigned teams
  const [bench, setBench] = useState<string[]>([])
  const [tier1, setTier1] = useState<string[]>([])
  const [tier2, setTier2] = useState<string[]>([])
  const [tier3, setTier3] = useState<string[]>([])
  const [teamA, setTeamA] = useState<string[]>([])
  const [teamB, setTeamB] = useState<string[]>([])
  const [gkIds, setGkIds] = useState<Set<string>>(new Set())
  const [subIds, setSubIds] = useState<Set<string>>(new Set())

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // GK rotation
  const [showExport, setShowExport] = useState(false)
  const [gkRotationOn, setGkRotationOn] = useState(false)
  const [duration, setDuration] = useState(60)
  const [intervalMins, setIntervalMins] = useState(10)
  const [rotationA, setRotationA] = useState<RotationSlot[] | null>(null)
  const [rotationB, setRotationB] = useState<RotationSlot[] | null>(null)

  // Add guest player
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [addName, setAddName] = useState('')
  const [addPosition, setAddPosition] = useState('CM')
  const [addingPlayer, setAddingPlayer] = useState(false)
  const [addPlayerError, setAddPlayerError] = useState('')

  // Log match
  const [showLogMatch, setShowLogMatch] = useState(false)
  const [matchLocation, setMatchLocation] = useState('Sharjah')
  const [loggingMatch, setLoggingMatch] = useState(false)
  const [matchMessage, setMatchMessage] = useState('')

  const dragRef = useRef<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setRotationA(null)
    setRotationB(null)
    fetch(`/api/runitback/teams?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        const entries: WeeklyTeamPlayer[] = data.entries ?? []
        if (entries.length === 0) {
          // Default: all players in tier2 (unassigned), none benched
          autoTierAll(localStats.map((s) => s.player.id))
          setTeamA([])
          setTeamB([])
          setGkIds(new Set())
          setSubIds(new Set())
          return
        }
        const assigned = new Set(entries.map((e) => e.player_id))
        setTeamA(entries.filter((e) => e.team === 'A').map((e) => e.player_id))
        setTeamB(entries.filter((e) => e.team === 'B').map((e) => e.player_id))
        setBench(localStats.map((s) => s.player.id).filter((id) => !assigned.has(id)))
        setTier1([])
        setTier2([])
        setTier3([])
        setGkIds(new Set(entries.filter((e) => e.is_gk).map((e) => e.player_id)))
        const loadedSubIds = new Set(entries.filter((e) => e.is_sub).map((e) => e.player_id))
        setSubIds(loadedSubIds)
        // Auto-detect format from saved starters count
        const startersA = entries.filter((e) => e.team === 'A' && !loadedSubIds.has(e.player_id)).length
        if (startersA > 0) {
          const matchedIdx = FORMAT_OPTIONS.findIndex((f) => f.size === startersA)
          if (matchedIdx !== -1) setFormatIdx(matchedIdx)
        }
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  function autoTierAll(ids: string[]) {
    const sorted = [...ids].sort(
      (a, b) => (statsById.get(b)?.overall ?? 60) - (statsById.get(a)?.overall ?? 60)
    )
    const size = Math.ceil(sorted.length / 3)
    setTier1(sorted.slice(0, size))
    setTier2(sorted.slice(size, size * 2))
    setTier3(sorted.slice(size * 2))
    setBench([])
  }

  const findColumn = (id: string): Column => {
    if (teamA.includes(id)) return 'A'
    if (teamB.includes(id)) return 'B'
    if (tier1.includes(id)) return 'tier1'
    if (tier2.includes(id)) return 'tier2'
    if (tier3.includes(id)) return 'tier3'
    return 'bench'
  }

  const setterFor = (col: Column) => {
    const map: Record<Column, React.Dispatch<React.SetStateAction<string[]>>> = {
      bench: setBench,
      tier1: setTier1,
      tier2: setTier2,
      tier3: setTier3,
      A: setTeamA,
      B: setTeamB,
    }
    return map[col]
  }

  const moveTo = (id: string, target: Column) => {
    const from = findColumn(id)
    if (from === target) return
    setterFor(from)((p) => p.filter((x) => x !== id))
    setterFor(target)((p) => [...p, id])
    if (target === 'bench') {
      setGkIds((s) => { const n = new Set(s); n.delete(id); return n })
      setSubIds((s) => { const n = new Set(s); n.delete(id); return n })
    }
  }

  const toggleGk = (id: string) => {
    setGkIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSub = (id: string) => {
    setSubIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddPlayer = async () => {
    if (!addName.trim()) return
    setAddPlayerError('')
    setAddingPlayer(true)
    try {
      const res = await adminFetch('/api/runitback/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName.trim(), position: addPosition, is_regular: false, registered_via_link: false }),
      })
      const data = await res.json()
      if (!res.ok) { setAddPlayerError(data.error ?? 'Could not add player.'); return }
      const newPlayer: Player = data.player
      const newStat: PlayerStats = {
        player: newPlayer, overall: 60, games: 0, goals: 0, assists: 0, motm: 0,
        wins: 0, losses: 0, draws: 0, winRate: 0, streak: 0, form: [],
        goalsPerGame: 0, communityRating: null, communityRatingCount: 0,
        attributeRatings: null, gkRating: null, awardsEligible: false, seasonAward: null, weeklyAward: null,
        hasPendingRatings: false,
      }
      setLocalStats((prev) => [...prev, newStat])
      setTier2((prev) => [...prev, newPlayer.id])
      setAddName('')
      setAddPosition('CM')
      setShowAddPlayer(false)
    } catch { setAddPlayerError('Something went wrong.') }
    finally { setAddingPlayer(false) }
  }

  const handleLogMatch = async () => {
    if (teamA.length === 0 && teamB.length === 0) return
    setLoggingMatch(true)
    setMatchMessage('')
    const d = new Date(date)
    const dow = d.getDay()
    const day_of_week = dow === 5 ? 'Friday' : dow === 2 ? 'Tuesday' : 'Friday'
    const players = [
      ...teamA.map((id) => ({ player_id: id, team: 'A' })),
      ...teamB.map((id) => ({ player_id: id, team: 'B' })),
    ]
    try {
      const res = await adminFetch('/api/runitback/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, day_of_week, location: matchLocation, team_a_score: 0, team_b_score: 0, players }),
      })
      const data = await res.json()
      if (!res.ok) { setMatchMessage(data.error ?? 'Could not create match.'); return }
      setMatchMessage(`Match created! Update the score in Admin after the game.`)
      setShowLogMatch(false)
    } catch { setMatchMessage('Something went wrong.') }
    finally { setLoggingMatch(false) }
  }

  const generateFromTiers = () => {
    const poolIds = [...tier1, ...tier2, ...tier3]
    if (poolIds.length === 0) return

    const t1 = shuffle(tier1)
    const t2 = shuffle(tier2)
    const t3 = shuffle(tier3)

    const a: string[] = []
    const b: string[] = []

    // Snake draft: pick from each tier alternating A/B
    const pickTier = (tierIds: string[]) => {
      for (let i = 0; i < tierIds.length; i++) {
        // Balance: whichever team has fewer players gets next pick
        const pick = a.length <= b.length ? 'a' : 'b'
        if (pick === 'a') a.push(tierIds[i])
        else b.push(tierIds[i])
      }
    }

    pickTier(t1)
    pickTier(t2)
    pickTier(t3)

    // Mark subs based on format
    const newSubIds = new Set<string>()
    const startersA = a.slice(0, format.size)
    const subsA = a.slice(format.size)
    const startersB = b.slice(0, format.size)
    const subsB = b.slice(format.size)
    for (const id of [...subsA, ...subsB]) newSubIds.add(id)

    setTeamA(a)
    setTeamB(b)
    setTier1([])
    setTier2([])
    setTier3([])
    setBench(localStats.map((s) => s.player.id).filter((id) => !a.includes(id) && !b.includes(id)))
    setSubIds(newSubIds)

    // Auto-assign GKs from starters
    const gkA = startersA.find((id) => statsById.get(id)?.player.position === 'GK') ?? startersA[0]
    const gkB = startersB.find((id) => statsById.get(id)?.player.position === 'GK') ?? startersB[0]
    setGkIds(new Set([gkA, gkB].filter(Boolean) as string[]))
    setRotationA(null)
    setRotationB(null)
  }

  const autoBalance = () => {
    const allIds = [...bench, ...tier1, ...tier2, ...tier3, ...teamA, ...teamB]
    const sorted = [...allIds].sort(
      (a, b) => (statsById.get(b)?.overall ?? 60) - (statsById.get(a)?.overall ?? 60)
    )
    const a: string[] = []
    const b: string[] = []
    let aSum = 0; let bSum = 0
    for (const id of sorted) {
      const ov = statsById.get(id)?.overall ?? 60
      if (aSum <= bSum) { a.push(id); aSum += ov }
      else { b.push(id); bSum += ov }
    }

    const newSubIds = new Set<string>()
    a.slice(format.size).forEach((id) => newSubIds.add(id))
    b.slice(format.size).forEach((id) => newSubIds.add(id))

    setTeamA(a)
    setTeamB(b)
    setTier1([]); setTier2([]); setTier3([]); setBench([])
    setSubIds(newSubIds)

    const gkA = a.slice(0, format.size).find((id) => statsById.get(id)?.player.position === 'GK') ?? a[0]
    const gkB = b.slice(0, format.size).find((id) => statsById.get(id)?.player.position === 'GK') ?? b[0]
    setGkIds(new Set([gkA, gkB].filter(Boolean) as string[]))
    setRotationA(null)
    setRotationB(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const entries = [
        ...teamA.map((id) => ({ player_id: id, team: 'A' as Team, is_gk: gkIds.has(id), is_sub: subIds.has(id) })),
        ...teamB.map((id) => ({ player_id: id, team: 'B' as Team, is_gk: gkIds.has(id), is_sub: subIds.has(id) })),
      ]
      const res = await adminFetch('/api/runitback/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, entries }),
      })
      if (res.ok) setMessage(`Saved! Select ${date} again to reload this lineup.`)
      else {
        const data = await res.json()
        setMessage(data.error ?? 'Something went wrong.')
      }
    } finally {
      setSaving(false)
    }
  }

  const generateRotation = (teamIds: string[]): RotationSlot[] => {
    const starters = teamIds.filter((id) => !subIds.has(id))
    const slots = Math.max(1, Math.ceil(duration / intervalMins))
    const shuffled = shuffle(starters)
    return Array.from({ length: slots }, (_, i) => ({
      start: i * intervalMins,
      end: Math.min(duration, (i + 1) * intervalMins),
      playerId: shuffled[i % shuffled.length],
    }))
  }

  const handleGenerateRotation = () => {
    if (teamA.length === 0 && teamB.length === 0) return
    setRotationA(teamA.length > 0 ? generateRotation(teamA) : null)
    setRotationB(teamB.length > 0 ? generateRotation(teamB) : null)
  }

  const sumOverall = (ids: string[]) =>
    ids.reduce((sum, id) => sum + (statsById.get(id)?.overall ?? 0), 0)

  const avgOverall = (ids: string[]) =>
    ids.length ? Math.round(sumOverall(ids) / ids.length) : 0

  const tierColor: Record<PlayerTier, string> = {
    1: '#e8c547',
    2: '#c0c0c0',
    3: '#cd7f32',
  }
  const tierLabel: Record<PlayerTier, string> = {
    1: 'ELITE',
    2: 'AVG',
    3: 'REST',
  }

  const renderCard = (id: string, col: Column) => {
    const s = statsById.get(id)
    if (!s) return null
    const isGk = gkIds.has(id)
    const isSub = subIds.has(id)
    const inTeam = col === 'A' || col === 'B'

    return (
      <div
        key={id}
        draggable
        onDragStart={() => { dragRef.current = id }}
        className={`rib-tile rounded-lg px-3 py-2 flex items-center gap-2 cursor-grab active:cursor-grabbing transition-opacity ${isSub ? 'opacity-60' : ''}`}
      >
        <span className="rib-stat text-sm w-7 text-center text-rib-acc">{s.overall}</span>
        <div className="flex-1 min-w-0">
          <p className="rib-heading text-xs truncate">{s.player.name}</p>
          <p className="rib-body text-[10px] text-rib-muted">{s.player.position ?? '—'}</p>
        </div>
        {inTeam && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleSub(id)}
              title={isSub ? 'Move to starters' : 'Mark as sub'}
              className={`text-xs font-bold px-1 rounded ${isSub ? 'text-[#e8c547]' : 'text-rib-muted hover:text-white'}`}
            >
              SUB
            </button>
            <button
              type="button"
              onClick={() => toggleGk(id)}
              title="Toggle GK"
              className={isGk ? 'text-[#e8c547]' : 'text-rib-muted hover:text-white'}
            >
              <Star size={14} fill={isGk ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderDropZone = (label: string, ids: string[], col: Column, accent?: string, extra?: React.ReactNode) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const id = dragRef.current
        if (id) moveTo(id, col)
      }}
      className="rib-tile rounded-xl p-3 min-h-[120px]"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <h3
          className="rib-heading text-xs"
          style={{ letterSpacing: '2px', color: accent ?? 'var(--rib-muted)' }}
        >
          {label}
        </h3>
        {extra}
      </div>
      <div className="space-y-1.5">{ids.map((id) => renderCard(id, col))}</div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  const inPool = tier1.length + tier2.length + tier3.length > 0
  const hasTeams = teamA.length > 0 || teamB.length > 0

  return (
    <div className="space-y-6">
      {/* ── Controls row ── */}
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

        {/* Format picker */}
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            FORMAT
          </label>
          <div className="flex rounded-lg overflow-hidden border border-rib-border">
            {FORMAT_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setFormatIdx(i)}
                className={`rib-heading text-xs px-3 py-2 transition-colors ${
                  i === formatIdx
                    ? 'bg-rib-acc text-rib-bg'
                    : 'bg-rib-bg2 text-rib-muted hover:text-white'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => autoTierAll(localStats.map((s) => s.player.id))}
            className="rib-heading text-xs px-3 py-2.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
            style={{ letterSpacing: '1.5px' }}
          >
            <RefreshCw size={13} /> AUTO-TIER
          </button>
          <button
            type="button"
            onClick={() => { setShowAddPlayer((v) => !v); setAddPlayerError('') }}
            className="rib-heading text-xs px-3 py-2.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
            style={{ letterSpacing: '1.5px' }}
          >
            <UserPlus size={13} /> ADD GUEST
          </button>
          {inPool && (
            <button
              type="button"
              onClick={generateFromTiers}
              className="rib-heading text-xs px-3 py-2.5 rounded-lg bg-rib-acc text-rib-bg flex items-center gap-1.5"
              style={{ letterSpacing: '1.5px' }}
            >
              <Shuffle size={13} /> GENERATE TEAMS
            </button>
          )}
          {hasTeams && (
            <button
              type="button"
              onClick={autoBalance}
              className="rib-heading text-xs px-3 py-2.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
              style={{ letterSpacing: '1.5px' }}
            >
              <Shuffle size={13} /> RE-BALANCE
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rib-heading text-xs px-4 py-2.5 rounded-lg border border-rib-acc text-rib-acc disabled:opacity-50"
            style={{ letterSpacing: '1.5px' }}
          >
            {saving ? 'SAVING...' : 'SAVE LINEUP'}
          </button>
          {hasTeams && (
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="rib-heading text-xs px-4 py-2.5 rounded-lg bg-rib-acc/10 border border-rib-acc/40 text-rib-acc hover:bg-rib-acc/20 flex items-center gap-1.5 transition-colors"
              style={{ letterSpacing: '1.5px' }}
            >
              <Share2 size={13} /> EXPORT
            </button>
          )}
          {hasTeams && (
            <button
              type="button"
              onClick={() => { setShowLogMatch((v) => !v); setMatchMessage('') }}
              className="rib-heading text-xs px-4 py-2.5 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5"
              style={{ letterSpacing: '1.5px' }}
            >
              <CalendarPlus size={13} /> LOG MATCH
            </button>
          )}
        </div>
        {message && <span className="rib-body text-xs text-rib-muted self-center">{message}</span>}
      </div>

      {/* Add Guest form */}
      {showAddPlayer && (
        <div className="rib-tile rounded-xl p-4 space-y-3">
          <p className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>ADD GUEST PLAYER</p>
          <div className="flex flex-wrap gap-2 items-end">
            <input
              type="text"
              placeholder="Full name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc w-44"
            />
            <select
              value={addPosition}
              onChange={(e) => setAddPosition(e.target.value)}
              className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
            >
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button
              type="button"
              onClick={handleAddPlayer}
              disabled={addingPlayer || !addName.trim()}
              className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
              style={{ letterSpacing: '1.5px' }}
            >
              {addingPlayer ? 'ADDING...' : 'ADD'}
            </button>
          </div>
          {addPlayerError && <p className="rib-body text-xs text-red-400">{addPlayerError}</p>}
        </div>
      )}

      {/* Log match form */}
      {showLogMatch && (
        <div className="rib-tile rounded-xl p-4 space-y-3">
          <p className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>LOG MATCH</p>
          <p className="rib-body text-xs text-rib-muted">Creates a match record with the current teams. Update the score in Admin after the game.</p>
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="rib-heading text-xs text-rib-muted block mb-1" style={{ letterSpacing: '1.5px' }}>LOCATION</label>
              <input
                type="text"
                value={matchLocation}
                onChange={(e) => setMatchLocation(e.target.value)}
                className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc w-44"
              />
            </div>
            <button
              type="button"
              onClick={handleLogMatch}
              disabled={loggingMatch || (!teamA.length && !teamB.length)}
              className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
              style={{ letterSpacing: '1.5px' }}
            >
              {loggingMatch ? 'CREATING...' : 'CREATE MATCH'}
            </button>
          </div>
          {matchMessage && <p className="rib-body text-xs text-rib-muted">{matchMessage}</p>}
        </div>
      )}

      <p className="rib-body text-xs text-rib-muted">
        Drag players between columns. Use <strong>AUTO-TIER</strong> to bucket players by rating, then <strong>GENERATE TEAMS</strong> for a balanced draw. Or drag manually between Team A and Team B.
      </p>

      {/* ── Format info ── */}
      <div className="flex gap-4 text-xs rib-body text-rib-muted">
        <span><span className="text-white rib-heading">{format.size}</span> starters per team</span>
        <span><span className="text-white rib-heading">+{format.subs}</span> subs per team</span>
        <span>Total: <span className="text-white rib-heading">{(format.size + format.subs) * 2}</span> players</span>
      </div>

      {/* ── Tier pool columns ── */}
      {inPool && (
        <div>
          <h2 className="rib-heading text-sm text-rib-muted mb-3" style={{ letterSpacing: '2px' }}>
            PLAYER POOLS — drag between tiers or to a team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([1, 2, 3] as PlayerTier[]).map((tier) => {
              const ids = tier === 1 ? tier1 : tier === 2 ? tier2 : tier3
              const col: Column = `tier${tier}` as Column
              return renderDropZone(
                `TIER ${tier} · ${tierLabel[tier]}`,
                ids,
                col,
                tierColor[tier],
                <span className="rib-stat text-xs" style={{ color: tierColor[tier] }}>
                  {ids.length}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Teams ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderDropZone(
          'BENCH',
          bench,
          'bench',
          undefined,
          <span className="rib-stat text-xs text-rib-muted">{bench.length}</span>
        )}
        {renderDropZone(
          'TEAM A',
          teamA,
          'A',
          '#3b82f6',
          teamA.length ? (
            <span className="rib-stat text-xs text-[#3b82f6]">
              OVR {avgOverall(teamA.filter((id) => !subIds.has(id)))}
            </span>
          ) : undefined
        )}
        {renderDropZone(
          'TEAM B',
          teamB,
          'B',
          '#ef4444',
          teamB.length ? (
            <span className="rib-stat text-xs text-[#ef4444]">
              OVR {avgOverall(teamB.filter((id) => !subIds.has(id)))}
            </span>
          ) : undefined
        )}
      </div>

      {/* ── Starter/sub summary ── */}
      {hasTeams && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'TEAM A', ids: teamA, color: '#3b82f6' },
            { label: 'TEAM B', ids: teamB, color: '#ef4444' },
          ].map(({ label, ids, color }) => {
            const starters = ids.filter((id) => !subIds.has(id))
            const subs = ids.filter((id) => subIds.has(id))
            return (
              <div key={label} className="rib-tile rounded-xl overflow-hidden">
                <div className="px-4 py-2 border-b border-rib-border flex justify-between">
                  <h3 className="rib-heading text-xs" style={{ letterSpacing: '2px', color }}>
                    {label}
                  </h3>
                  <span className="rib-body text-xs text-rib-muted">
                    {starters.length} st · {subs.length} sub
                  </span>
                </div>
                <div className="divide-y divide-rib-border">
                  {starters.map((id) => {
                    const s = statsById.get(id)
                    return (
                      <div key={id} className="flex justify-between items-center px-4 py-1.5">
                        <span className="rib-heading text-xs">{s?.player.name}</span>
                        <span className="rib-body text-xs text-rib-muted flex items-center gap-2">
                          {gkIds.has(id) && <span style={{ color: '#e8c547' }}>GK</span>}
                          {s?.player.position}
                        </span>
                      </div>
                    )
                  })}
                  {subs.length > 0 && (
                    <div className="px-4 py-1 bg-rib-bg">
                      <p className="rib-heading text-[10px] text-rib-muted" style={{ letterSpacing: '2px' }}>
                        SUBS
                      </p>
                    </div>
                  )}
                  {subs.map((id) => {
                    const s = statsById.get(id)
                    return (
                      <div key={id} className="flex justify-between items-center px-4 py-1.5 opacity-60">
                        <span className="rib-heading text-xs">{s?.player.name}</span>
                        <span className="rib-body text-xs text-rib-muted">{s?.player.position}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Export modal ── */}
      {showExport && (
        <TeamExportSheet
          date={date}
          formatLabel={format.label}
          teamA={teamA}
          teamB={teamB}
          subIds={subIds}
          gkIds={gkIds}
          rotationA={gkRotationOn ? rotationA : null}
          rotationB={gkRotationOn ? rotationB : null}
          statsById={statsById}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* ── GK Rotation ── */}
      <div className="rib-tile rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="rib-heading text-xl">GK ROTATION</h2>
          <button
            type="button"
            onClick={() => setGkRotationOn((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${gkRotationOn ? 'bg-rib-acc' : 'bg-rib-border'}`}
            aria-label="Toggle GK rotation"
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${gkRotationOn ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>

        {gkRotationOn && (
          <>
            <p className="rib-body text-xs text-rib-muted">
              Randomly schedules every starter in goal for the chosen interval. Subs are excluded.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
                  MATCH LENGTH (MIN)
                </label>
                <input
                  type="number"
                  min={intervalMins}
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
                  value={intervalMins}
                  onChange={(e) => setIntervalMins(Math.max(1, Number(e.target.value)))}
                  className="w-28 bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm rib-stat focus:outline-none focus:border-rib-acc"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateRotation}
                disabled={!hasTeams}
                className="rib-heading text-xs px-4 py-2.5 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
                style={{ letterSpacing: '1.5px' }}
              >
                GENERATE
              </button>
            </div>

            {(rotationA || rotationB) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'TEAM A', schedule: rotationA, color: '#3b82f6' },
                  { label: 'TEAM B', schedule: rotationB, color: '#ef4444' },
                ].map(({ label, schedule, color }) =>
                  schedule ? (
                    <div key={label} className="rib-tile rounded-lg overflow-hidden">
                      <div className="px-4 py-2 border-b border-rib-border">
                        <h3 className="rib-heading text-xs" style={{ letterSpacing: '2px', color }}>
                          {label} GK SCHEDULE
                        </h3>
                      </div>
                      <div className="divide-y divide-rib-border">
                        {schedule.map((slot, i) => {
                          const s = statsById.get(slot.playerId)
                          return (
                            <div key={i} className="flex items-center justify-between px-4 py-2">
                              <span className="rib-body text-xs text-rib-muted">
                                {slot.start}&apos;–{slot.end}&apos;
                              </span>
                              <span className="rib-heading text-xs">
                                {s?.player.name}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
