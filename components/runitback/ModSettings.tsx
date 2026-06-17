'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, MessageSquare, MessageSquareOff, Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import type { LeagueSettings } from '@/lib/runitback/types'

type SettingKey = 'ratings_public' | 'voting_open'

interface SettingDef {
  key: SettingKey
  label: string
  descOn: string
  descOff: string
  iconOn: React.ReactNode
  iconOff: React.ReactNode
  badgeOn: string
  badgeOff: string
}

const SETTINGS: SettingDef[] = [
  {
    key: 'ratings_public',
    label: 'PLAYER RATINGS',
    descOn: 'Overall ratings and attribute scores are visible to all players.',
    descOff: 'Ratings and attribute scores are hidden from regular players — only mods and admins can see them.',
    iconOn: <Eye size={20} />,
    iconOff: <EyeOff size={20} />,
    badgeOn: 'PUBLIC',
    badgeOff: 'HIDDEN',
  },
  {
    key: 'voting_open',
    label: 'PEER VOTING',
    descOn: 'All players can submit peer ratings for their teammates.',
    descOff: 'Voting is locked — regular players cannot submit ratings until this is turned back on.',
    iconOn: <MessageSquare size={20} />,
    iconOff: <MessageSquareOff size={20} />,
    badgeOn: 'OPEN',
    badgeOff: 'LOCKED',
  },
]

export default function ModSettings() {
  const [settings, setSettings] = useState<LeagueSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<SettingKey | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/runitback/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (key: SettingKey) => {
    if (!settings || saving) return
    setSaving(key)
    setError('')
    const newValue = !settings[key]
    // Optimistic update
    setSettings((s) => s ? { ...s, [key]: newValue } : s)
    try {
      const res = await adminFetch('/api/runitback/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newValue }),
      })
      if (!res.ok) {
        // Revert on failure
        setSettings((s) => s ? { ...s, [key]: !newValue } : s)
        const data = await res.json()
        setError(data.error ?? 'Failed to save.')
      } else {
        const updated = await res.json()
        setSettings(updated)
      }
    } catch {
      setSettings((s) => s ? { ...s, [key]: !newValue } : s)
      setError('Network error.')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SETTINGS.map((s) => (
          <div key={s.key} className="rib-tile rounded-xl p-5 animate-pulse h-32" />
        ))}
      </div>
    )
  }

  if (!settings) {
    return (
      <p className="rib-body text-xs text-red-400">
        {error || 'Could not load settings.'}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SETTINGS.map((def) => {
          const isOn = settings[def.key]
          const isSaving = saving === def.key

          return (
            <button
              key={def.key}
              type="button"
              onClick={() => toggle(def.key)}
              disabled={isSaving}
              className={`rib-tile rounded-xl p-5 text-left transition-all duration-200 border-2 disabled:cursor-wait group ${
                isOn
                  ? 'border-rib-acc/40 hover:border-rib-acc'
                  : 'border-transparent hover:border-rib-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    isOn ? 'bg-rib-acc/15 text-rib-acc' : 'bg-rib-border/40 text-rib-muted'
                  }`}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : (isOn ? def.iconOn : def.iconOff)}
                </div>

                {/* Status badge + toggle */}
                <div className="flex items-center gap-2">
                  <span
                    className={`rib-heading text-[10px] px-2 py-0.5 rounded-full ${
                      isOn
                        ? 'bg-rib-acc/15 text-rib-acc'
                        : 'bg-rib-border/40 text-rib-muted'
                    }`}
                    style={{ letterSpacing: '1.5px' }}
                  >
                    {isOn ? def.badgeOn : def.badgeOff}
                  </span>
                  {/* Toggle pill */}
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                      isOn ? 'bg-rib-acc' : 'bg-rib-border'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        isOn ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <p className="rib-heading text-sm mb-1" style={{ letterSpacing: '1.5px' }}>
                {def.label}
              </p>

              {/* Description */}
              <p className="rib-body text-xs text-rib-muted leading-relaxed">
                {isOn ? def.descOn : def.descOff}
              </p>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="rib-body text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
