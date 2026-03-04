"use client"

import React, { useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMotionSettings } from "./motion-wrapper"

interface HalideTopoHeroProps {
  className?: string
  title: string
  subtitle: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  hudLabels?: { label: string; value: string }[]
}

export const HalideTopoHero = ({
  className,
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  hudLabels = [],
}: HalideTopoHeroProps) => {
  const { shouldReduceMotion } = useMotionSettings()
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring config for smooth parallax
  const springConfig = { stiffness: 100, damping: 30, mass: 1 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Disable parallax on reduced motion
  useEffect(() => {
    if (shouldReduceMotion) {
      mouseX.set(0)
      mouseY.set(0)
    }
  }, [shouldReduceMotion, mouseX, mouseY])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || shouldReduceMotion) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / 50)
    mouseY.set((e.clientY - centerY) / 50)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-background bg-vignette px-4 py-32 md:py-32 py-24",
        className
      )}
      style={{ minHeight: 'clamp(600px, 90vh, 1200px)' }}
    >
      {/* Background Topo Layers */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-20 hidden md:block">
          <TopoLayer x={x} y={y} factor={1.2} opacity={0.5} />
          <TopoLayer x={x} y={y} factor={0.8} opacity={0.3} />
          <TopoLayer x={x} y={y} factor={0.4} opacity={0.15} />
        </div>
      )}

      {/* Grid HUD Overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tech HUD Mini Labels */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {hudLabels.map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                  {item.label}
                </span>
                <span className="text-[11px] font-mono text-primary/80">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaText && ctaHref && (
              <motion.a
                href={ctaHref}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="relative inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden group"
                aria-label={ctaText}
              >
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">{ctaText}</span>
              </motion.a>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <motion.a
                href={secondaryCtaHref}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={secondaryCtaText}
              >
                {secondaryCtaText}
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Gradient Bottom Mask */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  )
}

const TopoLayer = ({ x, y, factor, opacity }: { x: any; y: any; factor: number; opacity: number }) => {
  return (
    <motion.div
      style={{
        x: useTransform(x, (val: number) => val * factor * 10),
        y: useTransform(y, (val: number) => val * factor * 10),
        opacity,
      }}
      className="absolute inset-[-10%] flex items-center justify-center"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[120%] h-[120%]"
      >
        <path
          d="M0 500C200 400 300 600 500 500C700 400 800 600 1000 500M0 450C200 350 300 550 500 450C700 350 800 550 1000 450M0 550C200 450 300 650 500 550C700 450 800 650 1000 550M0 400C200 300 300 500 500 400C700 300 800 500 1000 400M0 600C200 500 300 700 500 600C700 500 800 700 1000 600"
          stroke="white"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M250 0C350 200 150 300 250 500C350 700 150 800 250 1000M300 0C400 200 200 300 300 500C400 700 200 800 300 1000M200 0C300 200 100 300 200 500C300 700 100 800 200 1000"
          stroke="white"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="500" cy="500" r="300" stroke="white" strokeWidth="0.2" strokeDasharray="4 4" />
        <circle cx="500" cy="500" r="450" stroke="white" strokeWidth="0.1" strokeDasharray="2 8" />
      </svg>
    </motion.div>
  )
}

export const HalideLanding = () => {
  return (
    <HalideTopoHero
      title="Systems that ship."
      subtitle="A laboratory for high-performance SaaS, automation, and architectural experiments. Built in public for the modern web."
      ctaText="Explore the Lab"
      ctaHref="/builds"
      secondaryCtaText="LinkedIn"
      secondaryCtaHref="https://www.linkedin.com/in/ziyanbinanoos/"
      hudLabels={[
        { label: "STATUS", value: "ACTIVE_BUILD" },
        { label: "COORD", value: "25.2048° N, 55.2708° E" },
        { label: "ENGINE", value: "NEXT_JS_15" }
      ]}
    />
  )
}
