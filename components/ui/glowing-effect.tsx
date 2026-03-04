"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowingEffectProps {
  children: React.ReactNode
  className?: string
  glowClassName?: string
  spread?: number
  blur?: number
  opacity?: number
  disabled?: boolean
}

export const GlowingEffect = ({
  children,
  className,
  glowClassName,
  spread = 40,
  blur = 30,
  opacity = 0.4,
  disabled = false,
}: GlowingEffectProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    },
    [mouseX, mouseY]
  )

  if (disabled) return <div className={cn("relative", className)}>{children}</div>

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("group relative", className)}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-px z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          glowClassName
        )}
        style={{
          background: `radial-gradient(${spread}px circle at ${mouseX}px ${mouseY}px, hsl(var(--primary) / ${opacity}), transparent 80%)`,
          filter: `blur(${blur}px)`,
        }}
      />
      {/* Subtle silver border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-[inherit] border border-foreground/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${spread * 1.5}px circle at ${mouseX}px ${mouseY}px, rgba(217, 217, 217, 0.1), transparent 80%)`,
        }}
      />
    </div>
  )
}
