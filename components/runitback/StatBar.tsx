interface StatBarProps {
  label: string
  value: number
  max?: number
  suffix?: string
}

export default function StatBar({ label, value, max = 100, suffix = '%' }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '1.5px' }}>
          {label}
        </span>
        <span className="rib-stat text-sm">
          {Math.round(value * 10) / 10}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-rib-border overflow-hidden">
        <div
          className="h-full rounded-full bg-rib-acc transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
