'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUpload from './PhotoUpload'
import { CLUBS, COUNTRIES } from '@/lib/runitback/config'
import type { Player, Position } from '@/lib/runitback/types'

const POSITIONS: Position[] = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']

export default function ProfileForm({ player }: { player: Player }) {
  const router = useRouter()
  const [nickname, setNickname] = useState(player.nickname ?? '')
  const [position, setPosition] = useState<Position>((player.position as Position) ?? 'CM')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(player.avatar_url)
  const [favoriteTeam, setFavoriteTeam] = useState(player.favorite_team ?? '')
  const [country, setCountry] = useState(player.country ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/runitback/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || null,
          position,
          avatar_url: avatarUrl,
          favorite_team: favoriteTeam || null,
          country: country || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/runitback/auth/logout', { method: 'POST' })
    router.push('/runitback')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rib-tile rounded-xl p-8 max-w-md w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="rib-heading text-2xl">{player.name}</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rib-heading text-xs text-rib-muted"
          style={{ letterSpacing: '1.5px' }}
        >
          LOG OUT
        </button>
      </div>

      <div>
        <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
          PHOTO
        </label>
        <PhotoUpload name={player.name} value={avatarUrl} onChange={setAvatarUrl} />
      </div>

      <div>
        <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
          NICKNAME
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
          FAVOURITE CLUB
        </label>
        <select
          value={favoriteTeam}
          onChange={(e) => setFavoriteTeam(e.target.value)}
          className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-rib-acc"
        >
          <option value="">No badge</option>
          {CLUBS.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
          COUNTRY
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

      {error && <p className="rib-body text-red-400 text-sm">{error}</p>}
      {success && <p className="rib-body text-rib-acc text-sm">Profile updated.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rib-heading text-sm py-3 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
        style={{ letterSpacing: '2px' }}
      >
        {submitting ? 'SAVING...' : 'SAVE CHANGES'}
      </button>
    </form>
  )
}
