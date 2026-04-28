-- Fix: Allow reading ALL feedback (not just visible)
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "Feedback select" ON os_feedback;
DROP POLICY IF EXISTS "Anyone can read visible feedback" ON os_feedback;

-- Allow reading all feedback
CREATE POLICY "Anyone can read all feedback" ON os_feedback 
  FOR SELECT USING (true);
