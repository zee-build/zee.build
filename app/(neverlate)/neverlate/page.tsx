'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Shield, 
  Bell, 
  Users, 
  FileText, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NeverLateLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-40 right-0 w-[600px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="neverlate-section pt-32 pb-24 relative z-10">
        <div className="neverlate-container text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[rgb(var(--brand-teal))] text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            Your personal life admin OS
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
          >
            Never<span className="neverlate-text-gradient">Late</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Track passports, visas, licenses, subscriptions, and family renewals 
            in one calm, simple place.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/neverlate/app">
              <Button size="lg" className="text-lg px-8 py-7 neverlate-gradient rounded-2xl hover:opacity-90 transition-opacity font-medium shadow-[0_0_40px_rgba(45,212,191,0.3)]">
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Abstract Dashboard Preview Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-24 max-w-4xl mx-auto glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="h-4 w-24 bg-white/10 rounded-md" />
                  </div>
                  <div className="text-3xl font-bold text-teal-400">92%</div>
                </div>
                <div className="h-20 rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-1/2 bg-white/10 rounded-md" />
                    <div className="h-2 w-1/3 bg-white/5 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="h-20 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 p-4 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Passport expires in 12 days</div>
                    <div className="text-xs text-red-400">Action required immediately</div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-300 hover:bg-red-500/10">Renew</Button>
                </div>
                <div className="h-20 rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Emirates ID valid</div>
                    <div className="text-xs text-slate-400">Expires in 10 months</div>
                  </div>
                </div>
                <div className="h-20 rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Car Insurance Renewal</div>
                    <div className="text-xs text-yellow-400">Upcoming in 45 days</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="neverlate-section relative z-10 pb-32">
        <div className="neverlate-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Simplicity is the premium feature.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              No spreadsheets. No clutter. Just calm, simple control over 
              the documents that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="neverlate-card p-8 bg-white/[0.02] border-white/[0.05] hover-glow group">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-accent-teal">
                <Users className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Multiple Profiles</h3>
              <p className="text-slate-400 leading-relaxed">
                Track documents for yourself, spouse, children, parents, and business entities all in one focused space.
              </p>
            </Card>

            <Card className="neverlate-card p-8 bg-white/[0.02] border-white/[0.05] hover-glow group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-accent-violet">
                <FileText className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Smart OCR Upload</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload documents and let AI extract key details automatically. Review and confirm in literal seconds.
              </p>
            </Card>

            <Card className="neverlate-card p-8 bg-white/[0.02] border-white/[0.05] hover-glow group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bell className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Intelligent Reminders</h3>
              <p className="text-slate-400 leading-relaxed">
                Get calm, timely notifications before expiry. Never be caught off guard by a renewal again.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="neverlate-section relative z-10 pb-32">
        <div className="neverlate-container">
          <Card className="neverlate-card p-16 text-center neverlate-gradient-subtle border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white relative z-10">
              Ready to feel in control?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands who've completely eliminated life admin anxiety with NeverLate.
            </p>
            <Link href="/neverlate/app" className="relative z-10">
              <Button size="lg" className="text-lg px-10 py-8 bg-white text-black hover:bg-slate-200 rounded-2xl font-semibold transition-colors">
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
