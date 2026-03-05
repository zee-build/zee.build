'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Trash2, Power, PowerOff, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface WatchlistItem {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  status: string;
  last_checked_at?: string;
  last_error?: string;
  notes?: string;
  created_at: string;
}

export default function FacebookWatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    notes: '',
  });

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/motoscout/facebook');
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/motoscout/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', url: '', notes: '' });
        setShowForm(false);
        fetchWatchlist();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create watchlist item');
      }
    } catch (error) {
      console.error('Failed to create watchlist item:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/motoscout/facebook/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchWatchlist();
    } catch (error) {
      console.error('Failed to toggle watchlist item:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this watchlist item?')) return;
    
    try {
      await fetch(`/api/motoscout/facebook/${id}`, { method: 'DELETE' });
      fetchWatchlist();
    } catch (error) {
      console.error('Failed to delete watchlist item:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/motoscout" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Eye className="w-8 h-8 motoscout-alert" />
              Facebook Watchlist
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor specific Facebook Marketplace URLs for new listings
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add URL
          </Button>
        </div>

        {/* Warning Banner */}
        <Card className="p-4 mb-8 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 motoscout-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Facebook Limitations</p>
              <p className="text-muted-foreground">
                Facebook may block automated access. Items marked as BLOCKED cannot be scanned without manual login.
                No authentication bypass or captcha solving is implemented.
              </p>
            </div>
          </div>
        </Card>

        {/* Create Form */}
        {showForm && (
          <Card className="p-6 mb-8 motoscout-panel">
            <h2 className="text-xl font-bold mb-4">Add Watchlist URL</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dubai Sport Bikes"
                  required
                  className="bg-secondary"
                />
              </div>
              <div>
                <Label htmlFor="url">Facebook Marketplace URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.facebook.com/marketplace/..."
                  required
                  className="bg-secondary"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes"
                  className="bg-secondary"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  Add to Watchlist
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Watchlist */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : watchlist.length === 0 ? (
          <Card className="p-12 text-center motoscout-panel">
            <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No watchlist items yet</h3>
            <p className="text-muted-foreground mb-6">
              Add Facebook Marketplace URLs to monitor
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {watchlist.map((item) => (
              <Card key={item.id} className="p-6 motoscout-panel">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      {item.is_active ? (
                        item.status === 'OK' ? (
                          <span className="px-2 py-1 rounded text-xs font-mono motoscout-gauge bg-green-500/10 border border-green-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-mono motoscout-alert bg-red-500/10 border border-red-500/20 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            BLOCKED
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-mono text-muted-foreground bg-muted">
                          PAUSED
                        </span>
                      )}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block mb-2"
                    >
                      {item.url}
                    </a>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{item.notes}</p>
                    )}
                    {item.last_checked_at && (
                      <p className="text-xs text-muted-foreground">
                        Last checked: {new Date(item.last_checked_at).toLocaleString()}
                      </p>
                    )}
                    {item.last_error && (
                      <p className="text-xs motoscout-alert mt-1">
                        Error: {item.last_error}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(item.id, item.is_active)}
                    >
                      {item.is_active ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
