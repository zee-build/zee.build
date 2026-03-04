"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Flame, Baby } from "lucide-react"

type Theme = "light" | "dark" | "warm" | "kids"

const themes = [
  { id: "light" as Theme, name: "Light", icon: Sun },
  { id: "dark" as Theme, name: "Dark", icon: Moon },
  { id: "warm" as Theme, name: "Warm", icon: Flame },
  { id: "kids" as Theme, name: "Kids", icon: Baby },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('nutrinest-theme') as Theme
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    
    // Apply theme-specific CSS variables
    const root = document.documentElement
    
    switch (theme) {
      case "light":
        root.style.setProperty('--background', '0 0% 98%')
        root.style.setProperty('--foreground', '0 0% 10%')
        root.style.setProperty('--card', '0 0% 100%')
        root.style.setProperty('--muted', '0 0% 90%')
        root.style.setProperty('--muted-foreground', '0 0% 40%')
        break
      case "dark":
        root.style.setProperty('--background', '0 0% 8%')
        root.style.setProperty('--foreground', '0 0% 90%')
        root.style.setProperty('--card', '0 0% 10%')
        root.style.setProperty('--muted', '0 0% 15%')
        root.style.setProperty('--muted-foreground', '0 0% 65%')
        break
      case "warm":
        root.style.setProperty('--background', '30 20% 12%')
        root.style.setProperty('--foreground', '30 10% 92%')
        root.style.setProperty('--card', '30 15% 15%')
        root.style.setProperty('--muted', '30 15% 20%')
        root.style.setProperty('--muted-foreground', '30 10% 70%')
        root.style.setProperty('--primary', '30 100% 60%')
        break
      case "kids":
        root.style.setProperty('--background', '280 30% 95%')
        root.style.setProperty('--foreground', '280 50% 20%')
        root.style.setProperty('--card', '280 40% 98%')
        root.style.setProperty('--muted', '280 20% 85%')
        root.style.setProperty('--muted-foreground', '280 30% 40%')
        root.style.setProperty('--primary', '340 100% 60%')
        break
    }
  }

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('nutrinest-theme', theme)
    setIsOpen(false)
    
    // Track theme change
    console.log('[Analytics] theme_change', { theme })
  }

  const CurrentIcon = themes.find(t => t.id === currentTheme)?.icon || Moon

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-colors shadow-lg"
          aria-label="Theme Switcher"
        >
          <CurrentIcon className="w-5 h-5" />
        </motion.button>

        {/* Theme Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-full right-0 mt-2 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl min-w-[160px]"
            >
              {themes.map((theme) => {
                const Icon = theme.icon
                const isActive = currentTheme === theme.id
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{theme.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-theme"
                        className="ml-auto w-2 h-2 rounded-full bg-current"
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
