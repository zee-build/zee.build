'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Users, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { getProfiles, getDocumentsByProfile } from '@/lib/neverlate/storage';
import { calculateLifeHealthScore, getRelationTypeLabel } from '@/lib/neverlate/utils';
import type { Profile } from '@/lib/neverlate/types';

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
    
    return {
      total: documents.length,
      urgent: healthScore.urgent_count,
      upcoming: healthScore.upcoming_count,
      overdue: healthScore.overdue_count,
      score: healthScore.score,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="neverlate-container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/neverlate" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold">Profiles</h1>
            <p className="text-muted-foreground mt-2">
              Manage documents for yourself and your family
            </p>
          </div>
          <Link href="/neverlate/app/profiles/new">
            <Button size="lg" className="neverlate-gradient">
              <Plus className="w-5 h-5 mr-2" />
              Add Profile
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {profiles.length === 0 ? (
          <Card className="neverlate-card p-16 text-center">
            <div className="w-20 h-20 rounded-full neverlate-gradient-subtle flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No profiles yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first profile to start tracking important documents and renewals.
            </p>
            <Link href="/neverlate/app/profiles/new">
              <Button size="lg" className="neverlate-gradient">
                <Plus className="w-5 h-5 mr-2" />
                Create First Profile
              </Button>
            </Link>
          </Card>
        ) : (
          /* Profile Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
              const stats = getProfileStats(profile.id);
              const hasUrgent = stats.urgent > 0 || stats.overdue > 0;
              
              return (
                <Link key={profile.id} href={`/neverlate/app/profiles/${profile.id}`}>
                  <Card className="neverlate-card h-full hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl profile-${profile.relation_type}`}
                           style={{ background: `rgba(var(--profile-color), 0.1)`, color: `rgb(var(--profile-color))` }}>
                        {profile.avatar_icon || profile.name.charAt(0).toUpperCase()}
                      </div>
                      {hasUrgent && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {stats.urgent + stats.overdue}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getRelationTypeLabel(profile.relation_type)}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Documents</span>
                        <span className="font-medium">{stats.total}</span>
                      </div>
                      {stats.overdue > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-destructive">Overdue</span>
                          <span className="font-bold text-destructive">{stats.overdue}</span>
                        </div>
                      )}
                      {stats.urgent > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-orange-500">Urgent</span>
                          <span className="font-medium text-orange-500">{stats.urgent}</span>
                        </div>
                      )}
                      {stats.upcoming > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-amber-500">Upcoming</span>
                          <span className="font-medium text-amber-500">{stats.upcoming}</span>
                        </div>
                      )}
                    </div>

                    {/* Life Health Score */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Life Health</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all"
                              style={{
                                width: `${stats.score}%`,
                                background: stats.score >= 80 ? 'rgb(34 197 94)' : stats.score >= 50 ? 'rgb(251 191 36)' : 'rgb(239 68 68)'
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold">{stats.score}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
