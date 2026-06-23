import { SupabaseClient } from '@supabase/supabase-js';

export interface UserProgress {
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  quiz_score: number | null;
  attempts: number;
  completed_at: string | null;
}

export async function getUserProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_id, status, quiz_score, attempts, completed_at')
    .eq('user_id', userId);

  if (error) throw error;
  return data ?? [];
}
