'use client'

import { useState } from 'react'
import { adminFetch } from '@/lib/runitback/admin'
import PhotoUpload from './PhotoUpload'
import type { Player, PlayerRole, Position } from '@/lib/runitback/types'

const POSITIONS: Position[] = ['GK', 'CB', 'RB', 'LB', 'CM', 'CAM', 'ST', 'LW', 'RW']
const ROLES: PlayerRole[] = ['player', 'mod', 'admin']

interface PlayerFormProps {
  player?: Player
  onSaved: () => void
  onCancel?: () => void
}

export default function PlayerForm({ player, onSaved, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name ?? '')
  const [nickname, setNickname] = useState(player?.nickname ?? '')
  const [position, setPosition] = useState<Position>((player?.position as Position) ?? 'CM')
  const [isRegular, setIsRegular] = useState(player?.is_regular ?? true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(player?.avatar_url ?? null)
  const [role, setRole] = useState<PlayerRole>(player?.role ?? 'player')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isEdit = Boolean(player)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    setSubmitting(true)
    try {
      const body = {
        name: name.trim(),
        nickname: nickname.trim() || null,
        position,
        is_regular: isRegular,
        avatar_url: avatarUrl,
        ...(isEdit ? { role } : {}),
      }

      const res = await adminFetch(
        isEdit ? `/api/runitback/players/${player!.id}` : '/api/runitback/players',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isEdit ? body : { ...body, registered_via_link: false }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      onSaved()
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PhotoUpload name={name} value={avatarUrl} onChange={setAvatarUrl} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
        />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname (optional)"
          className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
          className="bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
        >
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsRegular(true)}
            className={`flex-1 rib-heading text-xs py-2 rounded-lg border transition-colors ${
              isRegular ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
            }`}
          >
            REGULAR
          </button>
          <button
            type="button"
            onClick={() => setIsRegular(false)}
            className={`flex-1 rib-heading text-xs py-2 rounded-lg border transition-colors ${
              !isRegular ? 'bg-rib-acc/20 border-rib-acc text-rib-acc' : 'border-rib-border text-rib-muted'
            }`}
          >
            GUEST
          </button>
        </div>
        {isEdit && (
          <div>
            <label className="rib-heading text-xs text-rib-muted block mb-1.5" style={{ letterSpacing: '1.5px' }}>
              ROLE
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as PlayerRole)}
              className="w-full bg-rib-bg2 border border-rib-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rib-acc"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p className="rib-body text-red-400 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rib-heading text-xs px-4 py-2 rounded-lg bg-rib-acc text-rib-bg disabled:opacity-50"
          style={{ letterSpacing: '1.5px' }}
        >
          {submitting ? 'SAVING...' : isEdit ? 'SAVE CHANGES' : 'ADD PLAYER'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rib-heading text-xs px-4 py-2 rounded-lg border border-rib-border text-rib-muted"
            style={{ letterSpacing: '1.5px' }}
          >
            CANCEL
          </button>
        )}
      </div>
    </form>
  )
}
