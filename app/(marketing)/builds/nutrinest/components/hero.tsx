"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronDown } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function Hero() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
      // Track CTA click
      console.log('[Analytics] click_waitlist_cta', { source: 'hero' })
    }
  }

  const scrollToScreens = () => {
    const screensSection = document.getElementById('screens')
    if (screensSection) {
      screensSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,176,0,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-mono uppercase tracking-widest">
              Phase 01 • Active Development
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            NutriNest
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            Toddler Nutrition Planner (6 months – 3 years)
          </motion.p>

          {/* One-liner */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Netflix-style meal discovery + pantry mode + weekly meal plans for busy parents.
          </motion.p>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {["UAE-First", "Budget-Friendly", "Allergy-Aware", "Age-Appropriate"].map((feature, i) => (
              <Badge
                key={feature}
                variant="secondary"
                className="bg-white/5 border-white/10 text-sm px-4 py-2"
              >
                {feature}
              </Badge>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton>
              <button
                onClick={scrollToWaitlist}
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 shadow-lg shadow-primary/20"
              >
                Join the Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={scrollToScreens}
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 px-8 text-sm font-bold bg-white/5 backdrop-blur-sm transition-transform hover:scale-105"
              >
                View Screens <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-2 bg-white/40 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
