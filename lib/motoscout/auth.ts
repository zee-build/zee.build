import { supabase } from '@/lib/supabase/client';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export function isAllowedEmail(email: string): boolean {
  const allowedEmail = process.env.MOTOSCOUT_ALLOWED_EMAIL || process.env.NEXT_PUBLIC_MOTOSCOUT_ALLOWED_EMAIL;
  if (!allowedEmail) return false;
  
  const allowedEmails = allowedEmail.split(',').map((e: string) => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}

export async function checkMotoScoutAccess(): Promise<{ allowed: boolean; user: any | null }> {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { allowed: false, user: null };
    }
    
    const allowed = await isAllowedEmail(user.email);
    return { allowed, user };
  } catch (error) {
    return { allowed: false, user: null };
  }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
