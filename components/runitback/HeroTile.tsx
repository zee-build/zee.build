'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import FormBadges from './FormBadges'
import { getInitials } from '@/lib/runitback/queries'
import type { PlayerStats } from '@/lib/runitback/types'

/* ── Animated counter hook ──────────────────────────────────── */
function useCounter(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

/* ── Floating particle ──────────────────────────────────────── */
interface Particle {
  id: number
  x: number      // % from left
  delay: number  // s
  dur: number    // s
  size: number   // px
  opacity: number
}

function genParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    delay: Math.random() * 4,
    dur: 4 + Math.random() * 4,
    size: 2 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.35,
  }))
}

export default function HeroTile({ topScorer }: { topScorer: PlayerStats | null }) {
  const [particles] = useState<Particle[]>(() => genParticles(18))
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)
  const goalCount = useCounter(topScorer?.goals ?? 0, 1600)

  // Trigger entrance animations on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Link
      ref={ref}
      href="/runitback/leaderboard"
      className="rib-hero-tile group"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* ── Animated background glow blobs ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: topScorer
            ? 'radial-gradient(ellipse 80% 60% at 30% 40%, color-mix(in srgb, var(--acc2) 22%, transparent), transparent 70%)'
            : 'none',
          animation: 'rib-hero-pulse 6s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 40% at 80% 80%, color-mix(in srgb, var(--acc) 10%, transparent), transparent 70%)',
          animation: 'rib-hero-pulse 8s ease-in-out infinite reverse',
        }}
      />

      {/* ── Diagonal shine sweep on hover ── */}
      <div
        aria-hidden
        className="group-hover:rib-shine-active"
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          animation: 'rib-shine-sweep 3s ease-in-out infinite',
        }}
      />

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: -p.size,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--acc)',
            opacity: p.opacity,
            zIndex: 1,
            pointerEvents: 'none',
            animation: `rib-float ${p.dur}s ${p.delay}s ease-in infinite`,
          }}
        />
      ))}

      {/* ── Content — z-index above decorations ── */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Label */}
        <span
          className="rib-heading text-[11px] text-rib-acc block mb-6"
          style={{ letterSpacing: '4px', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(-8px)', transition: 'opacity 0.5s, transform 0.5s' }}
        >
          TOP SCORER — SEASON 2025
        </span>

        {topScorer ? (
          <>
            {/* Avatar with ring pulse */}
            <div
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                marginBottom: 20,
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'scale(0.8)',
                transition: 'opacity 0.6s 0.1s, transform 0.6s 0.1s',
              }}
            >
              {/* Pulse rings */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: -(i * 8 + 4),
                    borderRadius: '50%',
                    border: '1px solid var(--acc)',
                    opacity: 0,
                    animation: `rib-ring-pulse 3s ${i * 0.8}s ease-out infinite`,
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Glowing border */}
              <div
                style={{
                  position: 'absolute', inset: -3, borderRadius: '50%',
                  background: 'conic-gradient(var(--acc), var(--acc2), var(--acc))',
                  animation: 'rib-spin 4s linear infinite',
                  zIndex: 0,
                }}
              />
              {/* Avatar inner */}
              <div
                style={{
                  position: 'absolute', inset: 2, borderRadius: '50%',
                  overflow: 'hidden', zIndex: 1,
                  background: 'var(--bg2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {topScorer.player.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={topScorer.player.avatar_url}
                    alt={topScorer.player.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="rib-heading text-3xl" style={{ color: 'var(--acc)' }}>
                    {getInitials(topScorer.player.name)}
                  </span>
                )}
              </div>
            </div>

            {/* Position badge */}
            {topScorer.player.position && (
              <span
                className="rib-heading text-[10px] px-2 py-0.5 rounded mb-3 self-start"
                style={{
                  letterSpacing: '3px',
                  background: 'color-mix(in srgb, var(--acc) 15%, transparent)',
                  color: 'var(--acc)',
                  border: '1px solid color-mix(in srgb, var(--acc) 30%, transparent)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateX(-10px)',
                  transition: 'opacity 0.5s 0.2s, transform 0.5s 0.2s',
                }}
              >
                {topScorer.player.position}
              </span>
            )}

            {/* Name — slides in from left */}
            <h1
              className="rib-heading text-4xl sm:text-5xl text-white leading-none mb-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateX(-20px)',
                transition: 'opacity 0.55s 0.25s, transform 0.55s 0.25s',
              }}
            >
              {topScorer.player.name.toUpperCase()}
            </h1>
            {topScorer.player.nickname && (
              <p className="rib-body text-sm mb-4">&ldquo;{topScorer.player.nickname}&rdquo;</p>
            )}

            {/* Big goals counter — animated number */}
            <div
              style={{
                marginTop: 16, marginBottom: 4,
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'scale(0.6)',
                transition: 'opacity 0.6s 0.35s, transform 0.6s 0.35s',
                position: 'relative',
              }}
            >
              {/* Glow behind number */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -8, top: -8,
                  fontSize: 88,
                  lineHeight: 1,
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontStyle: 'italic',
                  fontWeight: 800,
                  color: 'var(--acc)',
                  opacity: 0.12,
                  filter: 'blur(12px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {topScorer.goals}
              </span>
              <span className="rib-stat" style={{ fontSize: 80, lineHeight: 1 }}>
                {goalCount}
              </span>
            </div>
            <p
              className="rib-heading text-xs text-rib-muted mb-6"
              style={{ letterSpacing: '3px' }}
            >
              GOALS THIS SEASON
            </p>

            {/* Secondary stats — staggered fade in */}
            <div className="flex gap-5 mb-6">
              {[
                { label: 'ASSISTS', value: topScorer.assists },
                { label: 'MOTM', value: topScorer.motm },
                { label: 'WIN RATE', value: `${Math.round(topScorer.winRate)}%` },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(10px)',
                    transition: `opacity 0.5s ${0.4 + i * 0.1}s, transform 0.5s ${0.4 + i * 0.1}s`,
                  }}
                >
                  <p className="rib-stat text-xl">{s.value}</p>
                  <p className="rib-heading text-[9px] text-rib-muted" style={{ letterSpacing: '2px' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(to right, var(--acc), var(--acc2), transparent)',
                marginBottom: 16,
                opacity: visible ? 0.4 : 0,
                transition: 'opacity 0.8s 0.5s',
              }}
            />

            {/* Form badges */}
            <div
              className="mt-auto"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s 0.6s',
              }}
            >
              <p className="rib-heading text-[9px] text-rib-muted mb-2" style={{ letterSpacing: '3px' }}>
                LAST 5 MATCHES
              </p>
              <FormBadges form={topScorer.form} />
            </div>

            {/* CTA */}
            <div
              className="mt-6 inline-flex items-center gap-2 rib-heading text-xs group-hover:gap-4 transition-all duration-300"
              style={{
                letterSpacing: '2px', color: 'var(--acc)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s 0.7s, gap 0.3s',
              }}
            >
              VIEW LEADERBOARD →
            </div>
          </>
        ) : (
          /* ── Empty state ── */
          <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.2s' }}>
            <div
              className="flex items-center justify-center rounded-full rib-heading text-3xl mb-6"
              style={{
                width: 96, height: 96,
                background: 'color-mix(in srgb, var(--acc2) 20%, transparent)',
                border: '2px dashed var(--border)',
                color: 'var(--muted)',
                animation: 'rib-spin 12s linear infinite',
              }}
            >
              ?
            </div>
            <h1 className="rib-heading text-4xl text-white mb-2">NO DATA YET</h1>
            <p className="rib-body text-sm">Log your first match to see stats here.</p>
            <div className="mt-8 inline-flex items-center gap-2 rib-heading text-xs" style={{ letterSpacing: '2px', color: 'var(--acc)' }}>
              GO TO ADMIN →
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
