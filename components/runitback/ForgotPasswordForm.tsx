'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setDone(true)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rib-tile rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-3">
          <CheckCircle2 size={40} className="text-rib-acc" />
        </div>
        <h1 className="rib-heading text-2xl mb-2">REQUEST SENT</h1>
        <p className="rib-body text-sm mb-6">
          If that username exists, a mod will review your reset and switch you to the new password.
          Ping a mod to approve it, then sign in with your new password.
        </p>
        <Link
          href="/runitback/login"
          className="inline-block rib-heading text-sm py-3 px-6 rounded-lg bg-rib-acc text-rib-bg"
          style={{ letterSpacing: '2px' }}
        >
          BACK TO SIGN IN
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rib-tile rounded-xl p-8 max-w-md w-full">
      <h1 className="rib-heading text-2xl mb-1">FORGOT PASSWORD</h1>
      <p className="rib-body text-sm mb-6">
        Enter your username and a new password. A mod approves the change to confirm it&apos;s really you.
      </p>

      <div className="space-y-4">
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            USERNAME
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="Your username"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            NEW PASSWORD
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            CONFIRM NEW PASSWORD
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </div>

        {error && <p className="rib-body text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
          style={{ letterSpacing: '2px' }}
        >
          {submitting ? 'SENDING...' : 'REQUEST RESET'}
        </button>

        <p className="rib-body text-xs text-center">
          Remembered it?{' '}
          <Link href="/runitback/login" className="text-rib-acc">
            Back to sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
