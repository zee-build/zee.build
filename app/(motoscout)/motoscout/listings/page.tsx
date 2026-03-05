'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, EyeOff, ExternalLink, Filter, Star, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Listing {
  id: string;
  source: string;
  source_url: string;
  title: string;
  price?: number;
  currency: string;
  location_text?: string;
  year?: number;
  image_url?: string;
  fetched_at: string;
  actions?: Array<{
    is_favorite: boolean;
    is_ignored: boolean;
    notes?: string;
  }>;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    favoritesOnly: false,
    hideIgnored: true,
    minPrice: '',
    maxPrice: '',
    recency: '30d',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.source) params.append('source', filters.source);
      if (filters.favoritesOnly) params.append('favoritesOnly', 'true');
      if (filters.hideIgnored) params.append('hideIgnored', 'true');
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.recency) params.append('recency', filters.recency);

      const res = await fetch(`/api/motoscout/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (listingId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/motoscout/listings/${listingId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !currentStatus }),
      });
      fetchListings();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const toggleIgnore = async (listingId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/motoscout/listings/${listingId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_ignored: !currentStatus }),
      });
      fetchListings();
    } catch (error) {
      console.error('Failed to toggle ignore:', error);
    }
  };

  const getActionStatus = (listing: Listing) => {
    if (!listing.actions || listing.actions.length === 0) {
      return { isFavorite: false, isIgnored: false };
    }
    return {
      isFavorite: listing.actions[0].is_favorite,
      isIgnored: listing.actions[0].is_ignored,
    };
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/motoscout" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="w-8 h-8 motoscout-gauge" />
              Listings Feed
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse all discovered listings. Favorite, ignore, and add notes.
            </p>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-6 mb-8 motoscout-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full p-2 rounded-lg bg-secondary border border-border"
                >
                  <option value="">All Sources</option>
                  <option value="DUBIZZLE">Dubizzle</option>
                  <option value="FACEBOOK">Facebook</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Recency</label>
                <select
                  value={filters.recency}
                  onChange={(e) => setFilters({ ...filters, recency: e.target.value })}
                  className="w-full p-2 rounded-lg bg-secondary border border-border"
                >
                  <option value="">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="bg-secondary"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.favoritesOnly}
                  onChange={(e) => setFilters({ ...filters, favoritesOnly: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Favorites Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hideIgnored}
                  onChange={(e) => setFilters({ ...filters, hideIgnored: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Hide Ignored</span>
              </label>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-2xl font-bold motoscout-gauge">{listings.length}</p>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </Card>
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-2xl font-bold motoscout-speed">
              {listings.filter(l => getActionStatus(l).isFavorite).length}
            </p>
            <p className="text-sm text-muted-foreground">Favorites</p>
          </Card>
          <Card className="p-4 motoscout-panel text-center">
            <p className="text-2xl font-bold motoscout-warning">
              {listings.filter(l => l.source === 'DUBIZZLE').length}
            </p>
            <p className="text-sm text-muted-foreground">From Dubizzle</p>
          </Card>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : listings.length === 0 ? (
          <Card className="p-12 text-center motoscout-panel">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Create some searches or add watchlist items to start discovering listings
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const { isFavorite, isIgnored } = getActionStatus(listing);
              
              return (
                <Card key={listing.id} className="overflow-hidden motoscout-panel group">
                  {/* Image */}
                  {listing.image_url && (
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Source Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          listing.source === 'DUBIZZLE'
                            ? 'border-primary/20 text-primary'
                            : 'border-accent/20 text-accent'
                        }
                      >
                        {listing.source}
                      </Badge>
                      {listing.year && (
                        <span className="text-xs text-muted-foreground">{listing.year}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>

                    {/* Price & Location */}
                    <div className="flex items-center justify-between mb-4">
                      {listing.price ? (
                        <p className="text-lg font-bold motoscout-speed">
                          {listing.currency} {listing.price.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Price not listed</p>
                      )}
                      {listing.location_text && (
                        <p className="text-xs text-muted-foreground">{listing.location_text}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isFavorite ? 'default' : 'outline'}
                        onClick={() => toggleFavorite(listing.id, isFavorite)}
                        className={isFavorite ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant={isIgnored ? 'default' : 'outline'}
                        onClick={() => toggleIgnore(listing.id, isIgnored)}
                        className={isIgnored ? 'bg-muted' : ''}
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <a href={listing.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground mt-3">
                      Found {new Date(listing.fetched_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
