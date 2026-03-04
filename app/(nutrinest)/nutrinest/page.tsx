"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, ArrowRight, Activity, Terminal as TerminalIcon, ShieldCheck, Zap, Target } from "lucide-react";
import { LabCard } from "@/components/ui/lab-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { motion, AnimatePresence, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function NutriNestLandingPage() {
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [country, setCountry] = useState("UAE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <LabCard title="Access_Granted" subtitle="Waitlist Status" metadata={["ENROLLED"]}>
            <div className="text-center py-12">
              <div className="mx-auto mb-8 h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 animate-pulse">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">You're in the Loop.</h2>
              <p className="text-muted-foreground/80 leading-relaxed mb-8">
                Your credentials have been synthesized. We will notify you as soon as the next allocation opens.
              </p>
              <div className="p-4 rounded-xl border border-white/5 bg-black font-mono text-[10px] text-primary/60 text-left">
                {">"} // LOG_EVENT: SUBSCRIPTION_OK<br />
                {">"} // TIMESTAMP: {new Date().toISOString()}<br />
                {">"} // STATUS: AWAITING_ALLOCATION
              </div>
              <div className="mt-8">
                <MagneticButton>
                  <a href="/" className="text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Return_Home</a>
                </MagneticButton>
              </div>
            </div>
          </LabCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-40">
      {/* Hero Header */}
      <section className="container mx-auto px-4 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-8 font-mono tracking-[0.4em] uppercase opacity-60 border-primary/20 text-primary">Alpha_Waitlist</Badge>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.3]">
            Nutrition, <br />
            <GooeyText texts={["reimagined.", "optimized.", "automated."]} className="text-primary" textClassName="text-6xl md:text-8xl font-bold" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            An intelligent engine for toddler developmental success. <br className="hidden md:block" />
            Join the waitlist for exclusive infrastructure access.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-6xl mx-auto">
          
          {/* Functional Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <LabCard title="Input_Parameters" subtitle="Enrollment Module" metadata={["V.24.1"]}>
              <form onSubmit={handleSubmit} className="space-y-8 py-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">01 // Identifier</Label>
                    <span className="text-[10px] font-mono text-primary animate-pulse">REQUIRED</span>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-MAIL_ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 bg-white/[0.02] border-white/5 rounded-xl font-mono text-sm tracking-wide focus:ring-primary/20"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="ageRange" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">02 // Segment</Label>
                    <select
                      id="ageRange"
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      required
                      className="flex h-14 w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="" className="bg-black">SELECT_AGE</option>
                      <option value="6-12" className="bg-black">6-12_MONTHS</option>
                      <option value="12-18" className="bg-black">12-18_MONTHS</option>
                      <option value="18-24" className="bg-black">18-24_MONTHS</option>
                      <option value="24-36" className="bg-black">24-36_MONTHS</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="country" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">03 // Zone</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="REGION_CODE"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-14 bg-white/[0.02] border-white/5 rounded-xl font-mono text-sm tracking-wide focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <MagneticButton>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-16 rounded-xl bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing_Request...
                        </>
                      ) : (
                        <>
                          Join_Allocation <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </div>
                
                <p className="text-[9px] font-mono text-center text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
                  {"// By proceeding, you engage with the NutriNest development protocol."}<br />
                  {"// Private beta tokens will be distributed based on cluster availability."}
                </p>
              </form>
            </LabCard>
          </motion.div>

          {/* System Overview */}
          <div className="flex flex-col gap-8">
             <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
                <motion.div variants={item}>
                  <LabCard title="Infrastructure" subtitle="System Core" metadata={["STABLE"]}>
                    <div className="flex gap-6 items-start">
                      <Zap className="text-primary/40 shrink-0" size={24} />
                      <p className="text-sm text-muted-foreground/80 leading-relaxed font-mono tracking-tight uppercase">
                        AI-Synthesized meal planning logic eliminates the cognitive load of domestic nutrition orchestration.
                      </p>
                    </div>
                  </LabCard>
                </motion.div>

                <motion.div variants={item}>
                  <LabCard title="Optimization" subtitle="Inventory Scan" metadata={["SYNTHESIS"]}>
                    <div className="flex gap-6 items-start">
                      <Activity className="text-primary/40 shrink-0" size={24} />
                      <p className="text-sm text-muted-foreground/80 leading-relaxed font-mono tracking-tight uppercase">
                        Real-time pantry synchronization ensures zero resource waste and budget-friendly household scale.
                      </p>
                    </div>
                  </LabCard>
                </motion.div>

                <motion.div variants={item}>
                  <LabCard title="Protocols" subtitle="Integrity Guard" metadata={["HARD-CODED"]}>
                    <div className="flex gap-6 items-start">
                      <ShieldCheck className="text-primary/40 shrink-0" size={24} />
                      <p className="text-sm text-muted-foreground/80 leading-relaxed font-mono tracking-tight uppercase">
                        Enterprise-grade allergy filtering and developmental safety benchmarks built into every planning loop.
                      </p>
                    </div>
                  </LabCard>
                </motion.div>
             </motion.div>

             {/* Terminal View */}
             <div className="mt-8 p-6 rounded-2xl bg-black border border-white/5 font-mono text-[10px] text-muted-foreground/40">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-500/60 uppercase tracking-widest">System_Operational</span>
                </div>
                <div className="space-y-1">
                  <div>{"[01:14:02] INITIALIZING_CORE_SYNTHESIS..."}</div>
                  <div>{"[01:14:04] ALLOCATING_RESOURCE_BLOCKS..."}</div>
                  <div>{"[01:14:05] AWAITING_USER_INPUT_IDENTIFIER..."}</div>
                  <div className="animate-pulse">{"> _"}</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="mt-40 text-center container mx-auto px-4">
        <div className="max-w-xl mx-auto border-t border-white/5 pt-12">
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.3em]">
            A product of the <a href="/" className="text-primary/60 hover:text-primary transition-colors underline-offset-4 underline">ZEE.BUILD_LAB</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
