'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Bell, 
  Settings,
  AlertCircle,
  Clock,
  CalendarDays
} from 'lucide-react';
import { motion } from 'framer-motion';

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Passport expires in 12 days",
    description: "John Doe's Passport needs immediate renewal to avoid travel restrictions.",
    profileName: "John Doe",
    time: "2 hours ago",
    status: "urgent",
    type: "document"
  },
  {
    id: 2,
    title: "Car Insurance renewal due",
    description: "Family SUV insurance expires in 14 days. Ensure you have the updated policy.",
    profileName: "Jane Doe",
    time: "Yesterday",
    status: "urgent",
    type: "document"
  },
  {
    id: 3,
    title: "Driving license expires in 60 days",
    description: "You have 60 days left on your driving license. Schedule an eye test soon.",
    profileName: "John Doe",
    time: "3 days ago",
    status: "upcoming",
    type: "document"
  },
  {
    id: 4,
    title: "New profile created",
    description: "You successfully set up the Business Profile for 'Acme Corp'.",
    profileName: "Business",
    time: "1 week ago",
    status: "safe",
    type: "system"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    case 'upcoming': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'safe': return <Bell className="w-5 h-5 text-teal-400" />;
    case 'upcoming': return <Clock className="w-5 h-5 text-yellow-400" />;
    case 'urgent': return <AlertCircle className="w-5 h-5 text-red-500" />;
    default: return <Bell className="w-5 h-5 text-slate-400" />;
  }
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0">
      <div className="absolute top-1/4 right-0 w-[500px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <Link href="/neverlate/app" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Link>
          <Link href="/neverlate/app/settings" className="text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 glow-accent-violet">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Notifications</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Your personal timeline of reminders and updates.
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative pl-6 md:pl-8 border-l-2 border-white/5 space-y-10 py-4">
          {NOTIFICATIONS.map((notif, index) => {
            const statusColor = getStatusColor(notif.status);
            
            return (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[35px] md:-left-[43px] w-6 h-6 rounded-full border-4 border-background flex items-center justify-center ${notif.status === 'urgent' ? 'bg-red-500' : notif.status === 'upcoming' ? 'bg-yellow-500' : 'bg-teal-500'}`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                <Card className="glass-panel p-6 rounded-[2rem] border-white/5 hover:border-white/10 transition-colors group cursor-default">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${statusColor}`}>
                      {getStatusIcon(notif.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{notif.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs font-semibold text-slate-300 border border-white/10">
                          {notif.profileName}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        {notif.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wide">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {notif.time}
                        </div>
                        
                        {(notif.status === 'urgent' || notif.status === 'upcoming') && (
                          <button className="text-sm font-semibold text-white hover:text-teal-400 transition-colors">
                            Take Action &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <div className="pt-6 relative">
             <div className="absolute -left-[31px] md:-left-[39px] w-4 h-4 rounded-full bg-white/5 border-2 border-background" />
             <p className="text-sm text-slate-500 font-medium">No more notifications</p>
          </div>
        </div>

      </div>
    </div>
  );
}
