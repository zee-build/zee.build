import Link from 'next/link'
import type { PlayerStats } from '@/lib/runitback/types'
import { getInitials, tierForRating } from '@/lib/runitback/queries'

const TIER_CLASS = {
  gold: 'rib-card-gold',
  silver: 'rib-card-silver',
  bronze: 'rib-card-bronze',
}

const TIER_TEXT = {
  gold: 'text-[#e8c547]',
  silver: 'text-[#c9c9c9]',
  bronze: 'text-[#cd854a]',
}

interface FifaCardProps {
  stats: PlayerStats
  variant?: 'mini' | 'full'
  href?: string
}

function Hexagon({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center rib-tile rounded-md py-2">
      <span className="rib-stat text-lg leading-none">{value}</span>
      <span className="rib-heading text-[10px] text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>
        {label}
      </span>
    </div>
  )
}

export default function FifaCard({ stats, variant = 'mini', href }: FifaCardProps) {
  const { player, overall, goals, assists, motm, games, winRate, streak } = stats
  const tier = tierForRating(overall)
  const isFull = variant === 'full'

  const card = (
    <div
      className={`relative rounded-xl border-2 p-5 ${TIER_CLASS[tier]} ${
        isFull ? 'max-w-md mx-auto' : 'h-full'
      }`}
    >
      {/* Rating + position */}
      <div className="absolute top-4 left-4">
        <div className={`rib-heading text-3xl ${TIER_TEXT[tier]}`}>{overall}</div>
        {player.position && (
          <div className="rib-heading text-xs text-rib-muted mt-1" style={{ letterSpacing: '1.5px' }}>
            {player.position}
          </div>
        )}
      </div>

      {/* Regular / Guest badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`rib-heading text-[10px] px-2 py-0.5 rounded ${
            player.is_regular ? 'bg-rib-acc/20 text-rib-acc' : 'bg-rib-muted/20 text-rib-muted'
          }`}
          style={{ letterSpacing: '1.5px' }}
        >
          {player.is_regular ? 'REGULAR' : 'GUEST'}
        </span>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-12 pb-4">
        <div
          className={`flex items-center justify-center rounded-full bg-rib-acc2 text-white rib-heading overflow-hidden ${
            isFull ? 'h-24 w-24 text-3xl' : 'h-16 w-16 text-xl'
          }`}
        >
          {player.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={player.avatar_url} alt={player.name} className="h-full w-full object-cover" />
          ) : (
            getInitials(player.name)
          )}
        </div>
        <h3 className={`rib-heading mt-3 text-center ${isFull ? 'text-2xl' : 'text-base'}`}>
          {player.name}
        </h3>
        {player.nickname && <p className="rib-body text-xs">&ldquo;{player.nickname}&rdquo;</p>}
      </div>

      {/* Stat hexagons */}
      <div className="grid grid-cols-3 gap-2">
        <Hexagon label="GOL" value={goals} />
        <Hexagon label="ASS" value={assists} />
        <Hexagon label="MOT" value={motm} />
        <Hexagon label="GAM" value={games} />
        <Hexagon label="WIN" value={`${Math.round(winRate)}%`} />
        <Hexagon label="STR" value={streak} />
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    )
  }

  return card
}
