'use client';

import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/course-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? 'sent' : 'error');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-medium text-white mb-2">You're on the list</h1>
        <p className="text-sm text-zinc-400 mb-8">
          The Islamic Finance Mastery Course is invite-only right now. Leave your
          email and we'll reach out when a seat opens up.
        </p>

        {status === 'sent' ? (
          <div className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-4 py-3 text-sm text-[#1D9E75]">
            You've been added to the waitlist.
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
              {status === 'loading' ? 'Joining...' : 'Join waitlist'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-400">Something went wrong. Try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
