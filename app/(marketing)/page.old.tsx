import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Activity, Terminal, Zap } from "lucide-react";
import { HalideLanding } from "@/components/ui/halide-topo-hero";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LabCard } from "@/components/ui/lab-card";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* Hero Section */}
      <HalideLanding />

      {/* Experimental Grid Segment */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Kinetic Intro */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] p-10 backdrop-blur-md">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Terminal size={120} />
            </div>
            <Badge variant="outline" className="mb-6 font-mono tracking-[0.3em] uppercase opacity-60">
              Lab_Manifesto
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.3]">
              I build <GooeyText texts={["systems", "SaaS", "automation", "products"]} className="text-primary" textClassName="text-4xl md:text-6xl font-bold" /> <br />
              that solve for the <span className="italic font-serif">next</span>.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl leading-relaxed mb-10">
              Engineering high-performance SaaS, automation, and architectural experiments. 
              Built in public for the modern web—where code meets precision design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/builds" 
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                Enter the Lab <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/ziyanbinanoos/"
                target="_blank"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 px-8 text-sm font-bold bg-white/5 backdrop-blur-sm transition-transform hover:scale-105"
              >
                LinkedIn
              </Link>
            </div>
          </div>

          {/* Side Stats/HUD Card */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <LabCard 
              title="Active Status" 
              subtitle="Current Operation"
              metadata={["SYS_OK", "V.1.0.4"]}
              className="flex-grow"
            >
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-mono uppercase tracking-widest">Network Ops</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">LATENCY: 12ms</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-mono uppercase tracking-widest">Build Stream</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">UPLOADING...</span>
                </div>
              </div>
            </LabCard>
          </div>
        </div>
      </section>

      {/* Featured Construction */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <Zap className="text-primary" /> Featured Construction
            </h2>
            <p className="text-muted-foreground">
              Directing focus to the current lead experiment—NutriNest. Validating a new paradigm for toddler nutrition.
            </p>
          </div>
          <Link href="/builds" className="text-sm font-mono uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
            Archive Access <ArrowRight size={14} />
          </Link>
        </div>

        <GlowingEffect>
          <LabCard 
            title="NutriNest"
            subtitle="AI-Powered Nutrition Architecture"
            metadata={["PHASE_01", "VALIDATING"]}
            href="/builds/nutrinest"
            className="p-10"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  Netflix-style meal discovery for toddlers aged 6-36 months. 
                  Features pantry mode, budget-optimized planning, and allergy-safe AI orchestration.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-white/5 border-white/5">NEXT.JS 15</Badge>
                  <Badge variant="secondary" className="bg-white/5 border-white/5">SUPABASE</Badge>
                  <Badge variant="secondary" className="bg-white/5 border-white/5">OPENAI</Badge>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] group">
                <Image
                  src="/builds/nutrinest/collage.png"
                  alt="NutriNest App Screens"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
              </div>
            </div>
          </LabCard>
        </GlowingEffect>
      </section>

      {/* Ecosystem Philosophy */}
      <section className="container mx-auto px-4 py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <Activity className="mx-auto mb-8 text-primary opacity-50" size={40} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">Philosophy of the Lab</h2>
          <p className="text-xl text-muted-foreground/80 leading-relaxed italic">
            "I believe in building systems that solve real problems. Not just code, but complete solutions 
            that ship and serve users. Every project here is an experiment in turning ideas into reality, 
            learning in public, and creating value through thoughtful automation and design."
          </p>
        </div>
      </section>
    </div>
  );
}
