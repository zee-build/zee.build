"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Hero } from "./components/hero"
import { ScreensGallery } from "./components/screens-gallery"
import { HowItWorks } from "./components/how-it-works"
import { RiskEngine } from "./components/risk-engine"
import { Pricing } from "./components/pricing"
import { WaitlistForm } from "./components/waitlist-form"
import Link from "next/link"

export default function SentinelRiskPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      console.log('[Analytics] view_build_sentinelrisk')
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative">
      <div className="flex flex-col gap-24 pb-32">
        <Hero />
        
        <ScreensGallery />
        <HowItWorks />
        <RiskEngine />
        <Pricing />
        <WaitlistForm />

        {/* Build Log Link */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link 
              href="/builds/sentinelrisk/log"
              className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              View Build Log <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
