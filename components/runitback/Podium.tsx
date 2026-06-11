import FifaCard from './FifaCard'
import type { PlayerStats } from '@/lib/runitback/types'

interface PodiumEntry {
  stat: PlayerStats
  value: number
}

const TIERS = [
  { label: '1ST', borderColor: '#c9a028', textColor: '#f5c518', order: 'md:order-2' },
  { label: '2ND', borderColor: '#9e9e9e', textColor: '#c9c9c9', order: 'md:order-1' },
  { label: '3RD', borderColor: '#8b4513', textColor: '#cd854a', order: 'md:order-3' },
]

export default function Podium({ entries, unit = '' }: { entries: PodiumEntry[]; unit?: string }) {
  if (entries.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-8">
      {entries.slice(0, 3).map((entry, i) => {
        const tier = TIERS[i]
        return (
          <div
            key={entry.stat.player.id}
            className={`rib-tile rounded-xl p-5 flex flex-col items-center border-2 ${tier.order} hover:scale-[1.02] transition-transform`}
            style={{ borderColor: tier.borderColor }}
          >
            <span
              className="rib-heading text-xs mb-3"
              style={{ letterSpacing: '2px', color: tier.textColor }}
            >
              {tier.label}
            </span>
            <FifaCard stats={entry.stat} variant="mini" href={`/runitback/players/${entry.stat.player.id}`} />
            <p className="rib-stat text-2xl mt-2" style={{ color: tier.textColor }}>
              {entry.value}{unit}
            </p>
          </div>
        )
      })}
    </div>
  )
}
