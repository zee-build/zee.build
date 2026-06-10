'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/runitback/queries'

interface PhotoUploadProps {
  name: string
  value: string | null
  onChange: (url: string | null) => void
}

export default function PhotoUpload({ name, value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/runitback/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Upload failed.')
        return
      }

      onChange(data.url)
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative flex items-center justify-center h-16 w-16 rounded-full bg-rib-acc2 text-white rib-heading text-lg overflow-hidden shrink-0 disabled:opacity-60"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={name} className="h-full w-full object-cover" />
        ) : (
          getInitials(name || '?')
        )}
        <span className="absolute bottom-0 right-0 flex items-center justify-center h-6 w-6 rounded-full bg-rib-bg border border-rib-border">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
        </span>
      </button>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rib-heading text-xs text-rib-acc"
          style={{ letterSpacing: '1.5px' }}
        >
          {value ? 'CHANGE PHOTO' : 'UPLOAD PHOTO'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rib-heading text-xs text-rib-muted ml-3"
            style={{ letterSpacing: '1.5px' }}
          >
            REMOVE
          </button>
        )}
        <p className="rib-body text-[11px] mt-0.5">JPEG, PNG, WEBP or GIF. Max 5MB.</p>
        {error && <p className="rib-body text-[11px] text-red-400">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
