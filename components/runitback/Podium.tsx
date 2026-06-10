import { getInitials } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

interface PodiumEntry {
  player: Player
  value: number
}

const TIER_STYLES = [
  { label: '1ST', border: 'border-[#b8952a]', text: 'text-[#e8c547]', order: 'md:order-2', height: 'md:h-44' },
  { label: '2ND', border: 'border-[#9e9e9e]', text: 'text-[#c9c9c9]', order: 'md:order-1', height: 'md:h-36' },
  { label: '3RD', border: 'border-[#8b4513]', text: 'text-[#cd854a]', order: 'md:order-3', height: 'md:h-32' },
]

interface PodiumProps {
  entries: PodiumEntry[]
  unit?: string
}

export default function Podium({ entries, unit = '' }: PodiumProps) {
  if (entries.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-8">
      {entries.slice(0, 3).map((entry, i) => {
        const tier = TIER_STYLES[i]
        return (
          <div
            key={entry.player.id}
            className={`rib-tile rounded-xl p-5 flex flex-col items-center border-2 ${tier.border} ${tier.order} ${tier.height}`}
          >
            <span className={`rib-heading text-xs ${tier.text}`} style={{ letterSpacing: '2px' }}>
              {tier.label}
            </span>
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-rib-acc2 text-white rib-heading text-lg my-2 overflow-hidden">
              {entry.player.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.player.avatar_url} alt={entry.player.name} className="h-full w-full object-cover" />
              ) : (
                getInitials(entry.player.name)
              )}
            </div>
            <h3 className="rib-heading text-base text-center">{entry.player.name}</h3>
            <p className={`rib-stat text-2xl mt-1 ${tier.text}`}>
              {entry.value}
              {unit}
            </p>
          </div>
        )
      })}
    </div>
  )
}
