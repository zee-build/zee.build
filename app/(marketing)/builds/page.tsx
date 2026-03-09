"use client"

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Box, Shield, Zap, FlaskConical, Command, Database, Cpu, Globe, Activity, Terminal as TerminalIcon, Braces, Layers, Binary, Radio, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { ModernAnimatedHero } from "@/components/ui/modern-animated-hero-section";
import { LabCard } from "@/components/ui/lab-card";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BuildsPage() {
  return (
    <div className="flex flex-col gap-12 pb-40">
      {/* Animated Hero */}
      <ModernAnimatedHero 
        title="BUILDS"
        subtitle="The index of all laboratory experiments, architectural prototypes, and production-ready systems."
      />

      {/* Global Data Stream Ticker */}
      <div className="w-full bg-card/20 border-y border-border py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-12 items-center">
          {[1, 2, 3, 4].map((_, idx) => (
             <div key={idx} className="flex gap-12 items-center text-[10px] font-mono tracking-widest text-muted-foreground/40 uppercase">
                <span className="flex items-center gap-2 text-lab-cyan/60"><Radio size={10} /> STREAM_SYNC: ACTIVE</span>
                <span className="flex items-center gap-2 font-bold"><Activity size={10} /> SYSTEM_STATUS: OPERATIONAL</span>
                <span className="flex items-center gap-2"><Layers size={10} /> CACHE_HIT: 0.94ms</span>
                <span className="flex items-center gap-2 text-lab-amber/60"><TerminalIcon size={10} /> ENGINE_UPTIME: 99.99%</span>
                <span className="flex items-center gap-2"><Cpu size={10} /> CORE_TEMP: 32°C</span>
                <span className="flex items-center gap-2 text-lab-magenta/60"><Binary size={10} /> PROTOCOL_INIT: SUCCESS</span>
             </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Technical HUD Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-20 relative">
          {[
            { label: "Active_Nodes", value: "06", icon: Database, color: "text-lab-cyan" },
            { label: "Compiler_Status", value: "STRICT", icon: Cpu, color: "text-lab-magenta" },
            { label: "Lab_Version", value: "BETA.08", icon: Command, color: "text-white" },
            { label: "Global_Link", value: "ONLINE", icon: Globe, color: "text-lab-amber" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-6 rounded-2xl bg-card/40 border border-border backdrop-blur-sm group hover:border-primary/20 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={`${stat.color} opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all`} size={20} />
                <span className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] group-hover:opacity-80 transition-opacity">{stat.label}</span>
              </div>
              <span className={`text-2xl font-bold tracking-tight ${i === 2 ? 'text-primary' : ''}`}>{stat.value}</span>
              <div className="w-full h-px bg-border mt-4 group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>

        {/* Section Header Controls */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap- gap-8">
          <div className="max-w-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">Build_Registry Protocol</span>
             </div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4 flex items-center gap-3">
               Build Catalog_
            </h2>
            <p className="text-muted-foreground/80 leading-relaxed max-w-sm">
              Current inventory of production-ready systems and architectural prototypes.
            </p>
          </div>
          <div className="flex gap-2 p-1.5 bg-card/40 rounded-2xl border border-border backdrop-blur-sm">
            <button className="px-6 py-2 rounded-xl text-[10px] font-mono uppercase bg-foreground text-background font-bold tracking-[0.2em] shadow-xl">List_Index</button>
            <button className="px-6 py-2 rounded-xl text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all tracking-[0.2em]">Active_Only</button>
          </div>
        </div>

        {/* Animated Card Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* NutriNest - Active */}
          <motion.div variants={item}>
            <LabCard 
              title="NutriNest"
              subtitle="AI Developmental Nutrition"
              metadata={["PHASE_01", "ACTIVE"]}
              href="/builds/nutrinest"
              className="p-10 lg:p-12 h-full group/card"
            >
              {/* App Preview Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card/40 mb-8 group-hover/card:border-primary/20 transition-colors">
                <Image
                  src="/builds/nutrinest/collage.png"
                  alt="NutriNest App Screens"
                  fill
                  className="object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              <div className="flex justify-between items-start mb-8">
                <Box className="text-lab-cyan opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-primary/40 transition-colors">
                   <Braces className="text-primary/40 group-hover/card:text-primary transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                Netflix-style meal discovery engine for toddlers (6-36 months). Synthesized pantry 
                intelligence and hard-coded safety benchmarks.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {["NextJS 15", "OpenAI", "Supabase", "Motion"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3 text-muted-foreground group-hover/card:text-foreground transition-colors">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>

          {/* SentinelRisk - Prototype */}
          <motion.div variants={item}>
            <LabCard 
              title="SentinelRisk"
              subtitle="Corporate Risk Intelligence"
              metadata={["PHASE_01", "PROTOTYPE"]}
              href="/builds/sentinelrisk"
              className="p-10 lg:p-12 h-full group/card"
            >
              {/* App Preview Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card/40 mb-8 group-hover/card:border-primary/20 transition-colors">
                <Image
                  src="/builds/sentinelrisk/collage.png"
                  alt="SentinelRisk App Screens"
                  fill
                  className="object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              <div className="flex justify-between items-start mb-8">
                 <BarChart3 className="text-lab-magenta opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                 <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-lab-magenta/40 transition-colors">
                   <TrendingUp className="text-lab-magenta/40 group-hover/card:text-lab-magenta transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                AI-assisted corporate risk intelligence platform that analyzes portfolio exposure, 
                compliance risk, and financial vulnerabilities.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                 {["Fintech", "Risk", "Analytics", "AI"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3 text-muted-foreground group-hover/card:text-foreground transition-colors">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>

          {/* Automation Tools - Concept */}
          <motion.div variants={item}>
            <LabCard 
              title="Automation Tools"
              subtitle="Engineering Logic"
              metadata={["CONCEPT", "DRAFT"]}
              className="p-10 lg:p-12 h-full opacity-60 grayscale hover:grayscale-0 group/card transition-all duration-700"
            >
              <div className="flex justify-between items-start mb-8">
                <Zap className="text-lab-amber opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-lab-amber/40 transition-colors">
                   <Cpu className="text-lab-amber/40 group-hover/card:text-lab-amber transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                Collection of internal orchestration tools to automate repetitive engineering workflows. 
                Optimized for maximum developer velocity.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                 {["CLI", "DevOps", "Docker", "Go"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>

          {/* MotoScout - Active */}
          <motion.div variants={item}>
            <LabCard 
              title="MotoScout"
              subtitle="Find bikes fast. Alerts + Deal feed."
              metadata={["PHASE_01", "ACTIVE"]}
              href="/motoscout"
              className="p-10 lg:p-12 h-full group/card"
            >
              <div className="flex justify-between items-start mb-8">
                <Zap className="text-lab-amber opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-lab-amber/40 transition-colors">
                   <TrendingUp className="text-lab-amber/40 group-hover/card:text-lab-amber transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                Motorcycle listing aggregator with Telegram alerts. Monitors Dubizzle and Facebook Marketplace 
                for new bikes matching saved searches.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                 {["NextJS", "Supabase", "Telegram", "Scraping"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3 text-muted-foreground group-hover/card:text-foreground transition-colors">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>

          {/* NeverLate - Active */}
          <motion.div variants={item}>
            <LabCard 
              title="NeverLate"
              subtitle="Life Admin OS"
              metadata={["PHASE_01", "ACTIVE"]}
              href="/neverlate"
              className="p-10 lg:p-12 h-full group/card"
            >
              <div className="flex justify-between items-start mb-8">
                <Calendar className="text-lab-cyan opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-lab-cyan/40 transition-colors">
                   <Shield className="text-lab-cyan/40 group-hover/card:text-lab-cyan transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                Premium life admin OS for tracking passports, visas, licenses, and family renewals. 
                Calm, simple control with OCR upload and smart reminders.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                 {["NextJS", "TypeScript", "OCR", "Premium"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3 text-muted-foreground group-hover/card:text-foreground transition-colors">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>

          {/* Experiments - Concept */}
          <motion.div variants={item}>
            <LabCard 
              title="Experiments"
              subtitle="R&D Sandbox"
              metadata={["ONGOING", "RESEARCH"]}
              className="p-10 lg:p-12 h-full opacity-60 grayscale hover:grayscale-0 group/card transition-all duration-700"
            >
              <div className="flex justify-between items-start mb-8">
                <FlaskConical className="text-primary opacity-40 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" size={48} />
                <div className="p-2 rounded-lg bg-card/60 border border-border group-hover/card:border-primary/40 transition-colors">
                   <Globe className="text-primary/40 group-hover/card:text-primary transition-colors" size={16} />
                </div>
              </div>
              <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
                Rapid prototypes exploring GPU-rendering patterns, Three.js orchestration, 
                and novel human-computer interaction models.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                 {["ThreeJS", "WebGL", "Rust", "WASM"].map(tag => (
                   <Badge key={tag} variant="outline" className="border-border bg-card/60 uppercase text-[10px] tracking-widest font-mono py-1 px-3">
                      {tag}
                   </Badge>
                ))}
              </div>
            </LabCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Real-time System Log Element */}
      <section className="container mx-auto px-4 mt-40">
        <div className="max-w-6xl mx-auto p-8 rounded-[2rem] bg-card border border-border font-mono text-[10px] text-muted-foreground/60 shadow-inner">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-primary uppercase tracking-[0.4em] font-bold">Lab_System_Log</span>
             </div>
             <span className="opacity-40 tabular-nums">SYSTEM_TIME: ACTIVE</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
             <div className="space-y-1 opacity-80">
                <p className="">{" >> FETCHING BUILD_REGISTRY... COMPLETE"}</p>
                <p className="pl-4">{"- cluster: UAE_DXB_NORTH"}</p>
                <p className="pl-4">{"- load_balancer: STABLE"}</p>
                <p className="">{" >> TOTAL_ENTRIES: 04"}</p>
                <p className="">{" >> INTEGRITY_CHECK: 0x24F1A... OK"}</p>
             </div>
             <div className="space-y-1 opacity-40">
                <p className="">{" >> ANALYZING RECENT_TRAFFIC..."}</p>
                <p className="">{" >> CACHE_STATUS: HIT (124ms)"}</p>
                <p className="">{" >> NODE_REPLICATION: 100%"}</p>
                <p className="animate-pulse">{"> _"}</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
