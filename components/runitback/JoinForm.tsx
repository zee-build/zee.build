'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getInitials } from '@/lib/runitback/queries'
import PhotoUpload from './PhotoUpload'
import { COUNTRIES } from '@/lib/runitback/config'
import type { Position } from '@/lib/runitback/types'

const POSITIONS: Position[] = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']

export default function JoinForm() {
  const [step, setStep] = useState<'choice' | 'form'>('choice')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [position, setPosition] = useState<Position>('CM')
  const [country, setCountry] = useState('')
  const [isRegular, setIsRegular] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          nickname: nickname.trim() || null,
          position,
          country: country || null,
          is_regular: isRegular,
          avatar_url: avatarUrl,
          username: username.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'choice') {
    return (
      <div className="rib-tile rounded-xl p-8 max-w-md w-full">
        <h1 className="rib-heading text-2xl mb-1">JOIN RUN IT BACK</h1>
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
            NEW PLAYER — JOIN THE SQUAD
          </button>
          <Link
            href="/runitback/register"
            className="block text-center w-full rib-heading text-sm py-3 rounded-lg border border-rib-border text-white"
            style={{ letterSpacing: '2px' }}
          >
            EXISTING PLAYER — LINK MY CARD
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

  if (success) {
    return (
      <div className="rib-tile rounded-xl p-8 max-w-md w-full text-center border-2 rib-card-gold">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-rib-acc2 text-white rib-heading text-3xl mx-auto mb-4 overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            getInitials(name)
          )}
        </div>
        <h2 className="rib-heading text-xl text-rib-muted mb-1" style={{ letterSpacing: '1.5px' }}>
          {position}
        </h2>
        <h1 className="rib-heading text-2xl mb-4">{name}</h1>
        <p className="rib-body text-sm">
          Welcome to Run It Back, {name}! Your FIFA card will appear on the roster soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rib-tile rounded-xl p-8 max-w-md w-full">
      <h1 className="rib-heading text-2xl mb-1">JOIN RUN IT BACK</h1>
      <p className="rib-body text-sm mb-6">Register yourself for Friday &amp; Tuesday games.</p>

      <div className="space-y-4">
        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            PHOTO (OPTIONAL)
          </label>
          <PhotoUpload name={name} value={avatarUrl} onChange={setAvatarUrl} />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            NAME
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            NICKNAME (OPTIONAL)
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
            placeholder="What the squad calls you"
          />
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            POSITION
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
          >
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            COUNTRY (OPTIONAL)
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
          >
            <option value="">No flag</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
            STATUS
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsRegular(true)}
              className={`flex-1 rib-heading text-sm py-2.5 rounded-lg border transition-colors ${
                isRegular ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
              }`}
            >
              REGULAR
            </button>
            <button
              type="button"
              onClick={() => setIsRegular(false)}
              className={`flex-1 rib-heading text-sm py-2.5 rounded-lg border transition-colors ${
                !isRegular ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
              }`}
            >
              GUEST
            </button>
          </div>
        </div>

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
          {submitting ? 'JOINING...' : 'JOIN THE SQUAD'}
        </button>

        <button
          type="button"
          onClick={() => setStep('choice')}
          className="w-full rib-body text-xs text-rib-muted text-center"
        >
          ← Back
        </button>
      </div>
    </form>
  )
}
