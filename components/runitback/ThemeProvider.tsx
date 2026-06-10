'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type RibTheme = 'volta' | 'career'

const STORAGE_KEY = 'runitback-theme'

interface ThemeContextValue {
  theme: RibTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'volta',
  toggleTheme: () => {},
})

export function useRibTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<RibTheme>('volta')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'volta' || stored === 'career') {
      setTheme(stored)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'volta' ? 'career' : 'volta'
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-rib-theme={theme} className="rib-root">
        <div className="rib-bg" />
        <div className="rib-content">{children}</div>
      </div>
    </ThemeContext.Provider>
  )
}
