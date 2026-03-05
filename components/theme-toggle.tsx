"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Flame, Baby, ChevronDown } from "lucide-react"
import { useTheme, Theme } from "./theme-provider"

const themes: { id: Theme; name: string; icon: any; color: string }[] = [
  { id: "dark", name: "Dark", icon: Moon, color: "text-blue-400" },
  { id: "light", name: "Light", icon: Sun, color: "text-amber-400" },
  { id: "amber", name: "Amber", icon: Flame, color: "text-orange-500" },
  { id: "kids", name: "Kids", icon: Baby, color: "text-pink-500" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
    )
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0]
  const Icon = currentTheme.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3 h-10 rounded-full bg-card/40 border border-border hover:border-primary/40 hover:bg-card/60 transition-all duration-300"
        aria-label="Select theme"
      >
        <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        
        <Icon className={`w-4 h-4 ${currentTheme.color} transition-colors`} />
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block">
          {theme}
        </span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-full right-0 mt-2 z-50 p-1.5 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl min-w-[140px]"
            >
              {themes.map((t) => {
                const TIcon = t.icon
                const isActive = theme === t.id
                
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-card/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TIcon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : t.color}`} />
                    <span className="text-[10px] font-mono uppercase tracking-wider">{t.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-theme-dot"
                        className="ml-auto w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
