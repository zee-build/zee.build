"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "amber" | "kids"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("zee-build-theme") as Theme
    if (savedTheme && ["light", "dark", "amber", "kids"].includes(savedTheme)) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
    setMounted(false) // Trigger hydration-safe render if needed
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("zee-build-theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
