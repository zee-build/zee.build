import type { MatchResult } from '@/lib/runitback/types'

const COLORS: Record<MatchResult, string> = {
  W: 'bg-green-500/80 text-green-950',
  L: 'bg-red-500/80 text-red-950',
  D: 'bg-yellow-500/80 text-yellow-950',
}

export default function FormBadges({ form }: { form: MatchResult[] }) {
  if (form.length === 0) {
    return <p className="rib-body text-xs">No matches yet</p>
  }

  return (
    <div className="flex gap-1.5">
      {form.map((result, i) => (
        <span
          key={i}
          className={`rib-heading flex h-6 w-6 items-center justify-center rounded text-[11px] ${COLORS[result]}`}
        >
          {result}
        </span>
      ))}
    </div>
  )
}
