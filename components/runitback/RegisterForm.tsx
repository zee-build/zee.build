'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<'choice' | 'form'>('choice')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      router.push('/runitback/link-card')
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'choice') {
    return (
      <div className="rib-tile rounded-xl p-8 max-w-md w-full">
        <h1 className="rib-heading text-2xl mb-1">CREATE ACCOUNT</h1>
        <p className="rib-body text-sm mb-6">
          Were you already part of the squad before logins existed?
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="w-full rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg"
            style={{ letterSpacing: '2px' }}
          >
            EXISTING PLAYER — LINK MY CARD
          </button>
          <Link
            href="/runitback/join"
            className="block text-center w-full rib-heading text-sm py-3 rounded-lg border border-rib-border text-white"
            style={{ letterSpacing: '2px' }}
          >
            NEW PLAYER — JOIN THE SQUAD
          </Link>
        </div>

        <p className="rib-body text-xs text-center mt-4">
          Already have an account?{' '}
          <Link href="/runitback/login" className="text-rib-acc">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rib-tile rounded-xl p-8 max-w-md w-full">
      <h1 className="rib-heading text-2xl mb-1">CREATE ACCOUNT</h1>
      <p className="rib-body text-sm mb-6">
        Pick a username and password — next you&apos;ll link this account to your existing player card.
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
            minLength={3}
            maxLength={20}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="3-20 characters"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            PASSWORD
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            CONFIRM PASSWORD
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            minLength={6}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="Repeat your password"
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
          {submitting ? 'CREATING...' : 'CONTINUE'}
        </button>

        <button
          type="button"
          onClick={() => setStep('choice')}
          className="w-full rib-body text-xs text-rib-muted text-center"
        >
          ← Back
        </button>

        <p className="rib-body text-xs text-center">
          Already have an account?{' '}
          <Link href="/runitback/login" className="text-rib-acc">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
