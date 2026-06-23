import { SupabaseClient } from '@supabase/supabase-js';

export interface CourseModule {
  module_id: string;
  part: number;
  module_number: number;
  title: string;
  slug: string;
  description: string | null;
  estimated_minutes: number;
  has_calculator: boolean;
  has_quiz: boolean;
  quiz_pass_threshold: number;
  next_module_slug: string | null;
  pricing_tier: string;
  published: boolean;
}

export async function getPublishedModules(supabase: SupabaseClient): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('published', true)
    .order('part', { ascending: true })
    .order('module_number', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getModuleBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<CourseModule | null> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
