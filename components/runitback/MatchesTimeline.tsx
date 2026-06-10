'use client'

import { useMemo, useState } from 'react'
import MatchCard from './MatchCard'
import type { MatchWithPlayers } from '@/lib/runitback/types'

const PAGE_SIZE = 10

export default function MatchesTimeline({ matches }: { matches: MatchWithPlayers[] }) {
  const [playerFilter, setPlayerFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [page, setPage] = useState(1)

  const months = useMemo(() => {
    const set = new Set<string>()
    matches.forEach((m) => set.add(m.date.slice(0, 7)))
    return Array.from(set).sort().reverse()
  }, [matches])

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (monthFilter && !m.date.startsWith(monthFilter)) return false
      if (playerFilter) {
        const needle = playerFilter.toLowerCase()
        if (!m.players.some((p) => p.player.name.toLowerCase().includes(needle))) return false
      }
      return true
    })
  }, [matches, playerFilter, monthFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={playerFilter}
          onChange={(e) => {
            setPlayerFilter(e.target.value)
            setPage(1)
          }}
          placeholder="Filter by player name..."
          className="flex-1 bg-rib-tile border border-rib-border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rib-acc"
        />
        <select
          value={monthFilter}
          onChange={(e) => {
            setMonthFilter(e.target.value)
            setPage(1)
          }}
          className="bg-rib-tile border border-rib-border rounded-lg px-3 py-2.5 text-white text-sm rib-heading focus:outline-none focus:border-rib-acc"
          style={{ letterSpacing: '1.5px' }}
        >
          <option value="">ALL MONTHS</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {new Date(`${month}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {paged.length === 0 ? (
        <div className="rib-tile rounded-xl p-12 text-center">
          <p className="rib-heading text-xl mb-2">NO MATCHES YET</p>
          <p className="rib-body text-sm">Log your first game after Friday.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rib-heading text-xs px-4 py-2 rounded-lg border border-rib-border text-rib-muted disabled:opacity-30"
            style={{ letterSpacing: '1.5px' }}
          >
            PREV
          </button>
          <span className="rib-body text-sm">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rib-heading text-xs px-4 py-2 rounded-lg border border-rib-border text-rib-muted disabled:opacity-30"
            style={{ letterSpacing: '1.5px' }}
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  )
}
