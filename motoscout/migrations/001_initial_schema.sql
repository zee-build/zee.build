-- MotoScout Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Saved Searches Table
CREATE TABLE IF NOT EXISTS motoscout_saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    keywords TEXT,
    max_price NUMERIC,
    min_year INTEGER,
    location TEXT,
    sources JSONB DEFAULT '{"dubizzle": true}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Facebook Watchlist Table
CREATE TABLE IF NOT EXISTS motoscout_facebook_watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'OK',
    last_checked_at TIMESTAMPTZ,
    last_error TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Listings Table
CREATE TABLE IF NOT EXISTS motoscout_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('DUBIZZLE', 'FACEBOOK')),
    source_url TEXT NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC,
    currency TEXT DEFAULT 'AED',
    location_text TEXT,
    year INTEGER,
    image_url TEXT,
    posted_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    hash TEXT,
    raw JSONB,
    UNIQUE(source_url, user_id)
);

-- 4. Listing Actions Table
CREATE TABLE IF NOT EXISTS motoscout_listing_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES motoscout_listings(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT false,
    is_ignored BOOLEAN DEFAULT false,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 5. Scan Requests Table (for GitHub Actions coordination)
CREATE TABLE IF NOT EXISTS motoscout_scan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'DONE', 'ERROR')),
    completed_at TIMESTAMPTZ,
    error_message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON motoscout_saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_is_active ON motoscout_saved_searches(is_active);
CREATE INDEX IF NOT EXISTS idx_facebook_watchlist_user_id ON motoscout_facebook_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_facebook_watchlist_is_active ON motoscout_facebook_watchlist(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON motoscout_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_source ON motoscout_listings(source);
CREATE INDEX IF NOT EXISTS idx_listings_fetched_at ON motoscout_listings(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_actions_user_listing ON motoscout_listing_actions(user_id, listing_id);
CREATE INDEX IF NOT EXISTS idx_scan_requests_status ON motoscout_scan_requests(status);

-- Enable Row Level Security
ALTER TABLE motoscout_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoscout_facebook_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoscout_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoscout_listing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoscout_scan_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Saved Searches
CREATE POLICY "Users can view their own saved searches"
    ON motoscout_saved_searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved searches"
    ON motoscout_saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches"
    ON motoscout_saved_searches FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
    ON motoscout_saved_searches FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Facebook Watchlist
CREATE POLICY "Users can view their own watchlist"
    ON motoscout_facebook_watchlist FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watchlist items"
    ON motoscout_facebook_watchlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items"
    ON motoscout_facebook_watchlist FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items"
    ON motoscout_facebook_watchlist FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Listings
CREATE POLICY "Users can view their own listings"
    ON motoscout_listings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert listings"
    ON motoscout_listings FOR INSERT
    WITH CHECK (true);

-- RLS Policies for Listing Actions
CREATE POLICY "Users can view their own listing actions"
    ON motoscout_listing_actions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listing actions"
    ON motoscout_listing_actions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listing actions"
    ON motoscout_listing_actions FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for Scan Requests
CREATE POLICY "Users can view their own scan requests"
    ON motoscout_scan_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan requests"
    ON motoscout_scan_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON motoscout_saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facebook_watchlist_updated_at BEFORE UPDATE ON motoscout_facebook_watchlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_actions_updated_at BEFORE UPDATE ON motoscout_listing_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
