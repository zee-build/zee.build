'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RotateCw } from 'lucide-react'
import type { PlayerStats } from '@/lib/runitback/types'
import { getInitials, tierForRating } from '@/lib/runitback/queries'
import { getClub, getCountry } from '@/lib/runitback/config'

/**
 * Uses the real FIFA 16 card PNGs from thomasrye/fut-cards as the
 * background image, then absolutely positions every text element
 * exactly as the original fut-cards.css does.
 *
 * Card size = large (202 × 316px) which matches the assets perfectly.
 * We scale it down to 180×282 for grid use ("mini" variant) and keep
 * full size for the profile page ("full" variant).
 */

// ── Background image paths (served from /public/runitback/cards/) ──
const CARD_BG: Record<string, string> = {
  gold:   '/runitback/cards/fifa16/large-rare-gold.png',
  silver: '/runitback/cards/fifa16/large-rare-silver.png',
  bronze: '/runitback/cards/fifa16/large-rare-bronze.png',
  motm:   '/runitback/cards/fifa16/large-motm.png',
  tots_gold: '/runitback/cards/fifa16/large-tots-gold.png',
  toty:   '/runitback/cards/fifa16/large-toty.png',
  hero:   '/runitback/cards/fifa16/large-hero.png',
  potw:   '/runitback/cards/fifa16/large-if-gold.png',
}

// ── Per-tier text colours (from fut-cards.css) ──────────────────────
const TIER_COLOR: Record<string, string> = {
  gold:      '#000',   // rare gold = dark text on golden bg
  silver:    '#000',
  bronze:    '#000',
  motm:      '#fff',
  tots_gold: '#ebd56d',
  toty:      '#d2ebfa',
  hero:      '#26042f',
  potw:      '#fff',
}

// ── Determine which card type to use ────────────────────────────────
function cardType(stats: PlayerStats): string {
  // Best overall player of the season gets the one-of-a-kind TOTY card
  if (stats.seasonAward === 'toty') return 'toty'
  // Season's top scorer (besides the TOTY player) gets the Hero card
  if (stats.seasonAward === 'hero') return 'hero'
  // Best performer in the most recent week gets the in-form Player of the Week card
  if (stats.weeklyAward === 'potw') return 'potw'
  // Players with 3+ MOTM awards get the special orange MOTM card
  if (stats.motm >= 3) return 'motm'
  // Top-tier players (5+ goals, gold rating) get TOTS gold
  if (stats.overall >= 88 && stats.goals >= 5 && stats.awardsEligible) return 'tots_gold'
  return tierForRating(stats.overall) // 'gold' | 'silver' | 'bronze'
}

interface FifaCardProps {
  stats: PlayerStats
  variant?: 'mini' | 'full'
  href?: string
  onClick?: () => void
  showRatings?: boolean
}

interface StatAttr {
  label: string
  value: number | string
}

// The native PNG size is 202 × 316.
// We'll render at that exact size and scale via CSS transform.
const NATIVE_W = 202
const NATIVE_H = 316

