'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'
import type { LeagueSettings } from '@/lib/runitback/types'

export default function ModSettings() {
  const [settings, setSettings] = useState<LeagueSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/runitback/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (key: 'ratings_public' | 'voting_open') => {
    if (!settings) return
    setSaving(key)
    setMessage('')
    const next = { ...settings, [key]: !settings[key] }
    try {
      const res = await adminFetch('/api/runitback/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: !settings[key] }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSettings(updated)
        setMessage('Settings saved.')
      } else {
        const data = await res.json()
        setMessage(data.error ?? 'Failed to save.')
      }
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-rib-muted py-4">
        <Loader2 size={16} className="animate-spin" />
        <span className="rib-body text-xs">Loading settings…</span>
      </div>
    )
  }

  if (!settings) return null

  const rows: { key: 'ratings_public' | 'voting_open'; label: string; description: string }[] = [
    {
      key: 'ratings_public',
      label: 'RATINGS VISIBLE',
      description: 'When off, overall ratings and attribute scores are hidden from regular players.',
    },
    {
      key: 'voting_open',
      label: 'VOTING OPEN',
      description: 'When off, regular players cannot submit peer ratings for teammates.',
    },
  ]

  return (
    <div className="space-y-4">
      {rows.map(({ key, label, description }) => {
        const isOn = settings[key]
        return (
          <div key={key} className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="rib-heading text-xs" style={{ letterSpacing: '1.5px' }}>
                {label}
              </p>
              <p className="rib-body text-xs text-rib-muted mt-0.5">{description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              disabled={saving === key}
              className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors disabled:opacity-60 ${isOn ? 'bg-rib-acc' : 'bg-rib-border'}`}
              aria-label={label}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isOn ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>
        )
      })}
      {message && <p className="rib-body text-xs text-rib-muted">{message}</p>}
    </div>
  )
}
