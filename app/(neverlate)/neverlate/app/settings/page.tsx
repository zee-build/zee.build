'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  BellRing, 
  Users, 
  UserCircle,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [reminders, setReminders] = useState({
    push: true,
    email: true,
    weekly: false,
    urgentOnly: false
  });

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0">
      <div className="absolute top-1/2 left-0 w-[400px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/neverlate/app" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Settings</h1>
          <p className="text-slate-400 text-lg">
            Manage your account, preferences, and system settings.
          </p>
        </motion.div>

        <div className="space-y-6">

          {/* Account Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Account</h2>
            <Card className="glass-panel rounded-3xl border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Personal Information</div>
                    <div className="text-sm text-slate-500">Update your email, password & details</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Subscription & Billing</div>
                    <div className="text-sm text-slate-500">NeverLate Pro - Active</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Security & Privacy</div>
                    <div className="text-sm text-slate-500">2FA, Data export, and app lock</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-8">Preferences</h2>
            <Card className="glass-panel p-6 rounded-3xl border-white/5 space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div>
                    <div className="font-medium text-white">Dark Mode</div>
                    <div className="text-sm text-slate-500">A calm, premium midnight theme</div>
                  </div>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} 
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Push Notifications</div>
                    <div className="text-sm text-slate-500">Smart reminders before expiry</div>
                  </div>
                </div>
                <Switch 
                  checked={reminders.push} 
                  onCheckedChange={(c) => setReminders({...reminders, push: c})} 
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center" />
                  <div>
                    <div className="font-medium text-white text-sm">Email Digest</div>
                    <div className="text-xs text-slate-500">Weekly summary of your profile health</div>
                  </div>
                </div>
                <Switch 
                  checked={reminders.email} 
                  onCheckedChange={(c) => setReminders({...reminders, email: c})} 
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

            </Card>
          </motion.div>

          {/* Profile Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-8">Profiles</h2>
            <Card className="glass-panel p-4 rounded-3xl border-white/5">
              <div className="hover:bg-white/5 rounded-2xl p-2 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                    <Users className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Manage Profiles</div>
                    <div className="text-sm text-slate-500">Add, edit or remove family members</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors mr-2" />
              </div>
            </Card>
          </motion.div>

          {/* Log Out */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-400 font-medium transition-colors">
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
