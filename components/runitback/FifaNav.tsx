'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useRibTheme } from './ThemeProvider'

const TABS = [
  { label: 'HOME', href: '/runitback' },
  { label: 'PLAYERS', href: '/runitback/players' },
  { label: 'MATCHES', href: '/runitback/matches' },
  { label: 'LEADERBOARD', href: '/runitback/leaderboard' },
  { label: 'STATS', href: '/runitback/stats' },
  { label: 'ADMIN', href: '/runitback/admin' },
]

export default function FifaNav() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useRibTheme()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/runitback' ? pathname === href : pathname?.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-rib-border bg-rib-bg/95 backdrop-blur">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-rib-border">
        <Link href="/runitback" className="rib-heading text-2xl text-rib-acc">
          Run It Back
        </Link>
        <span className="rib-body hidden sm:block text-xs tracking-wide">
          Season 2025 · Friday &amp; Tuesday · Muweilah
        </span>
        <button
          className="sm:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Nav bar */}
      <nav className="px-4 md:px-8">
        <div className={`${open ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 sm:py-0`}>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-6">
            {TABS.map((tab) => {
              const active = isActive(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={`rib-heading text-sm py-2.5 sm:py-3 border-b-2 transition-colors ${
                    active
                      ? 'text-white border-rib-acc'
                      : 'text-rib-muted border-transparent hover:text-white'
                  }`}
                  style={{ letterSpacing: '2px' }}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
          <button
            onClick={toggleTheme}
            className="rib-heading text-xs self-start sm:self-auto mb-2 sm:mb-0 px-3 py-1.5 border border-rib-border rounded text-rib-muted hover:text-white hover:border-rib-acc transition-colors"
            style={{ letterSpacing: '2px' }}
          >
            {theme === 'volta' ? 'VOLTA' : 'CAREER'}
          </button>
        </div>
      </nav>
    </header>
  )
}
