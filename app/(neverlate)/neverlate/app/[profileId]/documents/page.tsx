'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  FileText,
  Clock,
  CheckCircle2,
  Shield,
  Car,
  Plane,
  Home,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { getProfile, getDocumentsByProfile } from '@/lib/neverlate/storage';
import { formatDaysUntilExpiry, calculateDocumentStatus, getCategoryLabel } from '@/lib/neverlate/utils';
import type { Profile, Document } from '@/lib/neverlate/types';
import { motion } from 'framer-motion';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'passport':
    case 'visa':
      return <Plane className="w-6 h-6" />;
    case 'driving_license':
    case 'car_registration':
    case 'car_insurance':
      return <Car className="w-6 h-6" />;
    case 'emirates_id':
      return <Shield className="w-6 h-6" />;
    case 'trade_license':
      return <Briefcase className="w-6 h-6" />;
    case 'home_insurance':
    case 'tenancy_contract':
      return <Home className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'upcoming': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'urgent': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    case 'overdue': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};

export default function DocumentList() {
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

  // Sort documents by urgency
  const sortedDocs = [...documents].sort((a, b) => {
    if (!a.expiry_date) return 1;
    if (!b.expiry_date) return -1;
    return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
  });

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0">
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <Link href={`/neverlate/app/${profileId}`} className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <Link href={`/neverlate/app/${profileId}/upload`}>
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl backdrop-blur-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Documents</h1>
          <p className="text-slate-400 text-lg">
            Manage all documents for {profile.name}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocs.length === 0 ? (
            <div className="col-span-full py-20 text-center glass-panel rounded-3xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No documents yet</h3>
              <p className="text-slate-400 mb-6">Upload your first document to start tracking.</p>
              <Link href={`/neverlate/app/${profileId}/upload`}>
                <Button className="neverlate-gradient rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
            </div>
          ) : (
            sortedDocs.map((doc, i) => {
              const status = calculateDocumentStatus(doc.expiry_date);
              const statusClasses = getStatusColor(status);
              
              return (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-panel p-6 rounded-[2rem] border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group h-full flex flex-col cursor-pointer">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClasses} flex items-center gap-1.5`}>
                        {status === 'safe' && <CheckCircle2 className="w-3 h-3" />}
                        {status === 'upcoming' && <Clock className="w-3 h-3" />}
                        {(status === 'urgent' || status === 'overdue') && <AlertCircle className="w-3 h-3" />}
                        <span className="capitalize">{status}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-300 transition-colors line-clamp-1">{doc.title}</h3>
                    <p className="text-sm text-slate-400 mb-6">{getCategoryLabel(doc.category)}</p>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</span>
                        <span className={`font-medium ${status === 'safe' ? 'text-green-400' : status === 'upcoming' ? 'text-yellow-400' : status === 'urgent' ? 'text-orange-400' : 'text-red-400'}`}>
                          {formatDaysUntilExpiry(doc.expiry_date)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


