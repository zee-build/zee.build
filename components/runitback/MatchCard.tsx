import { Star } from 'lucide-react'
import type { MatchWithPlayers } from '@/lib/runitback/types'

const DAY_PILL_CLASS: Record<string, string> = {
  Friday: 'bg-rib-acc/20 text-rib-acc',
  Tuesday: 'bg-rib-acc2/20 text-rib-acc2',
  Other: 'bg-rib-muted/20 text-rib-muted',
}

function formatScorers(players: MatchWithPlayers['players']) {
  return players
    .filter((p) => p.goals > 0)
    .map((p) => `${p.player.name}${p.goals > 1 ? ` x${p.goals}` : ''}`)
    .join(', ')
}

export default function MatchCard({ match }: { match: MatchWithPlayers }) {
  const date = new Date(match.date)
  const motm = match.players.find((p) => p.is_motm)
  const scorers = formatScorers(match.players)

  return (
    <div className="rib-tile rounded-lg p-5">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="rib-heading text-sm bg-rib-bg2 border border-rib-border rounded px-3 py-1">
          {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
        <span
          className={`rib-heading text-[10px] px-2 py-1 rounded ${DAY_PILL_CLASS[match.day_of_week] ?? DAY_PILL_CLASS.Other}`}
          style={{ letterSpacing: '1.5px' }}
        >
          {match.day_of_week.toUpperCase()}
        </span>
        <span className="rib-body text-xs">{match.location}</span>
      </div>

      <div className="rib-heading text-3xl md:text-4xl text-center mb-3">
        <span className="text-white">TEAM A</span>{' '}
        <span className="text-rib-acc">{match.team_a_score}</span>
        <span className="text-rib-muted mx-2">–</span>
        <span className="text-rib-acc">{match.team_b_score}</span>{' '}
        <span className="text-white">TEAM B</span>
      </div>

      {scorers && (
        <p className="rib-body text-sm text-center mb-2">
          <span className="text-rib-muted">Scorers: </span>
          {scorers}
        </p>
      )}

      {motm && (
        <p className="flex items-center justify-center gap-1.5 text-[#e8c547] rib-heading text-sm">
          <Star size={14} fill="currentColor" /> MOTM: {motm.player.name}
        </p>
      )}

      {match.notes && <p className="rib-body text-xs text-center mt-2 italic">{match.notes}</p>}
    </div>
  )
}
