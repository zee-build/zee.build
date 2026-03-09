'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Users, AlertCircle, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { getProfiles, getDocumentsByProfile } from '@/lib/neverlate/storage';
import { calculateLifeHealthScore, getRelationTypeLabel, getRelativeTime } from '@/lib/neverlate/utils';
import type { Profile, Document } from '@/lib/neverlate/types';
import { motion } from 'framer-motion';

export default function NeverLateApp() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfiles(getProfiles());
    setLoading(false);
  }, []);

  const getProfileStats = (profileId: string) => {
    const documents = getDocumentsByProfile(profileId);
    const healthScore = calculateLifeHealthScore(documents);
    
    // Find next expiry
    const docWithDates = documents.filter(d => d.expiry_date);
    let nextExpiryDoc: Document | null = null;
    
    if (docWithDates.length > 0) {
      nextExpiryDoc = docWithDates.sort((a, b) => 
        new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime()
      )[0];
    }
    
    return {
      total: documents.length,
      urgent: healthScore.urgent_count,
      upcoming: healthScore.upcoming_count,
      overdue: healthScore.overdue_count,
      score: healthScore.score,
      nextExpiry: nextExpiryDoc
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Ring SVG Component for Life Health Score
  const ScoreRing = ({ score, size = 64, strokeWidth = 6 }: { score: number, size?: number, strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    // Color logic
    let color = 'text-green-500';
    if (score < 50) color = 'text-red-500';
    else if (score < 80) color = 'text-yellow-500';

    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            className="text-white/10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <span className="absolute text-sm font-bold">{score}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/neverlate" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 inline-flex items-center">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Profiles</h1>
            <p className="text-slate-400 mt-2 text-lg">
              Manage documents for yourself and your family
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/neverlate/app/profiles/new">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md">
                <Plus className="w-5 h-5 mr-2" />
                Add Profile
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Empty State */}
        {profiles.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-panel p-16 text-center border-white/5 rounded-[2rem]">
              <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-8 glow-accent-teal">
                <Users className="w-12 h-12 text-teal-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">No profiles yet</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                Create your first profile to start tracking important documents and renewals.
              </p>
              <Link href="/neverlate/app/profiles/new">
                <Button size="lg" className="neverlate-gradient rounded-full px-8 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Profile
                </Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          /* Profile Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, i) => {
              const stats = getProfileStats(profile.id);
              const urgentItems = stats.urgent + stats.overdue;
              const hasUrgent = urgentItems > 0;
              
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/neverlate/app/${profile.id}`}>
                    <Card className="glass-panel p-6 rounded-[2rem] border-white/5 hover:border-white/10 transition-all duration-300 group cursor-pointer h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                      
                      {/* Top row: Avatar & Score */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg profile-${profile.relation_type}`}
                               style={{ background: `rgba(var(--profile-color), 0.15)`, color: `rgb(var(--profile-color))` }}>
                            {profile.avatar_icon || profile.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="mt-1">
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-teal-300 transition-colors">{profile.name}</h3>
                            <p className="text-sm font-medium text-slate-400 capitalize">
                              {getRelationTypeLabel(profile.relation_type)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <ScoreRing score={stats.score} size={56} strokeWidth={4} />
                        </div>
                      </div>

                      <div className="flex-1" />

                      {/* Middle row: Urgent Alerts / Next Expiry */}
                      <div className="space-y-3 mb-6">
                        {hasUrgent ? (
                          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <span className="text-sm font-medium text-red-400">{urgentItems} urgent action{urgentItems > 1 ? 's' : ''} needed</span>
                          </div>
                        ) : stats.nextExpiry ? (
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-300 truncate font-medium">Next: {stats.nextExpiry.title}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5 opacity-50">
                            <CheckCircle className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-400">No documents tracked</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-4 text-sm font-medium">
                          <div className="flex flex-col">
                            <span className="text-slate-500">Docs</span>
                            <span className="text-white">{stats.total}</span>
                          </div>
                          {stats.overdue > 0 && (
                            <div className="flex flex-col">
                              <span className="text-red-500/70">Overdue</span>
                              <span className="text-red-400">{stats.overdue}</span>
                            </div>
                          )}
                          {stats.upcoming > 0 && (
                            <div className="flex flex-col">
                              <span className="text-yellow-500/70">Upcoming</span>
                              <span className="text-yellow-400">{stats.upcoming}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:text-teal-400 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

