import Link from 'next/link'
import { Users, Swords, Trophy, BarChart3, Lock, TrendingUp } from 'lucide-react'
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

function MenuTile({
  href,
  label,
  title,
  sub,
  stat,
  statLabel,
  admin,
  icon,
}: {
  href: string
  label: string
  title: string
  sub: string
  stat?: React.ReactNode
  statLabel?: string
  admin?: boolean
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`rib-menu-tile ${admin ? 'rib-menu-tile--admin' : ''}`}
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
}: FifaMenuGridProps) {
  return (
    <div className="rib-menu-wrap">

      {/* ── LEFT: HERO / TOP SCORER ── */}
      <Link href="/runitback/leaderboard" className="rib-hero-tile group">
        {/* Label */}
        <span className="rib-heading text-[11px] text-rib-acc block mb-6" style={{ letterSpacing: '4px' }}>
          TOP SCORER — SEASON 2025
        </span>

        {topScorer ? (
          <>
            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-full bg-rib-acc2 text-white rib-heading text-4xl mb-5 overflow-hidden border-4"
              style={{
                width: 96,
                height: 96,
                borderColor: 'var(--acc)',
                boxShadow: '0 0 32px color-mix(in srgb, var(--acc) 40%, transparent)',
              }}
            >
              {topScorer.player.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={topScorer.player.avatar_url}
                  alt={topScorer.player.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(topScorer.player.name)
              )}
            </div>

            {/* Position badge */}
            {topScorer.player.position && (
              <span
                className="rib-heading text-[10px] px-2 py-0.5 rounded mb-3 inline-block self-start"
                style={{
                  letterSpacing: '3px',
                  background: 'color-mix(in srgb, var(--acc) 15%, transparent)',
                  color: 'var(--acc)',
                  border: '1px solid color-mix(in srgb, var(--acc) 30%, transparent)',
                }}
              >
                {topScorer.player.position}
              </span>
            )}

            {/* Name */}
            <h1 className="rib-heading text-4xl sm:text-5xl text-white leading-none mb-1">
              {topScorer.player.name.toUpperCase()}
            </h1>
            {topScorer.player.nickname && (
              <p className="rib-body text-sm mb-4">&ldquo;{topScorer.player.nickname}&rdquo;</p>
            )}

            {/* Big stat */}
            <div className="mt-4 mb-1">
              <span className="rib-stat" style={{ fontSize: '72px', lineHeight: 1 }}>
                {topScorer.goals}
              </span>
            </div>
            <p className="rib-heading text-xs text-rib-muted mb-6" style={{ letterSpacing: '3px' }}>
              GOALS
            </p>

            {/* Secondary stats row */}
            <div className="flex gap-5 mb-6">
              <div>
                <p className="rib-stat text-xl">{topScorer.assists}</p>
                <p className="rib-heading text-[9px] text-rib-muted" style={{ letterSpacing: '2px' }}>ASSISTS</p>
              </div>
              <div>
                <p className="rib-stat text-xl">{topScorer.motm}</p>
                <p className="rib-heading text-[9px] text-rib-muted" style={{ letterSpacing: '2px' }}>MOTM</p>
              </div>
              <div>
                <p className="rib-stat text-xl">{Math.round(topScorer.winRate)}%</p>
                <p className="rib-heading text-[9px] text-rib-muted" style={{ letterSpacing: '2px' }}>WIN RATE</p>
              </div>
            </div>

            {/* Form */}
            <div className="mt-auto">
              <p className="rib-heading text-[9px] text-rib-muted mb-2" style={{ letterSpacing: '3px' }}>
                LAST 5 MATCHES
              </p>
              <FormBadges form={topScorer.form} />
            </div>

            {/* CTA */}
            <div
              className="mt-6 inline-flex items-center gap-2 rib-heading text-xs group-hover:gap-3 transition-all"
              style={{ letterSpacing: '2px', color: 'var(--acc)' }}
            >
              VIEW LEADERBOARD →
            </div>
          </>
        ) : (
          <>
            <div
              className="flex items-center justify-center rounded-full rib-heading text-3xl mb-6"
              style={{
                width: 96, height: 96,
                background: 'color-mix(in srgb, var(--acc2) 20%, transparent)',
                border: '2px dashed var(--border)',
                color: 'var(--muted)',
              }}
            >
              ?
            </div>
            <h1 className="rib-heading text-4xl text-white mb-2">NO DATA YET</h1>
            <p className="rib-body text-sm">Log your first match to see stats here.</p>
            <div
              className="mt-8 inline-flex items-center gap-2 rib-heading text-xs"
              style={{ letterSpacing: '2px', color: 'var(--acc)' }}
            >
              GO TO ADMIN →
            </div>
          </>
        )}
      </Link>

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
      </div>
    </div>
  )
}
