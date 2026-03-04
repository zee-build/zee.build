"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Code, Zap } from "lucide-react"
import Link from "next/link"

const logEntries = [
  {
    date: "2024-03-01",
    phase: "Phase 01",
    title: "Project Initialization",
    description: "Set up Next.js 15 project structure, configured Supabase backend, and designed initial database schema for user profiles and meal data.",
    tags: ["Setup", "Architecture"],
  },
  {
    date: "2024-03-05",
    phase: "Phase 01",
    title: "AI Meal Discovery Engine",
    description: "Integrated OpenAI API for intelligent meal recommendations. Built Netflix-style card interface with swipe gestures and filtering system.",
    tags: ["AI", "Frontend"],
  },
  {
    date: "2024-03-10",
    phase: "Phase 01",
    title: "Pantry Mode Development",
    description: "Implemented pantry inventory system with ingredient matching algorithm. Users can now generate recipes based on available ingredients.",
    tags: ["Feature", "Algorithm"],
  },
  {
    date: "2024-03-15",
    phase: "Phase 01",
    title: "Weekly Planner & Grocery Lists",
    description: "Built automated weekly meal planning system with nutritional balance optimization. Added grocery list generation with UAE supermarket integration.",
    tags: ["Feature", "Integration"],
  },
]

export default function NutriNestLogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/builds/nutrinest"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to NutriNest
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[1px] bg-primary/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Development_Timeline
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            NutriNest Build Log
          </h1>
          <p className="text-xl text-muted-foreground">
            A transparent look at the development journey. Follow along as we build in public.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {/* Entries */}
            <div className="space-y-12">
              {logEntries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8 md:pl-24"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[-6px] md:left-[26px] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                  {/* Date Badge */}
                  <div className="hidden md:block absolute left-0 top-0">
                    <Badge variant="outline" className="border-white/10 bg-white/[0.02] font-mono text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {entry.date}
                    </Badge>
                  </div>

                  {/* Content Card */}
                  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-primary/20 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {entry.phase}
                      </Badge>
                      <span className="md:hidden text-xs font-mono text-muted-foreground">
                        {entry.date}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{entry.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {entry.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-white/10 bg-white/[0.02] text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pl-8 md:pl-24"
          >
            <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center">
              <Zap className="w-8 h-8 text-primary/40 mx-auto mb-4" />
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                More updates coming soon...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
