'use client';

import { useState } from 'react';
import { createCourseClient } from '@/lib/course/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const supabase = createCourseClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setStatus('error');
      setError(authError.message);
      return;
    }

    setStatus('sent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-medium text-white mb-2">Islamic Finance Mastery Course</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Invite-only access. Enter your email to receive a magic link.
        </p>

        {status === 'sent' ? (
          <div className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-4 py-3 text-sm text-[#1D9E75]">
            Check your email for the login link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1D9E75]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-[#1D9E75] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0F6E56] disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Sending...' : 'Send magic link'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
