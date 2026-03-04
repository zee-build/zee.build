"use client"

import { motion } from "framer-motion"
import { UserCircle, Sparkles, Calendar } from "lucide-react"

const steps = [
  {
    icon: UserCircle,
    title: "Create Child Profile",
    description: "Enter your child's age, allergies, and dietary preferences. Our AI adapts recommendations to their developmental stage.",
  },
  {
    icon: Sparkles,
    title: "Discover Meals / Use Pantry Mode",
    description: "Browse Netflix-style meal cards or activate pantry mode to cook with ingredients you already have at home.",
  },
  {
    icon: Calendar,
    title: "Generate Weekly Plan + Grocery List",
    description: "Let NutriNest build a balanced weekly meal plan and auto-generate a shopping list optimized for UAE supermarkets.",
  },
]

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              System_Flow
            </span>
            <div className="w-10 h-[1px] bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to stress-free toddler nutrition planning.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group"
            >
              {/* Connector Line (hidden on mobile, shown on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
              )}

              <div className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-primary/20 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 p-4 rounded-xl bg-primary/10 inline-flex group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
