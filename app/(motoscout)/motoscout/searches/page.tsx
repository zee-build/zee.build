'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Bike, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar,
  Layers,
  Facebook,
  Globe,
  Bell,
  Zap,
  Trash2,
  Power,
  PowerOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BikeData {
  brand: string;
  model: string;
  displayName: string;
  imageSideUrl: string;
  category: string;
}

interface SavedSearch {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  keywords?: string;
  max_price?: number;
  min_year?: number;
  location?: string;
  is_active: boolean;
  created_at: string;
}

const steps = ['Vehicle', 'Filters', 'Sources'];

export default function SearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    keywords: '',
    max_price: '',
    min_year: '',
    location: '',
  });

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const res = await fetch('/api/motoscout/searches');
      const data = await res.json();
      setSearches(data.searches || []);
    } catch (error) {
      console.error('Failed to fetch searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/motoscout/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          max_price: formData.max_price ? parseFloat(formData.max_price) : undefined,
          min_year: formData.min_year ? parseInt(formData.min_year) : undefined,
        }),
      });

      if (res.ok) {
        setFormData({
          name: '',
          brand: '',
          model: '',
          keywords: '',
          max_price: '',
          min_year: '',
          location: '',
        });
        setShowForm(false);
        fetchSearches();
      }
    } catch (error) {
      console.error('Failed to create search:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/motoscout/searches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchSearches();
    } catch (error) {
      console.error('Failed to toggle search:', error);
    }
  };

  const deleteSearch = async (id: string) => {
    if (!confirm('Delete this search?')) return;
    
    try {
      await fetch(`/api/motoscout/searches/${id}`, { method: 'DELETE' });
      fetchSearches();
    } catch (error) {
      console.error('Failed to delete search:', error);
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
              <Search className="w-8 h-8 motoscout-speed" />
              Saved Searches
            </h1>
            <p className="text-muted-foreground mt-2">
              Create Dubizzle search criteria and get alerts for new matches
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Search
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="p-6 mb-8 motoscout-panel">
            <h2 className="text-xl font-bold mb-4">Create New Search</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Search Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sport Bikes Under 30k"
                    required
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Yamaha"
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., R1"
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g., sport, racing"
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="max_price">Max Price (AED)</Label>
                  <Input
                    id="max_price"
                    type="number"
                    value={formData.max_price}
                    onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                    placeholder="e.g., 30000"
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="min_year">Min Year</Label>
                  <Input
                    id="min_year"
                    type="number"
                    value={formData.min_year}
                    onChange={(e) => setFormData({ ...formData, min_year: e.target.value })}
                    placeholder="e.g., 2018"
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Dubai"
                    className="bg-secondary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create Search
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Searches List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : searches.length === 0 ? (
          <Card className="p-12 text-center motoscout-panel">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No searches yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first search to start monitoring Dubizzle
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Search
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {searches.map((search) => (
              <Card key={search.id} className="p-6 motoscout-panel">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{search.name}</h3>
                      {search.is_active ? (
                        <span className="px-2 py-1 rounded text-xs font-mono motoscout-gauge bg-green-500/10 border border-green-500/20">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-mono text-muted-foreground bg-muted">
                          PAUSED
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {search.brand && <p>Brand: {search.brand}</p>}
                      {search.model && <p>Model: {search.model}</p>}
                      {search.keywords && <p>Keywords: {search.keywords}</p>}
                      {search.max_price && <p>Max Price: AED {search.max_price.toLocaleString()}</p>}
                      {search.min_year && <p>Min Year: {search.min_year}</p>}
                      {search.location && <p>Location: {search.location}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(search.id, search.is_active)}
                    >
                      {search.is_active ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSearch(search.id)}
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
