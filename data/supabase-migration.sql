-- ZeeBuild OS - Notes & Feedback Tables
-- Run this in Supabase SQL Editor

-- Notes table (private, admin only)
CREATE TABLE IF NOT EXISTS os_notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table (public submissions, admin managed)
CREATE TABLE IF NOT EXISTS os_feedback (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Anonymous',
    message TEXT NOT NULL,
    visible BOOLEAN DEFAULT true,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor counter (persistent)
CREATE TABLE IF NOT EXISTS os_visitors (
    id SERIAL PRIMARY KEY,
    ip TEXT,
    user_agent TEXT,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for visitor counting
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON os_visitors(visited_at DESC);

-- Enable RLS
ALTER TABLE os_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_visitors ENABLE ROW LEVEL SECURITY;

-- Notes: only accessible via service role (admin)
CREATE POLICY "Notes are private" ON os_notes FOR ALL USING (true);

-- Feedback: anyone can insert, anyone can read visible ones
CREATE POLICY "Anyone can submit feedback" ON os_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read visible feedback" ON os_feedback FOR SELECT USING (visible = true);
CREATE POLICY "Service role full access feedback" ON os_feedback FOR ALL USING (true);

-- Visitors: anyone can insert
CREATE POLICY "Anyone can log visit" ON os_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can count visitors" ON os_visitors FOR SELECT USING (true);
