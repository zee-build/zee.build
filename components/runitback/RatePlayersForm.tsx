'use client'

import { useEffect, useState } from 'react'
import { Loader2, X, Lock, Star } from 'lucide-react'
import FifaCard from './FifaCard'
import {
  GK_RATING_ATTRIBUTE,
  RATING_ATTRIBUTES,
  weightsForPosition,
} from '@/lib/runitback/config'
import type { AttributeRating, DayOfWeek, PlayerStats, RatingAttribute } from '@/lib/runitback/types'

interface Teammate {
  stats: PlayerStats
  playedPosition: string | null
}

interface PendingMatch {
  matchId: string
  date: string
  dayOfWeek: DayOfWeek
  teammates: Teammate[]
}

interface SquadMember {
  stats: PlayerStats
  mySubmission: AttributeRating | null
}

interface AttributeWindow {
  key: string
  label: string
  open: boolean
}

const DEFAULT_ATTRS: Record<RatingAttribute, number> = {
  pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50,
}

type Mode = 'match' | 'squad'

export default function RatePlayersForm() {
  const [season, setSeason] = useState<number | null>(null)
  const [mode, setMode] = useState<Mode>('match')

  const [pending, setPending] = useState<PendingMatch[] | null>(null)
  const [squad, setSquad] = useState<SquadMember[]>([])
  const [attrWindow, setAttrWindow] = useState<AttributeWindow | null>(null)

  // Match-rating modal state
  const [scoreTarget, setScoreTarget] = useState<{ matchId: string; teammate: Teammate } | null>(null)
  const [score, setScore] = useState<number | null>(null)

  // Attribute-update modal state
  const [attrTarget, setAttrTarget] = useState<SquadMember | null>(null)
  const [attrs, setAttrs] = useState<Record<RatingAttribute, number>>(DEFAULT_ATTRS)
  const [gkValue, setGkValue] = useState(50)

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/runitback/ratings')
      .then((res) => res.json())
      .then((data) => {
        setSeason(data.season)
        setPending(data.pending ?? [])
        setSquad(data.squad ?? [])
        setAttrWindow(data.attributeWindow ?? null)
      })
      .catch(() => setError('Could not load players to rate.'))
  }, [])

  const isGoalkeeper = (t: Teammate | SquadMember) =>
    ('playedPosition' in t ? t.playedPosition ?? t.stats.player.position : t.stats.player.position) === 'GK'

  // ── Match rating ──────────────────────────────────────────────────
  const openScore = (matchId: string, teammate: Teammate) => {
    setError('')
    setScore(null)
    setScoreTarget({ matchId, teammate })
  }

  const submitScore = async () => {
    if (!scoreTarget || score === null) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: scoreTarget.matchId,
          ratee_id: scoreTarget.teammate.stats.player.id,
          score,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      const { matchId, teammate } = scoreTarget
      setPending((prev) =>
        (prev ?? [])
          .map((m) =>
            m.matchId === matchId
              ? { ...m, teammates: m.teammates.filter((t) => t.stats.player.id !== teammate.stats.player.id) }
              : m
          )
          .filter((m) => m.teammates.length > 0)
      )
      setScoreTarget(null)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Attribute update ──────────────────────────────────────────────
  const openAttrs = (member: SquadMember) => {
    setError('')
    const sub = member.mySubmission
    if (sub) {
      setAttrs({
        pace: sub.pace, shooting: sub.shooting, passing: sub.passing,
        dribbling: sub.dribbling, defending: sub.defending, physical: sub.physical,
      })
      setGkValue(sub.goalkeeping ?? 50)
    } else {
      setAttrs(DEFAULT_ATTRS)
      setGkValue(50)
    }
    setAttrTarget(member)
  }

  const submitAttrs = async () => {
    if (!attrTarget) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/ratings/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratee_id: attrTarget.stats.player.id,
          ...attrs,
          goalkeeping: isGoalkeeper(attrTarget) ? gkValue : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      // Mark this member as submitted so the UI reflects the saved card.
      const savedSub: AttributeRating = {
        id: attrTarget.mySubmission?.id ?? 'local',
        season: season ?? 0,
        rating_window: attrWindow?.key ?? '',
        rater_id: '',
        ratee_id: attrTarget.stats.player.id,
        ...attrs,
        goalkeeping: isGoalkeeper(attrTarget) ? gkValue : null,
        created_at: '',
        updated_at: '',
      }
      setSquad((prev) =>
        prev.map((m) =>
          m.stats.player.id === attrTarget.stats.player.id ? { ...m, mySubmission: savedSub } : m
        )
      )
      setAttrTarget(null)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pending === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-rib-muted" size={28} />
      </div>
    )
  }

  const totalPending = pending.reduce((sum, m) => sum + m.teammates.length, 0)
  const submittedCount = squad.filter((s) => s.mySubmission).length

  const tabBtn = (key: Mode, label: string, badge?: number) => (
    <button
      onClick={() => { setMode(key); setError('') }}
      className="rib-heading text-xs px-4 py-2 rounded-lg inline-flex items-center gap-2"
      style={{
        letterSpacing: '1.5px',
        background: mode === key ? 'var(--acc)' : 'rgba(255,255,255,0.05)',
        color: mode === key ? 'var(--bg)' : 'var(--muted)',
      }}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span
          className="rib-stat text-[10px] px-1.5 py-0.5 rounded-full"
          style={{ background: mode === key ? 'rgba(0,0,0,0.2)' : 'var(--acc)', color: mode === key ? 'var(--bg)' : 'var(--bg)' }}
        >
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="rib-heading text-2xl mb-1 text-center">RATE THE SQUAD</h1>
      <p className="rib-body text-sm mb-5 text-center">
        One quick score out of 10 per game — and shape everyone&apos;s attributes each update window.
      </p>

      <div className="flex items-center justify-center gap-2 mb-6">
        {tabBtn('match', 'MATCH RATINGS', totalPending)}
        {tabBtn('squad', 'SQUAD UPDATE', attrWindow?.open ? squad.length - submittedCount : undefined)}
      </div>

      {error && !scoreTarget && !attrTarget && (
        <p className="rib-body text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      {/* ── MATCH RATINGS ─────────────────────────────────────────── */}
      {mode === 'match' && (
        pending.length === 0 ? (
          <div className="rib-tile rounded-xl p-12 text-center max-w-md mx-auto">
            <p className="rib-heading text-xl mb-2">ALL CAUGHT UP</p>
            <p className="rib-body text-sm">
              You&apos;ve rated your teammates from every match this {season ? `SEASON ${season}` : 'season'}.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.map((match) => (
              <div key={match.matchId}>
                <h2 className="rib-heading text-sm text-rib-muted mb-3" style={{ letterSpacing: '2px' }}>
                  {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
                  {match.dayOfWeek.toUpperCase()}
                </h2>
                <div className="flex flex-wrap gap-4">
                  {match.teammates.map((t) => (
                    <FifaCard
                      key={t.stats.player.id}
                      stats={t.stats}
                      variant="mini"
                      onClick={() => openScore(match.matchId, t)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── SQUAD UPDATE ──────────────────────────────────────────── */}
      {mode === 'squad' && (
        <>
          <div className="rib-tile rounded-xl p-4 mb-6 text-center">
            {attrWindow?.open ? (
              <>
                <p className="rib-heading text-sm text-rib-acc" style={{ letterSpacing: '1.5px' }}>
                  {attrWindow.label} — OPEN
                </p>
                <p className="rib-body text-xs mt-1">
                  Set each player&apos;s attributes out of 99 based on their position. You&apos;ve done{' '}
                  <span className="text-rib-acc">{submittedCount}</span> / {squad.length}. Edit anytime before the window closes.
                </p>
              </>
            ) : (
              <>
                <p className="rib-heading text-sm inline-flex items-center gap-2 justify-center" style={{ letterSpacing: '1.5px' }}>
                  <Lock size={14} /> UPDATES CLOSED
                </p>
                <p className="rib-body text-xs mt-1">
                  Attribute ratings reopen for the <span className="text-rib-acc">{attrWindow?.label}</span>. Match ratings are always open.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {squad.map((member) => (
              <div key={member.stats.player.id} className="relative">
                <FifaCard
                  stats={member.stats}
                  variant="mini"
                  onClick={attrWindow?.open ? () => openAttrs(member) : undefined}
                />
                {member.mySubmission && (
                  <div
                    className="absolute top-1 left-1 z-10 rounded-full p-1"
                    style={{ background: 'var(--acc)' }}
                    title="You've rated this player"
                  >
                    <Star size={12} color="var(--bg)" fill="var(--bg)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MATCH SCORE MODAL ─────────────────────────────────────── */}
      {scoreTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => !submitting && setScoreTarget(null)}
        >
          <div className="rib-tile rounded-xl p-6 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setScoreTarget(null)}
              disabled={submitting}
              className="absolute top-3 right-3 text-rib-muted hover:text-white disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="rib-heading text-xs text-rib-muted mb-1" style={{ letterSpacing: '1.5px' }}>
              HOW DID THEY PLAY?
            </p>
            <h2 className="rib-heading text-xl mb-5">{scoreTarget.teammate.stats.player.name}</h2>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  className="rib-stat text-lg py-3 rounded-lg transition-colors"
                  style={{
                    background: score === n ? 'var(--acc)' : 'rgba(255,255,255,0.05)',
                    color: score === n ? 'var(--bg)' : 'var(--fg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            {error && <p className="rib-body text-red-400 text-sm mt-4">{error}</p>}

            <button
              type="button"
              onClick={submitScore}
              disabled={submitting || score === null}
              className="w-full mt-6 rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-40"
              style={{ letterSpacing: '2px' }}
            >
              {submitting ? 'SUBMITTING...' : score === null ? 'PICK A SCORE' : `SUBMIT ${score}/10`}
            </button>
          </div>
        </div>
      )}

      {/* ── ATTRIBUTE MODAL ───────────────────────────────────────── */}
      {attrTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => !submitting && setAttrTarget(null)}
        >
          <div className="rib-tile rounded-xl p-6 w-full max-w-sm relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setAttrTarget(null)}
              disabled={submitting}
              className="absolute top-3 right-3 text-rib-muted hover:text-white disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="rib-heading text-xs text-rib-muted mb-1" style={{ letterSpacing: '1.5px' }}>
              {attrTarget.mySubmission ? 'EDIT ATTRIBUTES' : 'RATE ATTRIBUTES'} · OUT OF 99
            </p>
            <h2 className="rib-heading text-xl mb-1">{attrTarget.stats.player.name}</h2>
            <p className="rib-body text-xs mb-4">
              {attrTarget.stats.player.position ? (
                <>Position <span className="text-rib-acc">{attrTarget.stats.player.position}</span> — highlighted attributes matter most.</>
              ) : 'Rate every attribute out of 99.'}
            </p>

            <div className="space-y-4">
              {RATING_ATTRIBUTES.map(({ key, label }) => {
                const weight = weightsForPosition(attrTarget.stats.player.position)[key] ?? 0
                const isKey = weight >= 20
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="rib-heading text-xs"
                        style={{ letterSpacing: '1.5px', color: isKey ? 'var(--acc)' : 'var(--muted)' }}
                      >
                        {label}{isKey ? ' ★' : ''}
                      </span>
                      <span className="rib-stat text-lg">{attrs[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={99}
                      step={1}
                      value={attrs[key]}
                      onChange={(e) => setAttrs((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="w-full accent-rib-acc"
                    />
                  </div>
                )
              })}

              {isGoalkeeper(attrTarget) && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '1.5px' }}>
                      {GK_RATING_ATTRIBUTE.label} ★
                    </span>
                    <span className="rib-stat text-lg">{gkValue}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={99}
                    step={1}
                    value={gkValue}
                    onChange={(e) => setGkValue(Number(e.target.value))}
                    className="w-full accent-rib-acc"
                  />
                </div>
              )}
            </div>

            {error && <p className="rib-body text-red-400 text-sm mt-4">{error}</p>}

            <button
              type="button"
              onClick={submitAttrs}
              disabled={submitting}
              className="w-full mt-6 rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
              style={{ letterSpacing: '2px' }}
            >
              {submitting ? 'SAVING...' : attrTarget.mySubmission ? 'UPDATE RATING' : 'SUBMIT RATING'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
