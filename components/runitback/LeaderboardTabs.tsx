'use client'

import { useMemo, useState } from 'react'
import Podium from './Podium'
import LeaderboardRow from './LeaderboardRow'
import type { PlayerStats } from '@/lib/runitback/types'

type TabKey = 'goals' | 'assists' | 'motm' | 'winRate' | 'games' | 'streak'

const TABS: { key: TabKey; label: string; unit?: string }[] = [
  { key: 'goals', label: 'GOALS' },
  { key: 'assists', label: 'ASSISTS' },
  { key: 'motm', label: 'MOTM' },
  { key: 'winRate', label: 'WIN RATE', unit: '%' },
  { key: 'games', label: 'GAMES' },
  { key: 'streak', label: 'STREAK', unit: 'W' },
]

function valueFor(stat: PlayerStats, key: TabKey): number {
  switch (key) {
    case 'winRate':
      return Math.round(stat.winRate)
    default:
      return stat[key]
  }
}

export default function LeaderboardTabs({ stats, totalMatches }: { stats: PlayerStats[]; totalMatches: number }) {
  const [tab, setTab] = useState<TabKey>('goals')

  const ranked = useMemo(() => {
    return [...stats]
      .filter((s) => s.games > 0)
      .sort((a, b) => valueFor(b, tab) - valueFor(a, tab))
  }, [stats, tab])

  const max = ranked.length > 0 ? valueFor(ranked[0], tab) : 0
  const activeTab = TABS.find((t) => t.key === tab)!

  const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0)

  return (
    <div>
      <Podium
        entries={ranked.slice(0, 3).map((s) => ({ player: s.player, value: valueFor(s, tab) }))}
        unit={activeTab.unit}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rib-heading text-xs px-3 py-2 rounded-lg border transition-colors ${
              tab === t.key ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
            }`}
            style={{ letterSpacing: '1.5px' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <div className="rib-tile rounded-xl p-12 text-center">
          <p className="rib-heading text-xl mb-2">NO DATA YET</p>
          <p className="rib-body text-sm">Log some matches to populate the leaderboard.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranked.map((s, i) => (
            <LeaderboardRow
              key={s.player.id}
              rank={i + 1}
              player={s.player}
              value={valueFor(s, tab)}
              max={max}
              unit={activeTab.unit}
            />
          ))}
        </div>
      )}

      <div className="rib-tile rounded-lg p-5 mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="rib-stat text-2xl">{totalGoals}</p>
          <p className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>TOTAL GOALS</p>
        </div>
        <div>
          <p className="rib-stat text-2xl">{totalMatches}</p>
          <p className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>TOTAL GAMES</p>
        </div>
        <div>
          <p className="rib-stat text-2xl">{stats.length}</p>
          <p className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>TOTAL PLAYERS</p>
        </div>
      </div>
    </div>
  )
}
