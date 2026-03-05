"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('zee-build-theme')
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(prefersDark)
    applyTheme(prefersDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    
    // Apply theme-specific CSS variables
    const root = document.documentElement
    
    if (dark) {
      root.style.setProperty('--background', '0 0% 8%')
      root.style.setProperty('--foreground', '0 0% 90%')
      root.style.setProperty('--card', '0 0% 10%')
      root.style.setProperty('--muted', '0 0% 15%')
      root.style.setProperty('--muted-foreground', '0 0% 65%')
    } else {
      root.style.setProperty('--background', '0 0% 98%')
      root.style.setProperty('--foreground', '0 0% 10%')
      root.style.setProperty('--card', '0 0% 100%')
      root.style.setProperty('--muted', '0 0% 90%')
      root.style.setProperty('--muted-foreground', '0 0% 40%')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('zee-build-theme', newTheme ? 'dark' : 'light')
    console.log('[Analytics] theme_toggle', { theme: newTheme ? 'dark' : 'light' })
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      
      {/* Icon */}
      <div className="relative z-10">
        {isDark ? (
          <Moon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <Sun className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>
    </button>
  )
}
