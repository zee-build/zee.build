'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useRibTheme } from './ThemeProvider'

const TABS = [
  { label: 'HOME',        href: '/runitback' },
  { label: 'PLAYERS',     href: '/runitback/players' },
  { label: 'MATCHES',     href: '/runitback/matches' },
  { label: 'LEADERBOARD', href: '/runitback/leaderboard' },
  { label: 'STATS',       href: '/runitback/stats' },
  { label: 'ADMIN',       href: '/runitback/admin' },
]

export default function FifaNav() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useRibTheme()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/runitback' ? pathname === href : pathname?.startsWith(href)

  return (
    <header
      className="sticky top-0 z-50 rib-nav"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 h-14">
        {/* Logo */}
        <Link
          href="/runitback"
          className="rib-heading text-xl text-white tracking-widest flex items-center gap-2"
          style={{ letterSpacing: '4px' }}
        >
          <span
            className="inline-block w-1 h-6 rounded-sm"
            style={{ background: 'var(--acc)' }}
          />
          RUN IT BACK
        </Link>

        {/* Season label — desktop */}
        <span
          className="rib-body hidden lg:block text-[11px] absolute left-1/2 -translate-x-1/2"
          style={{ letterSpacing: '3px' }}
        >
          SEASON 2025 · FRIDAY &amp; TUESDAY
        </span>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rib-heading text-[10px] px-3 py-1 rounded-sm border transition-colors hidden sm:block"
            style={{
              letterSpacing: '2px',
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            {theme === 'volta' ? '⚡ VOLTA' : '🎮 CAREER'}
          </button>

          {/* Hamburger — mobile */}
          <button
            className="sm:hidden text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Nav tabs row */}
      <nav
        className="px-4 md:px-8"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className={`${
            open ? 'flex' : 'hidden'
          } sm:flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-0`}
        >
          {TABS.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setOpen(false)}
                className={`rib-heading text-[11px] px-3 py-3 sm:py-2.5 relative transition-colors ${
                  active ? 'text-white' : 'text-rib-muted hover:text-white'
                }`}
                style={{ letterSpacing: '2.5px' }}
              >
                {tab.label}
                {/* Active indicator */}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: 'var(--acc)',
                      boxShadow: '0 0 8px var(--acc)',
                    }}
                  />
                )}
              </Link>
            )
          })}

          {/* Mobile-only theme toggle */}
          <button
            onClick={toggleTheme}
            className="rib-heading text-[10px] sm:hidden self-start mt-1 mb-3 px-3 py-1 rounded-sm border"
            style={{
              letterSpacing: '2px',
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            {theme === 'volta' ? '⚡ VOLTA' : '🎮 CAREER'}
          </button>
        </div>
      </nav>
    </header>
  )
}
