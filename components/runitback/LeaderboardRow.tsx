import { getInitials } from '@/lib/runitback/queries'
import type { Player } from '@/lib/runitback/types'

const RANK_TEXT: Record<number, string> = {
  1: 'text-[#e8c547]',
  2: 'text-[#c9c9c9]',
  3: 'text-[#cd854a]',
}

interface LeaderboardRowProps {
  rank: number
  player: Player
  value: number
  max: number
  unit?: string
}

export default function LeaderboardRow({ rank, player, value, max, unit = '' }: LeaderboardRowProps) {
  const pct = max > 0 ? Math.max(4, Math.min(100, (value / max) * 100)) : 0
  const rankColor = RANK_TEXT[rank] ?? 'text-rib-muted'

  return (
    <div className="flex items-center gap-4 rib-tile rounded-lg px-4 py-3">
      <span className={`rib-heading text-xl w-8 text-center ${rankColor}`}>{rank}</span>
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-rib-acc2 text-white rib-heading text-sm shrink-0 overflow-hidden">
        {player.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.avatar_url} alt={player.name} className="h-full w-full object-cover" />
        ) : (
          getInitials(player.name)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="rib-heading text-sm truncate">{player.name}</p>
        <div className="h-1.5 w-full rounded-full bg-rib-border overflow-hidden mt-1.5">
          <div className="h-full rounded-full bg-rib-acc transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="rib-stat text-xl shrink-0">
        {value}
        {unit}
      </span>
    </div>
  )
}
