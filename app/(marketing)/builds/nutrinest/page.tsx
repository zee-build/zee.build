import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Zap, Target, ShieldCheck } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { LabCard } from "@/components/ui/lab-card";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function NutriNestPage() {
  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0 opacity-40">
           <ShaderAnimation className="w-full h-full" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 font-mono tracking-[0.3em] uppercase opacity-60">Status: Validating</Badge>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            NutriNest
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Architecting the future of toddler nutrition through AI-driven meal orchestration and budget precision.
          </p>
          <div className="flex justify-center">
            <MagneticButton>
              <Link 
                href="/nutrinest" 
                className="inline-flex h-16 items-center justify-center rounded-full bg-primary px-10 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                Join Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </MagneticButton>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Narrative Segment */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="sticky top-32">
            <h2 className="text-4xl font-bold tracking-tight mb-8">The Core Problem</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Parents of toddlers face constant cognitive load regarding meal planning. 
                Existing solutions are either too generic or too complex.
              </p>
              <p className="border-l-2 border-primary/20 pl-6 italic">
                "Is my child getting enough nutrients? What can I make with what's actually in my pantry right now?"
              </p>
              <p>
                NutriNest removes the guesswork. It serves as a pediatric nutrition engine 
                in your pocket, synthesizing balanced development with real-world inventory.
              </p>
            </div>
          </div>
          
          <div className="grid gap-6">
            <LabCard title="Precision" subtitle="Data Logic" metadata={["SYNTHESIS_V1"]}>
              <div className="flex gap-4 items-start pt-2">
                <Target className="text-lab-cyan shrink-0" size={24} />
                <p className="text-muted-foreground/90">
                  AI orchestration ensures every meal hits precise developmental benchmarks for 6–36 month olds.
                </p>
              </div>
            </LabCard>
            <LabCard title="Optimization" subtitle="Inventory Logic" metadata={["PANTRY_ACTIVE"]}>
              <div className="flex gap-4 items-start pt-2">
                <Zap className="text-lab-amber shrink-0" size={24} />
                <p className="text-muted-foreground/90">
                  Real-time meal generation based on current domestic stock, reducing waste and grocery overhead.
                </p>
              </div>
            </LabCard>
            <LabCard title="Safety" subtitle="Constraint Logic" metadata={["ENFORCED"]}>
              <div className="flex gap-4 items-start pt-2">
                <ShieldCheck className="text-lab-magenta shrink-0" size={24} />
                <p className="text-muted-foreground/90">
                  Hard-coded safety protocols for allergies and dietary restrictions baked into every suggestion.
                </p>
              </div>
            </LabCard>
          </div>
        </div>
      </section>

      {/* Feature Architecture */}
      <section className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-10">
           <div className="w-12 h-[1px] bg-primary/20" />
           <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-primary font-bold">System Architecture</span>
           <div className="w-12 h-[1px] bg-primary/20" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            { title: "Netflix-Style Discovery", desc: "Swipe through meal ideas tailored to your toddler's age and preferences.", icon: Zap, color: "text-lab-cyan" },
            { title: "Pantry Mode", desc: "Instant meal suggestions based on what you have at home—zero waste.", icon: Target, color: "text-lab-amber" },
            { title: "Budget-Friendly", desc: "Affordable options that never compromise on developmental nutrition.", icon: ShieldCheck, color: "text-lab-magenta" },
            { title: "Weekly Planning", desc: "Auto-generated schedules and shopping lists compiled in seconds.", icon: Check, color: "text-white" },
            { title: "Allergy-Aware", desc: "Hard-coded restriction filters for every single meal suggestion.", icon: Check, color: "text-white" },
            { title: "Nutrition Score", desc: "At-a-glance developmental ratings for every meal in the index.", icon: Check, color: "text-white" },
          ].map((feature, i) => (
            <LabCard 
              key={i} 
              title={feature.title} 
              metadata={[`ARCH_NODE_0${i+1}`]}
              className="group/node hover:border-primary/20 transition-all"
            >
              <div className="flex flex-col gap-4">
                <feature.icon className={`${feature.color} opacity-40 group-hover/node:opacity-100 transition-all`} size={24} />
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </LabCard>
          ))}
        </div>
      </section>

      {/* Validation CTA */}
      <section className="container mx-auto px-4 py-32 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to Build the Future?</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          NutriNest is in active validation. Help shape the architecture of toddler nutrition by joining the alpha waitlist.
        </p>
        <div className="flex justify-center">
          <MagneticButton>
            <Link 
              href="/nutrinest" 
              className="inline-flex h-16 items-center justify-center rounded-full bg-white text-black px-10 text-sm font-bold transition-transform hover:scale-105"
            >
              Initialize Early Access
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
