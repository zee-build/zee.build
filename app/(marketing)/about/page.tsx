"use client"

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, User, Target, Lightbulb, Code2, Globe, ArrowRight } from "lucide-react";
import { LabCard } from "@/components/ui/lab-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 pb-32 pt-24">
      {/* Narrative Hero */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl">
          <Badge variant="outline" className="mb-6 font-mono tracking-[0.3em] uppercase opacity-60">
            Identity_File
          </Badge>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.2]">
            I build <br />
            <GooeyText texts={["systems", "SaaS", "automation", "products"]} className="text-primary" textClassName="text-5xl md:text-8xl font-bold" /> <br />
            that stick.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground/80 leading-relaxed max-w-2xl italic">
            "I'm Ziyan Bin Anoos, a full-stack engineer dedicated to the intersection of code and product precision."
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Column */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 flex flex-col gap-8"
          >
            <motion.div variants={item}>
              <LabCard title="Mission Log" subtitle="Operating Principle" metadata={["SYNTHESIS"]}>
                <div className="flex gap-6 items-start">
                  <User size={32} className="text-primary opacity-40 shrink-0 mt-1" />
                  <p className="text-lg leading-relaxed text-muted-foreground/90">
                    I design and build complete systems—from concept to deployment. My focus is on creating 
                    automation tools, SaaS products, and experiments that solve real problems. Every project 
                    is built in public, sharing the journey from idea to production.
                  </p>
                </div>
              </LabCard>
            </motion.div>

            <motion.div variants={item}>
              <LabCard title="Core Engine" subtitle="Technical Infrastructure" metadata={["V.1.0"]}>
                <div className="flex gap-6 items-start">
                  <Code2 size={32} className="text-primary opacity-40 shrink-0 mt-1" />
                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground/90 mb-6">
                      Next.js, TypeScript, Tailwind CSS, and modern cloud orchestrators. I choose technologies that enable 
                      fast iteration and reliable deployment. The stack should serve the product, not the other way around.
                    </p>
                    <div className="flex flex-wrap gap-2 opacity-60">
                      {["NextJS", "TypeScript", "TailwindCSS", "NodeJs", "PostgreSQL", "OpenAI"].map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] font-mono tracking-widest uppercase">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </LabCard>
            </motion.div>

            <motion.div variants={item}>
              <LabCard title="Strategic Roadmap" subtitle="Current Trajectory" metadata={["ACTIVE"]}>
                <div className="flex gap-6 items-start">
                  <Target size={32} className="text-primary opacity-40 shrink-0 mt-1" />
                  <p className="text-lg leading-relaxed text-muted-foreground/90">
                    Currently validating NutriNest, an AI-powered toddler nutrition planner. 
                    It's designed to synthesize balanced developmental needs into streamlined meal discovery.
                  </p>
                </div>
              </LabCard>
            </motion.div>
          </motion.div>

          {/* Technical Metadata Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card/20 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-8">System_Metadata</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Base_Location</span>
                  <span className="text-xs font-mono text-primary flex items-center gap-2 underline decoration-primary/20">
                    <Globe size={12} /> DUBAI_DXB
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Compiler_Mode</span>
                  <span className="text-xs font-mono">STRICT_VALIDATION</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Uptime</span>
                  <span className="text-xs font-mono">11_YEARS_EXP</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Specialization</span>
                  <span className="text-xs font-mono">PRODUCT_ENG</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <MagneticButton>
                  <Link 
                    href="https://www.linkedin.com/in/ziyanbinanoos/"
                    target="_blank"
                    className="w-full flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
                  >
                    LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link 
                    href="/builds" 
                    className="w-full flex h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-bold bg-card/60 backdrop-blur-sm transition-transform hover:scale-105"
                  >
                    Protocol_Builds <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </MagneticButton>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em] leading-relaxed">
              {"// SYSLOG: fetching bio_segment..."}<br />
              {"// integrity: match..."}<br />
              {"// status: READY_TO_COLLABORATE"}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
