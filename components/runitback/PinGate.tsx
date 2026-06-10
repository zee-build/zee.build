'use client'

import { useRef, useState } from 'react'

const PIN_LENGTH = 4
const STORAGE_KEY = 'runitback-admin-auth'

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.sessionStorage.getItem(STORAGE_KEY))
  })
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError(false)

    if (digit && index < PIN_LENGTH - 1) {
      inputs.current[index + 1]?.focus()
    }

    if (digit && index === PIN_LENGTH - 1) {
      void verify(next.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const verify = async (pin: string) => {
    setChecking(true)
    try {
      const res = await fetch('/api/runitback/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) {
        window.sessionStorage.setItem(STORAGE_KEY, pin)
        setUnlocked(true)
      } else {
        setError(true)
        setDigits(Array(PIN_LENGTH).fill(''))
        inputs.current[0]?.focus()
      }
    } finally {
      setChecking(false)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="rib-heading text-3xl mb-2">ADMIN ACCESS</h1>
      <p className="rib-body text-sm mb-6">Enter PIN to continue</p>
      <div className="flex gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={checking}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`rib-stat h-16 w-14 text-center text-3xl rounded-lg border-2 bg-rib-tile focus:outline-none ${
              error ? 'border-red-500' : 'border-rib-border focus:border-rib-acc'
            }`}
          />
        ))}
      </div>
      {error && <p className="rib-body text-red-400 text-sm mt-4">Incorrect PIN. Try again.</p>}
    </div>
  )
}
