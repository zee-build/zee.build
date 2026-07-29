'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { adminFetch } from '@/lib/runitback/admin'

interface ResetRequest {
  id: string
  username: string
  playerName: string | null
  created_at: string
}

export default function PasswordResetsPanel() {
  const [resets, setResets] = useState<ResetRequest[] | null>(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    adminFetch('/api/runitback/admin/password-resets')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setResets(data.resets ?? [])
      })
      .catch(() => setError('Could not load reset requests.'))
  }

  useEffect(load, [])

  const handle = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve' && !confirm('Approve this password reset? The player will use their new password.')) return
    setBusyId(id)
    try {
      const res = await adminFetch('/api/runitback/admin/password-resets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) {
        setResets((prev) => (prev ? prev.filter((r) => r.id !== id) : prev))
      }
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <p className="rib-body text-red-400 text-sm">{error}</p>
  if (resets === null) return <p className="rib-body text-sm">Loading...</p>
  if (resets.length === 0) return <p className="rib-body text-sm text-rib-muted">No pending password resets.</p>

  return (
    <div className="space-y-2">
      {resets.map((r) => (
        <div key={r.id} className="rib-tile rounded-lg px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="rib-heading text-sm truncate">{r.playerName ?? r.username}</p>
            <p className="rib-body text-xs text-rib-muted">
              @{r.username} · {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
            </p>
          </div>
          <button
            onClick={() => handle(r.id, 'approve')}
            disabled={busyId === r.id}
            className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-rib-acc text-rib-acc hover:bg-rib-acc/10 flex items-center gap-1.5 disabled:opacity-50"
            style={{ letterSpacing: '1.5px' }}
          >
            <Check size={13} /> APPROVE
          </button>
          <button
            onClick={() => handle(r.id, 'reject')}
            disabled={busyId === r.id}
            className="rib-heading text-xs px-3 py-1.5 rounded-lg border border-red-900 text-red-400 hover:bg-red-950 flex items-center gap-1.5 disabled:opacity-50"
            style={{ letterSpacing: '1.5px' }}
          >
            <X size={13} /> REJECT
          </button>
        </div>
      ))}
    </div>
  )
}
