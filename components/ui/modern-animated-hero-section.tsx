"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMotionSettings } from "./motion-wrapper"

interface ModernAnimatedHeroProps {
  className?: string
  title: string
  subtitle: string
  highlightColor?: string
}

const MAX_COLUMNS = 20 // Reduced from 40
const MAX_CHARS_PER_COLUMN = 10 // Reduced from 15

export const ModernAnimatedHero = ({
  className,
  title,
  subtitle,
  highlightColor = "hsl(var(--primary))",
}: ModernAnimatedHeroProps) => {
  const { shouldReduceMotion } = useMotionSettings()

  return (
    <section 
      className={cn("relative w-full flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-24 md:py-32", className)}
      style={{ minHeight: 'clamp(500px, 70vh, 900px)' }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-10 bg-[radial-gradient(circle_at_center,#00f3ff_0%,transparent_70%)] blur-[100px] animate-[pulse_4s_ease-in-out_infinite]" />
      </div>

      {/* Background Kinetic Rain */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/40 z-[1]" />
          <div className="absolute inset-0 opacity-40 md:opacity-60">
            <RainEffect />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 md:mb-6 font-mono drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
          {shouldReduceMotion ? title : <ScrambleText text={title} />}
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-8"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Mask edges */}
      <div className="absolute inset-x-0 top-0 h-40 md:h-64 bg-gradient-to-b from-background via-background/80 to-transparent z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-40 md:h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-[2]" />
    </section>
  )
}

const ScrambleText = ({ text }: { text: string }) => {
  const chars = "!<>-_\\/[]{}—=+*^?#________"
  const [displayText, setDisplayText] = useState(text)
  const iteration = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    iteration.current = 0
    
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration.current) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      if (iteration.current >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      iteration.current += 1 / 3
    }, 30)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text])

  return (
    <span className="inline-block">
      {displayText.split("").map((char, i) => (
        <span 
          key={i} 
          className={cn(
            char === text[i] ? "text-foreground" : "text-primary/60",
            "transition-colors duration-100"
          )}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

const RainEffect = () => {
  const [columns, setColumns] = useState<number[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const columnCount = isMobile ? Math.floor(MAX_COLUMNS / 2) : MAX_COLUMNS
    setColumns(Array.from({ length: columnCount }, (_, i) => i))
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  return (
    <div className="flex justify-between h-full w-full">
      {columns.map((i) => (
        <RainColumn key={i} />
      ))}
    </div>
  )
}

const RainColumn = () => {
  const [chars, setChars] = useState<string[]>([])
  const charsRef = useRef("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const generateChars = () => {
      setChars(Array.from({ length: MAX_CHARS_PER_COLUMN }, () => 
        charsRef.current[Math.floor(Math.random() * charsRef.current.length)]
      ))
    }
    
    generateChars()
    intervalRef.current = setInterval(generateChars, 2000 + Math.random() * 3000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ y: -500 }}
      animate={{ y: 1000 }}
      transition={{
        duration: 10 + Math.random() * 20,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 10
      }}
      className="flex flex-col text-[10px] md:text-[12px] font-mono leading-none font-bold"
    >
      {chars.map((c, idx) => {
        const colors = ["text-foreground/40", "text-lab-cyan/60", "text-lab-magenta/40", "text-primary/40"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <span key={idx} className={cn("py-1", color)}>
            {c}
          </span>
        );
      })}
    </motion.div>
  )
}
