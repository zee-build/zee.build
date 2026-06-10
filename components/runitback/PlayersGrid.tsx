'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import FifaCard from './FifaCard'
import type { PlayerStats } from '@/lib/runitback/types'

type FilterMode = 'all' | 'regulars' | 'guests'
type SortMode = 'overall' | 'goals' | 'motm' | 'name'

export default function PlayersGrid({ stats }: { stats: PlayerStats[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [sort, setSort] = useState<SortMode>('overall')

  const filtered = useMemo(() => {
    let result = stats.filter((s) => s.player.name.toLowerCase().includes(search.toLowerCase()))

    if (filter === 'regulars') result = result.filter((s) => s.player.is_regular)
    if (filter === 'guests') result = result.filter((s) => !s.player.is_regular)

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'goals':
          return b.goals - a.goals
        case 'motm':
          return b.motm - a.motm
        case 'name':
          return a.player.name.localeCompare(b.player.name)
        default:
          return b.overall - a.overall
      }
    })

    return result
  }, [stats, search, filter, sort])

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rib-muted" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players..."
            className="w-full bg-rib-tile border border-rib-border rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-rib-acc"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'regulars', 'guests'] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`rib-heading text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                filter === mode ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
              }`}
              style={{ letterSpacing: '1.5px' }}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="bg-rib-tile border border-rib-border rounded-lg px-3 py-2.5 text-white text-sm rib-heading focus:outline-none focus:border-rib-acc"
          style={{ letterSpacing: '1.5px' }}
        >
          <option value="overall">SORT: OVERALL</option>
          <option value="goals">SORT: GOALS</option>
          <option value="motm">SORT: MOTM</option>
          <option value="name">SORT: NAME</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rib-tile rounded-xl p-12 text-center">
          <p className="rib-heading text-xl mb-2">NO PLAYERS FOUND</p>
          <p className="rib-body text-sm">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <FifaCard key={s.player.id} stats={s} href={`/runitback/players/${s.player.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
