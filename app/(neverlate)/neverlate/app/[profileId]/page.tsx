'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText,
  Shield,
  ChevronRight
} from 'lucide-react';
import { getProfile, getDocumentsByProfile } from '@/lib/neverlate/storage';
import { calculateLifeHealthScore, getRelationTypeLabel, formatDaysUntilExpiry, calculateDocumentStatus } from '@/lib/neverlate/utils';
import type { Profile, Document } from '@/lib/neverlate/types';
import { motion } from 'framer-motion';

// Reusable Ring SVG Component
const ScoreRing = ({ score, size = 120, strokeWidth = 8 }: { score: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = 'text-green-400';
  if (score < 50) color = 'text-red-400';
  else if (score < 80) color = 'text-yellow-400';

  return (
    <div className="relative inline-flex items-center justify-center glow-accent-teal" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full drop-shadow-lg">
        <circle
          className="text-white/5"
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
      <div className="absolute text-center">
        <span className="text-3xl font-bold block">{score}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1">Health</span>
      </div>
    </div>
  );
};

export default function ProfileDashboard() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getProfile(profileId);
    if (!p) {
      router.push('/neverlate/app');
      return;
    }
    setProfile(p);
    setDocuments(getDocumentsByProfile(profileId));
    setLoading(false);
  }, [profileId, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const healthScore = calculateLifeHealthScore(documents);
  const urgentDocs = documents.filter(d => ['urgent', 'overdue'].includes(calculateDocumentStatus(d.expiry_date)));
  const upcomingDocs = documents.filter(d => calculateDocumentStatus(d.expiry_date) === 'upcoming');
  const safeDocs = documents.filter(d => calculateDocumentStatus(d.expiry_date) === 'safe');
  const recentDocs = [...documents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0">
      {/* Abstract Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-5xl">
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/neverlate/app" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Link>
        </motion.div>

        {/* Top Header Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-[2.5rem] mb-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          {/* subtle background glow inside card */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-teal-500/20 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl profile-${profile.relation_type}`}
                 style={{ background: `linear-gradient(135deg, rgba(var(--profile-color), 0.2), rgba(var(--profile-color), 0.05))`, color: `rgb(var(--profile-color))` }}>
              {profile.avatar_icon || profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">{profile.name}</h1>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300">
                {getRelationTypeLabel(profile.relation_type)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="flex flex-col gap-3">
              <Link href={`/neverlate/app/${profileId}/upload`}>
                <Button className="w-full neverlate-gradient rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] font-semibold border-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
              <Button variant="outline" className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Details
              </Button>
            </div>
            <ScoreRing score={healthScore.score} />
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Urgent Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-2">
            <Card className="glass-panel p-6 rounded-[2rem] border-white/5 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Action Required</h3>
                </div>
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold">
                  {urgentDocs.length} Urgent
                </div>
              </div>

              {urgentDocs.length > 0 ? (
                <div className="space-y-3">
                  {urgentDocs.map(doc => (
                    <div key={doc.id} className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-500/5 to-transparent border border-red-500/10 hover:border-red-500/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                          {doc.category === 'passport' ? <FileText className="w-5 h-5 text-red-400" /> : <Shield className="w-5 h-5 text-red-400" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white mb-1 group-hover:text-red-300 transition-colors">{doc.title}</div>
                          <div className="text-sm text-red-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDaysUntilExpiry(doc.expiry_date)}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 border-none rounded-lg transition-all shadow-none">
                        Renew
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500/50 mb-3" />
                  <p className="text-slate-400 font-medium">All caught up! No urgent actions.</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Upcoming Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-panel p-6 rounded-[2rem] border-white/5 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Upcoming</h3>
              </div>
              
              <div className="space-y-4">
                {upcomingDocs.length > 0 ? (
                  upcomingDocs.slice(0, 4).map(doc => (
                    <div key={doc.id} className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-200">{doc.title}</div>
                        <div className="text-xs text-yellow-400/80">{formatDaysUntilExpiry(doc.expiry_date)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">No upcoming renewals in the next 60 days.</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Safe Documents Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1 md:col-span-2">
            <Card className="glass-panel p-6 rounded-[2rem] border-white/5 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Safe & Valid</h3>
                </div>
                <Link href={`/neverlate/app/${profileId}/documents`} className="text-sm text-teal-400 hover:text-teal-300 font-medium">
                  View All ({safeDocs.length})
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {safeDocs.slice(0, 4).map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{doc.title}</div>
                      <div className="text-xs text-green-400/80">Valid: {formatDaysUntilExpiry(doc.expiry_date)}</div>
                    </div>
                  </div>
                ))}
                {safeDocs.length === 0 && (
                  <div className="col-span-2 text-sm text-slate-500 py-4">No safe documents tracked.</div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Uploads Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-panel p-6 rounded-[2rem] border-white/5 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Recent</h3>
              </div>
              
              <div className="space-y-4">
                {recentDocs.length > 0 ? (
                  recentDocs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <FileText className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-slate-200 truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-500">Added recently</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">No recent uploads.</p>
                )}
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


