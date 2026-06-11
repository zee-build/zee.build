import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import ThemeProvider from '@/components/runitback/ThemeProvider'
import FifaNav from '@/components/runitback/FifaNav'
import { SEASON_LABEL } from '@/lib/runitback/config'
import './runitback.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic', 'normal'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Run It Back',
  description: `Friday & Tuesday five-a-side stats hub — ${SEASON_LABEL}`,
}

export default function RunItBackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} font-barlow`}>
      <ThemeProvider>
        <FifaNav />
        <main className="rib-main">{children}</main>
        <footer className="px-4 md:px-8 py-4 text-right" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="rib-heading text-[10px] text-rib-muted" style={{ letterSpacing: '3px' }}>
            RUN IT BACK · {SEASON_LABEL}
          </span>
        </footer>
      </ThemeProvider>
    </div>
  )
}
