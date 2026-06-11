'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      router.push('/runitback/profile')
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rib-tile rounded-xl p-8 max-w-md w-full">
      <h1 className="rib-heading text-2xl mb-1">PLAYER LOGIN</h1>
      <p className="rib-body text-sm mb-6">Sign in to manage your profile.</p>

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
            PASSWORD
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>

        {error && <p className="rib-body text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
          style={{ letterSpacing: '2px' }}
        >
          {submitting ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <p className="rib-body text-xs text-center">
          New here?{' '}
          <Link href="/runitback/register" className="text-rib-acc">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  )
}
