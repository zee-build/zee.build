'use client'

import { useEffect, useState } from 'react'
import { SEASON_LABEL } from '@/lib/runitback/config'

const SESSION_KEY = 'rib_welcome_seen'
const AUTO_DISMISS_MS = 4000

export default function WelcomeSplash() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) return
    setVisible(true)
    const t = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function dismiss() {
    setExiting(true)
    sessionStorage.setItem(SESSION_KEY, '1')
    setTimeout(() => setVisible(false), 650)
  }

  if (!mounted || !visible) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Dismiss welcome screen"
      onClick={dismiss}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dismiss()}
      className={`rib-splash ${exiting ? 'rib-splash--exit' : ''}`}
    >
      {/* Angular background shapes */}
      <div className="rib-splash-shape rib-splash-shape--1" aria-hidden />
      <div className="rib-splash-shape rib-splash-shape--2" aria-hidden />
      <div className="rib-splash-shape rib-splash-shape--3" aria-hidden />

      {/* Diagonal shine sweep */}
      <div className="rib-splash-shine" aria-hidden />

      <div className="rib-splash-content">
        <div className="rib-splash-wordmark">
          <span className="rib-splash-bar" aria-hidden />
          <h1 className="rib-heading rib-splash-title">
            RUN IT<br />BACK
          </h1>
        </div>

        <p className="rib-heading rib-splash-subtitle" style={{ letterSpacing: '5px' }}>
          {SEASON_LABEL} · FRIDAY &amp; TUESDAY
        </p>

        <p className="rib-heading rib-splash-cta" style={{ letterSpacing: '4px' }}>
          TAP TO CONTINUE
        </p>
      </div>

      {/* Exit wipe panel */}
      <div className="rib-splash-wipe" aria-hidden />
    </div>
  )
}
