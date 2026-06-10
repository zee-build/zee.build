import { Users, Goal, Trophy, BarChart3, Lock } from 'lucide-react'
import FifaTile from './FifaTile'
import FormBadges from './FormBadges'
import { getInitials } from '@/lib/runitback/queries'
import type { PlayerStats } from '@/lib/runitback/types'

interface FifaMenuGridProps {
  topScorer: PlayerStats | null
  playerCount: number
  matchCount: number
  lastResult: { a: number; b: number } | null
  topStreak: { player: PlayerStats } | null
  totalGoals: number
}

export default function FifaMenuGrid({
  topScorer,
  playerCount,
  matchCount,
  lastResult,
  topStreak,
  totalGoals,
}: FifaMenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
      {/* Tile 1 — Featured top scorer */}
      <FifaTile href="/runitback/leaderboard" variant="featured">
        <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '2px' }}>
          TOP SCORER
        </span>
        {topScorer ? (
          <div className="mt-4 flex flex-col h-full">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-rib-acc2 text-white rib-heading text-2xl mb-4 overflow-hidden">
              {topScorer.player.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={topScorer.player.avatar_url} alt={topScorer.player.name} className="h-full w-full object-cover" />
              ) : (
                getInitials(topScorer.player.name)
              )}
            </div>
            <h2 className="rib-heading text-2xl md:text-3xl text-white">{topScorer.player.name}</h2>
            <p className="rib-body text-sm mt-1">
              {topScorer.player.position ?? '—'} · {topScorer.player.is_regular ? 'Regular' : 'Guest'} · Season 2025
            </p>
            <p className="rib-stat text-5xl mt-6">{topScorer.goals}</p>
            <p className="rib-heading text-xs text-rib-muted mb-3" style={{ letterSpacing: '1.5px' }}>
              GOALS
            </p>
            <div className="mt-auto pt-4">
              <p className="rib-heading text-xs text-rib-muted mb-2" style={{ letterSpacing: '1.5px' }}>
                LAST 5
              </p>
              <FormBadges form={topScorer.form} />
            </div>
          </div>
        ) : (
          <p className="rib-body text-sm mt-6">No matches played yet — log your first game!</p>
        )}
      </FifaTile>

      {/* Tile 2 — Players */}
      <FifaTile href="/runitback/players">
        <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '2px' }}>
          SQUAD
        </span>
        <h2 className="rib-heading text-2xl md:text-3xl mt-2">PLAYERS</h2>
        <p className="rib-body text-sm mt-1">View all FIFA-style cards</p>
        <p className="rib-stat text-3xl mt-6">{playerCount} registered</p>
        <div className="flex gap-1 mt-3">
          {Array.from({ length: Math.min(playerCount, 10) }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-rib-acc" />
          ))}
        </div>
        <Users className="absolute bottom-4 right-4 text-rib-acc opacity-35" size={48} />
      </FifaTile>

      {/* Tile 3 — Matches */}
      <FifaTile href="/runitback/matches">
        <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '2px' }}>
          HISTORY
        </span>
        <h2 className="rib-heading text-2xl md:text-3xl mt-2">MATCHES</h2>
        <p className="rib-body text-sm mt-1">Results &amp; scorelines</p>
        <p className="rib-stat text-3xl mt-6">{matchCount} played</p>
        {lastResult && (
          <span className="inline-block mt-3 rib-heading text-xs px-3 py-1 rounded-full bg-rib-acc/20 text-rib-acc" style={{ letterSpacing: '1.5px' }}>
            Last: {lastResult.a} – {lastResult.b}
          </span>
        )}
        <Goal className="absolute bottom-4 right-4 text-rib-acc opacity-35" size={48} />
      </FifaTile>

      {/* Tile 4 — Leaderboard */}
      <FifaTile href="/runitback/leaderboard">
        <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '2px' }}>
          RANKINGS
        </span>
        <h2 className="rib-heading text-2xl md:text-3xl mt-2">LEADERBOARD</h2>
        <p className="rib-body text-sm mt-1">Goals · MOTM · Win rate</p>
        {topStreak && topStreak.player.streak > 0 ? (
          <p className="rib-stat text-3xl mt-6">
            {topStreak.player.player.name} · {topStreak.player.streak}W streak
          </p>
        ) : (
          <p className="rib-body text-sm mt-6">No active streaks</p>
        )}
        <Trophy className="absolute bottom-4 right-4 text-rib-acc opacity-35" size={48} />
      </FifaTile>

      {/* Tile 5 — Stats */}
      <FifaTile href="/runitback/stats">
        <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '2px' }}>
          ANALYTICS
        </span>
        <h2 className="rib-heading text-2xl md:text-3xl mt-2">STATS</h2>
        <p className="rib-body text-sm mt-1">Deep dive numbers</p>
        <p className="rib-stat text-3xl mt-6">{totalGoals} total goals</p>
        <BarChart3 className="absolute bottom-4 right-4 text-rib-acc opacity-35" size={48} />
      </FifaTile>

      {/* Tile 6 — Admin */}
      <FifaTile href="/runitback/admin">
        <span className="rib-heading text-xs text-red-500" style={{ letterSpacing: '2px' }}>
          RESTRICTED
        </span>
        <h2 className="rib-heading text-2xl md:text-3xl mt-2">ADMIN</h2>
        <p className="rib-body text-sm mt-1">Log matches · Manage players</p>
        <span className="inline-block mt-6 rib-heading text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400" style={{ letterSpacing: '1.5px' }}>
          PIN REQUIRED
        </span>
        <Lock className="absolute bottom-4 right-4 text-rib-acc opacity-35" size={48} />
      </FifaTile>
    </div>
  )
}
