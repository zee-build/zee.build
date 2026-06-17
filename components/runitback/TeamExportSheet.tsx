'use client'

import { useRef, useState } from 'react'
import { X, Download, Copy, Check, FileText } from 'lucide-react'
import type { PlayerStats } from '@/lib/runitback/types'

interface RotationSlot {
  start: number
  end: number
  playerId: string
}

interface TeamExportSheetProps {
  date: string
  formatLabel: string
  teamA: string[]
  teamB: string[]
  subIds: Set<string>
  gkIds: Set<string>
  rotationA: RotationSlot[] | null
  rotationB: RotationSlot[] | null
  statsById: Map<string, PlayerStats>
  onClose: () => void
}

function avgOvr(ids: string[], subIds: Set<string>, statsById: Map<string, PlayerStats>) {
  const starters = ids.filter((id) => !subIds.has(id))
  if (!starters.length) return 0
  return Math.round(starters.reduce((s, id) => s + (statsById.get(id)?.overall ?? 0), 0) / starters.length)
}

export default function TeamExportSheet({
  date,
  formatLabel,
  teamA,
  teamB,
  subIds,
  gkIds,
  rotationA,
  rotationB,
  statsById,
  onClose,
}: TeamExportSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const name = (id: string) => statsById.get(id)?.player.name ?? id
  const pos = (id: string) => statsById.get(id)?.player.position ?? ''

  const startersA = teamA.filter((id) => !subIds.has(id))
  const subsA = teamA.filter((id) => subIds.has(id))
  const startersB = teamB.filter((id) => !subIds.has(id))
  const subsB = teamB.filter((id) => subIds.has(id))

  const displayDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleDownload = async () => {
    if (!sheetRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opts: any = { background: '#07071a', scale: 2, useCORS: true, logging: false }
      const canvas = await html2canvas(sheetRef.current, opts)
      const link = document.createElement('a')
      link.download = `runitback-lineup-${date}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = async () => {
    const lines: string[] = [
      '⚽ RUN IT BACK',
      `📅 ${displayDate}  ·  ${formatLabel}`,
      '',
      `🔵 TEAM A  (OVR ${avgOvr(teamA, subIds, statsById)})`,
      ...startersA.map((id, i) => `  ${i + 1}. ${name(id)}${gkIds.has(id) ? ' [GK]' : ''}  ${pos(id)}`),
      ...(subsA.length ? [`  SUBS: ${subsA.map(name).join(', ')}`] : []),
      '',
      `🔴 TEAM B  (OVR ${avgOvr(teamB, subIds, statsById)})`,
      ...startersB.map((id, i) => `  ${i + 1}. ${name(id)}${gkIds.has(id) ? ' [GK]' : ''}  ${pos(id)}`),
      ...(subsB.length ? [`  SUBS: ${subsB.map(name).join(', ')}`] : []),
    ]

    if (rotationA || rotationB) {
      lines.push('', '🧤 GK ROTATION')
      if (rotationA) {
        lines.push('TEAM A:')
        rotationA.forEach((s) => lines.push(`  ${s.start}'–${s.end}' → ${name(s.playerId)}`))
      }
      if (rotationB) {
        lines.push('TEAM B:')
        rotationB.forEach((s) => lines.push(`  ${s.start}'–${s.end}' → ${name(s.playerId)}`))
      }
    }

    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSavePdf = async () => {
    if (!sheetRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opts: any = { background: '#07071a', scale: 2, useCORS: true, logging: false }
      const canvas = await html2canvas(sheetRef.current, opts)
      const imgData = canvas.toDataURL('image/png')
      const win = window.open('', '_blank')
      if (!win) { setDownloading(false); return }
      win.document.write(`<!DOCTYPE html><html><head>
        <title>RIB Lineup — ${date}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { background: #07071a; width: 100%; }
          img { width: 100%; height: auto; display: block; page-break-inside: avoid; }
          @media print {
            html, body { background: #07071a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head><body><img src="${imgData}" /><script>
        window.onload = function() { setTimeout(function(){ window.print(); }, 300); }
      </script></body></html>`)
      win.document.close()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl flex flex-col gap-3" style={{ maxHeight: '90vh' }}>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>
            EXPORT LINEUP
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleCopy}
              className="rib-heading text-xs px-3 py-2 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5 transition-colors"
              style={{ letterSpacing: '1.5px' }}
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              {copied ? 'COPIED' : 'COPY TEXT'}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rib-heading text-xs px-3 py-2 rounded-lg bg-rib-acc text-rib-bg flex items-center gap-1.5 disabled:opacity-60"
              style={{ letterSpacing: '1.5px' }}
            >
              <Download size={13} />
              {downloading ? 'SAVING...' : 'SAVE IMAGE'}
            </button>
            <button
              onClick={handleSavePdf}
              disabled={downloading}
              className="rib-heading text-xs px-3 py-2 rounded-lg border border-rib-border text-rib-muted hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-60"
              style={{ letterSpacing: '1.5px' }}
            >
              <FileText size={13} />
              SAVE PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-rib-border text-rib-muted hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Export card — this is what gets captured */}
        <div
          ref={sheetRef}
          className="overflow-y-auto rounded-2xl flex-1 min-h-0"
          style={{
            background: 'linear-gradient(160deg, #07071a 0%, #0b0b24 60%, #07071a 100%)',
            border: '1px solid #1a1a42',
            fontFamily: "'Barlow Condensed', 'Open Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid #1a1a42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 28,
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, #00d4ff, #7b2fff)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: 4,
                      color: '#fff',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    RUN IT BACK
                  </p>
                  <p style={{ fontSize: 11, letterSpacing: 3, color: '#5a6a9a', marginTop: 3, textTransform: 'uppercase' }}>
                    Team Sheet
                  </p>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                {displayDate}
              </p>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: '#00d4ff',
                  marginTop: 3,
                  textTransform: 'uppercase',
                }}
              >
                {formatLabel}
              </p>
            </div>
          </div>

          {/* Teams */}
          <div className="rib-export-grid">
            {[
              { label: 'TEAM A', starters: startersA, subs: subsA, color: '#3b82f6', border: '#1e3a8a' },
              { label: 'TEAM B', starters: startersB, subs: subsB, color: '#ef4444', border: '#7f1d1d' },
            ].map(({ label, starters, subs, color, border }, ti) => (
              <div
                key={label}
                style={{
                  padding: '20px 24px',
                  borderRight: ti === 0 ? '1px solid #1a1a42' : undefined,
                  borderBottom: (rotationA || rotationB) ? '1px solid #1a1a42' : undefined,
                }}
              >
                {/* Team header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: 3,
                      color,
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: '#5a6a9a',
                      textTransform: 'uppercase',
                    }}
                  >
                    OVR {avgOvr(ti === 0 ? teamA : teamB, subIds, statsById)}
                  </span>
                </div>

                {/* Starters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {starters.map((id, i) => {
                    const isGk = gkIds.has(id)
                    return (
                      <div
                        key={id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#5a6a9a',
                            width: 18,
                            textAlign: 'right',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: 0.5,
                            flex: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {name(id)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {isGk && (
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: 1.5,
                                color: '#e8c547',
                                background: 'rgba(232,197,71,0.12)',
                                padding: '2px 5px',
                                borderRadius: 3,
                                textTransform: 'uppercase',
                              }}
                            >
                              GK
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: 1,
                              color: '#5a6a9a',
                              width: 30,
                              textAlign: 'right',
                              textTransform: 'uppercase',
                            }}
                          >
                            {pos(id)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Subs */}
                {subs.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #1a1a42' }}>
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: 2,
                        color: '#5a6a9a',
                        marginBottom: 7,
                        textTransform: 'uppercase',
                      }}
                    >
                      Substitutes
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {subs.map((id) => (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.65 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#5a6a9a', width: 18, textAlign: 'right', flexShrink: 0 }}>—</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5, flex: 1, textTransform: 'uppercase' }}>
                            {name(id)}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#5a6a9a', letterSpacing: 1, textTransform: 'uppercase' }}>
                            {pos(id)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* GK Rotation */}
          {(rotationA || rotationB) && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🧤</span>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: 3,
                    color: '#fff',
                    textTransform: 'uppercase',
                  }}
                >
                  GK Rotation
                </p>
              </div>
              <div className={rotationA && rotationB ? 'rib-export-gk-grid' : ''} style={rotationA && rotationB ? undefined : { display: 'grid', gap: 16 }}>
                {[
                  { label: 'TEAM A', schedule: rotationA, color: '#3b82f6' },
                  { label: 'TEAM B', schedule: rotationB, color: '#ef4444' },
                ].map(({ label, schedule, color }) =>
                  schedule ? (
                    <div
                      key={label}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid #1a1a42',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 14px',
                          borderBottom: '1px solid #1a1a42',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: 2.5,
                            color,
                            textTransform: 'uppercase',
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <div>
                        {schedule.map((slot, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 14px',
                              borderBottom: i < schedule.length - 1 ? '1px solid #1a1a42' : undefined,
                            }}
                          >
                            <span style={{ fontSize: 11, color: '#5a6a9a', fontWeight: 700, letterSpacing: 0.5 }}>
                              {slot.start}&apos;–{slot.end}&apos;
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                              {name(slot.playerId)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              padding: '12px 28px',
              borderTop: '1px solid #1a1a42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p style={{ fontSize: 10, letterSpacing: 2, color: '#2a3a6a', textTransform: 'uppercase', fontWeight: 700 }}>
              zeebuild.com/runitback
            </p>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: i === 1 ? '#00d4ff' : '#1a1a42',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