export default function FifaCard({ stats, variant = 'mini', href, onClick, showRatings = true }: FifaCardProps) {
  const { player, overall } = stats
  const type = cardType(stats)
  const bgSrc = CARD_BG[type] ?? CARD_BG.bronze
  const color = TIER_COLOR[type] ?? '#000'
  const club = getClub(player.favorite_team)
  const country = getCountry(player.country)
  const [flipped, setFlipped] = useState(false)

  // Display size — mini for grid, full for profile
  const displayW = variant === 'full' ? 202 : 160
  const scale = displayW / NATIVE_W

  // Front face: match-stat attributes (3 left, 3 right) — same as real FUT
  const statAttrs: StatAttr[] = [
    { label: 'GOL', value: stats.goals },
    { label: 'ASS', value: stats.assists },
    { label: 'MOT', value: stats.motm },
    { label: 'WIN', value: Math.round(stats.winRate) },
    { label: 'GAM', value: stats.games },
    { label: 'STR', value: stats.streak },
  ]

  // Back face: teammate-rated skill attributes.
  // Goalkeepers swap SHOOTING for their dedicated GK rating since it's
  // the more relevant stat and the card layout is fixed at 6 slots.
  const ratings = stats.attributeRatings
  const isGK = player.position === 'GK'
  const skillAttrs: StatAttr[] = [
    { label: 'PAC', value: showRatings ? (ratings?.pace ?? '—') : '—' },
    isGK
      ? { label: 'GKR', value: showRatings ? (stats.gkRating ?? '—') : '—' }
      : { label: 'SHO', value: showRatings ? (ratings?.shooting ?? '—') : '—' },
    { label: 'PAS', value: showRatings ? (ratings?.passing ?? '—') : '—' },
    { label: 'DRI', value: showRatings ? (ratings?.dribbling ?? '—') : '—' },
    { label: 'DEF', value: showRatings ? (ratings?.defending ?? '—') : '—' },
    { label: 'PHY', value: showRatings ? (ratings?.physical ?? '—') : '—' },
  ]

  const renderAttrGrid = (attrs: StatAttr[]) =>
    attrs.map((attr, i) => {
      const col = i < 3 ? 0 : 1
      const row = i % 3
      // Positions from fut-cards.css large card attr layout
      const left = col === 0 ? 28 : 114
      const tops = [188, 214, 240]
      const top = tops[row]
      return (
        <div
          key={attr.label}
          style={{
            position: 'absolute',
            top,
            left,
            width: 95,
            fontSize: 18,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'baseline',
            gap: 5,
            color,
          }}
        >
          <span style={{ fontWeight: 700, minWidth: 28 }}>{attr.value}</span>
          <span style={{ fontSize: 10, opacity: 0.75, letterSpacing: 1 }}>{attr.label}</span>
        </div>
      )
    })

  const renderFace = (attrs: StatAttr[]) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: NATIVE_W,
        height: NATIVE_H,
        backfaceVisibility: 'hidden',
        backgroundImage: `url(${bgSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        fontFamily: "'Open Sans', 'Barlow Condensed', sans-serif",
        fontWeight: 700,
        textTransform: 'uppercase',
        color,
      }}
    >
      {/* ── RATING (top-left) — matches .fut16.card-large .playercard-rating ── */}
      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 700,
          width: 50,
          top: 16,
          left: 36,
          lineHeight: 1,
          color,
        }}
      >
        {showRatings ? overall : '—'}
      </div>

      {/* ── CLUB BADGE — empty space to the left of the player picture ── */}
      {club && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/runitback/badges/${club.file}`}
          alt={club.name}
          title={club.name}
          style={{
            position: 'absolute',
            top: 76,
            left: 14,
            width: 48,
            height: 48,
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
          }}
        />
      )}

      {/* ── POSITION — matches .fut16.card-large .playercard-position ── */}
      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
          width: 50,
          top: 53,
          left: 36,
          fontSize: 14,
          color,
        }}
      >
        {player.position ?? '—'}
      </div>

      {/* ── PLAYER PICTURE / AVATAR ── */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 70,
          width: 130,
          height: 140,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {player.avatar_url ? (
          // Photo: fill the zone, fade bottom edge into card via mask
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={player.avatar_url}
              alt={player.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                // Fade bottom 30% so it blends into the name bar
                maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
              }}
            />
          </div>
        ) : (
          // No photo: show a silhouette with initials
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: type === 'motm' || type === 'tots_gold'
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(0,0,0,0.18)',
              border: `2px solid ${type === 'motm' || type === 'tots_gold' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 900,
              fontStyle: 'italic',
              fontFamily: "'Barlow Condensed', 'Open Sans', sans-serif",
              letterSpacing: 1,
              color: type === 'motm' || type === 'tots_gold' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)',
              marginBottom: 8,
            }}
          >
            {getInitials(player.name)}
          </div>
        )}
      </div>

      {/* ── PLAYER NAME — matches .fut16.card-large .playercard-name ── */}
      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 700,
          width: 184,
          top: 163,
          left: 7,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color,
        }}
      >
        {player.name}
      </div>

      {/* ── 6 STAT ATTRIBUTES (3 left, 3 right) ── */}
      {renderAttrGrid(attrs)}

      {/* ── COUNTRY FLAG — bottom center ── */}
      {country && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
          alt={country.name}
          title={country.name}
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 14,
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* ── REGULAR / GUEST badge — bottom of card ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 10,
          fontSize: 8,
          letterSpacing: 2,
          opacity: 0.6,
          color,
          fontWeight: 700,
        }}
      >
        {player.is_regular ? 'REGULAR' : 'GUEST'}
      </div>
    </div>
  )

  const card = (
    <div
      style={{
        position: 'relative',
        width: NATIVE_W,
        height: NATIVE_H,
        perspective: 1000,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        flexShrink: 0,
        cursor: href || onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        {renderFace(statAttrs)}
        <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          {renderFace(skillAttrs)}
        </div>
      </div>

      {/* ── FLIP BUTTON — toggles match stats vs. teammate-rated attributes ── */}
      <div
        role="button"
        tabIndex={0}
        title="Flip card"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setFlipped((f) => !f)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            setFlipped((f) => !f)
          }
        }}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <RotateCw size={13} color="#fff" />
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-transform hover:scale-105 hover:-translate-y-1"
        style={{ width: displayW, height: Math.round(NATIVE_H * scale) }}
      >
        {card}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block transition-transform hover:scale-105 hover:-translate-y-1"
        style={{ width: displayW, height: Math.round(NATIVE_H * scale) }}
      >
        {card}
      </button>
    )
  }

  return (
    <div
      style={{
        width: displayW,
        height: Math.round(NATIVE_H * scale),
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {card}
    </div>
  )
}
