"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Sparkles, Heart, Shield, Zap, ChevronDown } from "lucide-react"
import { Hero } from "./components/hero"
import { ScreensGallery } from "./components/screens-gallery"
import { HowItWorks } from "./components/how-it-works"
import { Pricing } from "./components/pricing"
import { WaitlistForm } from "./components/waitlist-form"
import { ThemeSwitcher } from "./components/theme-switcher"
import Link from "next/link"

export default function NutriNestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Track page view
    if (typeof window !== 'undefined') {
      console.log('[Analytics] view_build_nutrinest')
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative">
      <ThemeSwitcher />
      
      <div className="flex flex-col gap-24 pb-32">
        <Hero />
        
        {/* Social Proof */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono uppercase tracking-widest text-primary">
                Built in Public
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Early Access Opening Soon</h3>
            <p className="text-muted-foreground mb-6">
              Want this optimized for UAE supermarkets with common local ingredients? 
              Join the waitlist and help shape the product.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="border-white/10 bg-white/[0.02]">
                <Heart className="w-3 h-3 mr-1" /> Parent-Tested
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/[0.02]">
                <Shield className="w-3 h-3 mr-1" /> Allergy-Safe
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/[0.02]">
                <Zap className="w-3 h-3 mr-1" /> UAE-First
              </Badge>
            </div>
          </motion.div>
        </section>

        <ScreensGallery />
        <HowItWorks />
        <Pricing />
        <WaitlistForm />

        {/* Build Log Link */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link 
              href="/builds/nutrinest/log"
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
