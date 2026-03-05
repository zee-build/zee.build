import { redirect } from 'next/navigation';
import { checkMotoScoutAccess } from '@/lib/motoscout/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Eye, Zap, Bell, TrendingUp, Shield } from 'lucide-react';

export default async function MotoScoutDashboard() {
  // For demo purposes, allow access without auth if env vars not set
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  let user = null;
  if (!isDemoMode) {
    const { allowed, user: authUser } = await checkMotoScoutAccess();
    if (!allowed) {
      redirect('/motoscout/login');
    }
    user = authUser;
  } else {
    user = { email: 'demo@motoscout.local' };
  }

  return (
    <div className="min-h-screen p-6 motoscout-scanline">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Zap className="w-10 h-10 motoscout-speed" />
              MotoScout
            </h1>
            <p className="text-muted-foreground">Find bikes fast. Alerts + Deal feed.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-mono text-sm motoscout-gauge">{user?.email}</p>
            </div>
            <form action="/api/motoscout/auth/signout" method="POST">
              <Button variant="outline" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>

        {/* Status Bar */}
        <div className="motoscout-hud rounded-lg p-4 grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">System</p>
            <p className="font-bold motoscout-gauge">ONLINE</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Scanner</p>
            <p className="font-bold motoscout-speed">ACTIVE</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Alerts</p>
            <p className="font-bold motoscout-warning">ENABLED</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Access</p>
            <p className="font-bold text-foreground">PRIVATE</p>
          </div>
        </div>
      </header>

      {/* Main Navigation Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/motoscout/searches">
          <Card className="p-6 motoscout-panel hover:motoscout-glow transition-all cursor-pointer group">
            <Search className="w-12 h-12 mb-4 motoscout-speed group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Saved Searches</h2>
            <p className="text-muted-foreground mb-4">
              Create custom Dubizzle search criteria and get alerts for new matches.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Manage Searches
            </Button>
          </Card>
        </Link>

        <Link href="/motoscout/facebook">
          <Card className="p-6 motoscout-panel hover:motoscout-glow transition-all cursor-pointer group">
            <Eye className="w-12 h-12 mb-4 motoscout-alert group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Facebook Watchlist</h2>
            <p className="text-muted-foreground mb-4">
              Monitor specific Facebook Marketplace URLs for new listings.
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90">
              Manage Watchlist
            </Button>
          </Card>
        </Link>

        <Link href="/motoscout/listings">
          <Card className="p-6 motoscout-panel hover:motoscout-glow transition-all cursor-pointer group">
            <TrendingUp className="w-12 h-12 mb-4 motoscout-gauge group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Listings Feed</h2>
            <p className="text-muted-foreground mb-4">
              Browse all discovered listings. Favorite, ignore, and add notes.
            </p>
            <Button className="w-full bg-secondary hover:bg-secondary/90">
              View Listings
            </Button>
          </Card>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto mt-12">
        <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-3xl font-bold motoscout-speed mb-1">0</p>
            <p className="text-sm text-muted-foreground">Active Searches</p>
          </Card>
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-3xl font-bold motoscout-alert mb-1">0</p>
            <p className="text-sm text-muted-foreground">Watchlist Items</p>
          </Card>
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-3xl font-bold motoscout-gauge mb-1">0</p>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </Card>
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-3xl font-bold motoscout-warning mb-1">0</p>
            <p className="text-sm text-muted-foreground">New Today</p>
          </Card>
        </div>
      </div>

      {/* Info Panel */}
      <div className="max-w-7xl mx-auto mt-12">
        <Card className="p-6 motoscout-panel border-primary/20">
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 motoscout-speed flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Telegram Alerts Enabled</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive instant notifications when new listings match your saved searches.
                Scanner runs automatically every 30 minutes via GitHub Actions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
