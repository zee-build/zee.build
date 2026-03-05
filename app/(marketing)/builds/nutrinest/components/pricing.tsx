"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"

const features = [
  "Unlimited meal discovery",
  "Pantry mode with AI suggestions",
  "Weekly meal planner",
  "Grocery list generation",
  "Age-specific nutrition tracking",
  "Allergy & dietary filters",
  "UAE supermarket integration",
  "Budget optimization tools",
]

export function Pricing() {
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/20" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Pricing_Model
            </span>
            <div className="w-10 h-[1px] bg-primary/20" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the waitlist now for early access and exclusive launch discount.
          </p>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative p-8 md:p-12 rounded-3xl border-2 border-primary/20 bg-card/40 backdrop-blur-sm overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[var(--glow-opacity)] rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/[calc(var(--glow-opacity)/2)] rounded-full blur-3xl -z-10" />

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
              <Sparkles className="w-4 h-4 mr-2" />
              Waitlist Only
            </Badge>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl md:text-6xl font-bold">35 AED</span>
              <span className="text-2xl text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Includes 7-day free trial
            </p>
          </div>

          {/* Not Live Yet Notice */}
          <div className="mb-8 p-4 rounded-xl bg-card/60 border border-border text-center">
            <p className="text-sm font-mono uppercase tracking-widest text-primary mb-1">
              Not Live Yet
            </p>
            <p className="text-sm text-muted-foreground">
              Join the waitlist for early access + 20% launch discount
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground/90">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist')
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: 'smooth' })
                  console.log('[Analytics] click_waitlist_cta', { source: 'pricing' })
                }
              }}
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              Join Waitlist for Early Access
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
