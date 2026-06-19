import Link from 'next/link'
import { Users, Swords, Trophy, BarChart3, Lock, TrendingUp, Star, Shield } from 'lucide-react'
import HeroTile from './HeroTile'
import type { PlayerStats } from '@/lib/runitback/types'

interface FifaMenuGridProps {
  topScorer: PlayerStats | null
  playerCount: number
  matchCount: number
  lastResult: { a: number; b: number } | null
  topStreak: { player: PlayerStats } | null
  totalGoals: number
  pendingRatings?: number
  pendingMotmVotes?: number
  isMod?: boolean
}

function MenuTile({
  href,
  label,
  title,
  sub,
  stat,
  statLabel,
  admin,
  icon,
  newTab,
}: {
  href: string
  label: string
  title: string
  sub: string
  stat?: React.ReactNode
  statLabel?: string
  admin?: boolean
  icon: React.ReactNode
  newTab?: boolean
}) {
  return (
    <Link
      href={href}
      className={`rib-menu-tile ${admin ? 'rib-menu-tile--admin' : ''}`}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span
        className="rib-heading text-[10px] mb-1"
        style={{
          letterSpacing: '3px',
          color: admin ? '#e8002d' : 'var(--acc)',
        }}
      >
        {label}
      </span>
      <h2 className="rib-heading text-2xl sm:text-3xl text-white leading-none">{title}</h2>
      <p className="rib-body text-xs mt-1">{sub}</p>
      {stat !== undefined && (
        <div className="mt-auto pt-4">
          <span className="rib-stat text-2xl">{stat}</span>
          {statLabel && (
            <span className="rib-heading text-[10px] text-rib-muted ml-2" style={{ letterSpacing: '2px' }}>
              {statLabel}
            </span>
          )}
        </div>
      )}
      <span className="rib-tile-icon">{icon}</span>
    </Link>
  )
}

export default function FifaMenuGrid({
  topScorer,
  playerCount,
  matchCount,
  lastResult,
  topStreak,
  totalGoals,
  pendingRatings = 0,
  pendingMotmVotes = 0,
  isMod = false,
}: FifaMenuGridProps) {
  return (
    <div className="rib-menu-wrap">

      {/* ── LEFT: HERO / TOP SCORER ── */}
      <HeroTile topScorer={topScorer} />

      {/* ── RIGHT: 2×3 MENU TILES ── */}
      <div className="rib-menu-tiles">
        <MenuTile
          href="/runitback/players"
          label="SQUAD"
          title="PLAYERS"
          sub="FIFA-style player cards"
          stat={playerCount}
          statLabel="REGISTERED"
          icon={<Users size={56} />}
        />

        <MenuTile
          href="/runitback/matches"
          label="HISTORY"
          title="MATCHES"
          sub="Results & scorelines"
          stat={matchCount}
          statLabel={lastResult ? `LAST ${lastResult.a}–${lastResult.b}` : 'PLAYED'}
          icon={<Swords size={56} />}
        />

        <MenuTile
          href="/runitback/leaderboard"
          label="RANKINGS"
          title="LEADERBOARD"
          sub="Goals · MOTM · Win rate"
          stat={
            topStreak && topStreak.player.streak > 0
              ? `${topStreak.player.player.name} ${topStreak.player.streak}W`
              : '—'
          }
          statLabel={topStreak && topStreak.player.streak > 0 ? 'STREAK' : ''}
          icon={<Trophy size={56} />}
        />

        <MenuTile
          href="/runitback/stats"
          label="ANALYTICS"
          title="STATS"
          sub="Deep dive numbers"
          stat={totalGoals}
          statLabel="TOTAL GOALS"
          icon={<BarChart3 size={56} />}
        />

        <MenuTile
          href="/runitback/join"
          label="REGISTRATION"
          title="JOIN"
          sub="Register for the squad"
          stat="FREE"
          statLabel="OPEN"
          icon={<TrendingUp size={56} />}
        />

        <MenuTile
          href="/runitback/admin"
          label="RESTRICTED"
          title="ADMIN"
          sub="Log matches · Manage players"
          stat="PIN"
          statLabel="REQUIRED"
          admin
          icon={<Lock size={56} />}
        />

        {pendingRatings > 0 && (
          <MenuTile
            href="/runitback/rate"
            label="SQUAD VOTE"
            title="RATE THE SQUAD"
            sub="Rate your teammates"
            stat={pendingRatings}
            statLabel="TO RATE"
            icon={<Star size={56} />}
            newTab
          />
        )}

        {pendingMotmVotes > 0 && (
          <MenuTile
            href="/runitback/motm"
            label="MAN OF THE MATCH"
            title="VOTE MOTM"
            sub="One vote per match"
            stat={pendingMotmVotes}
            statLabel="TO VOTE"
            icon={<Trophy size={56} />}
            newTab
          />
        )}

        {isMod && (
          <MenuTile
            href="/runitback/mod"
            label="MOD ACCESS"
            title="LOG MATCH"
            sub="Mod tools — log results"
            stat="MOD"
            statLabel="ENABLED"
            icon={<Shield size={56} />}
          />
        )}
      </div>
    </div>
  )
}
