import Link from 'next/link'
import { getInitials } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

interface PodiumEntry {
  player: Player
  value: number
}

const TIERS = [
  { label: '1ST', borderColor: '#c9a028', textColor: '#f5c518', order: 'md:order-2', minH: 'md:min-h-44' },
  { label: '2ND', borderColor: '#9e9e9e', textColor: '#c9c9c9', order: 'md:order-1', minH: 'md:min-h-36' },
  { label: '3RD', borderColor: '#8b4513', textColor: '#cd854a', order: 'md:order-3', minH: 'md:min-h-32' },
]

export default function Podium({ entries, unit = '' }: { entries: PodiumEntry[]; unit?: string }) {
  if (entries.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-8">
      {entries.slice(0, 3).map((entry, i) => {
        const tier = TIERS[i]
        return (
          <Link
            key={entry.player.id}
            href={`/runitback/players/${entry.player.id}`}
            className={`rib-tile rounded-xl p-5 flex flex-col items-center border-2 ${tier.order} ${tier.minH} hover:scale-[1.02] transition-transform`}
            style={{ borderColor: tier.borderColor }}
          >
            <span
              className="rib-heading text-xs mb-2"
              style={{ letterSpacing: '2px', color: tier.textColor }}
            >
              {tier.label}
            </span>
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-rib-acc2 text-white rib-heading text-lg my-2 overflow-hidden shrink-0">
              {entry.player.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.player.avatar_url} alt={entry.player.name} className="h-full w-full object-cover" />
              ) : (
                getInitials(entry.player.name)
              )}
            </div>
            <h3 className="rib-heading text-base text-center text-white">{entry.player.name}</h3>
            <p className="rib-stat text-2xl mt-1" style={{ color: tier.textColor }}>
              {entry.value}{unit}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
