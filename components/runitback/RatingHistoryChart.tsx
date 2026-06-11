'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DayOfWeek } from '@/lib/runitback/types'

export interface RatingHistoryPoint {
  matchId: string
  date: string
  dayOfWeek: DayOfWeek
  avg: number
}

const DAY_COLOR: Record<DayOfWeek, string> = {
  Friday: 'var(--acc)',
  Tuesday: 'var(--acc2)',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function CustomDot({ cx, cy, payload }: { cx?: number; cy?: number; payload?: RatingHistoryPoint }) {
  if (cx === undefined || cy === undefined || !payload) return null
  return <circle cx={cx} cy={cy} r={4} fill={DAY_COLOR[payload.dayOfWeek]} stroke="none" />
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: RatingHistoryPoint }[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rib-tile rounded-lg px-3 py-2 text-xs">
      <p className="rib-heading" style={{ letterSpacing: '1.5px', color: DAY_COLOR[point.dayOfWeek] }}>
        {point.dayOfWeek.toUpperCase()} · {formatDate(point.date)}
      </p>
      <p className="rib-stat text-sm mt-0.5">{point.avg.toFixed(1)} / 10</p>
    </div>
  )
}

export default function RatingHistoryChart({ data }: { data: RatingHistoryPoint[] }) {
  if (data.length === 0) return null

  return (
    <div className="rib-tile rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="rib-heading text-xs text-rib-muted" style={{ letterSpacing: '2px' }}>
          RATING HISTORY
        </h3>
        <div className="flex items-center gap-3 text-[10px] rib-heading text-rib-muted" style={{ letterSpacing: '1.5px' }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: DAY_COLOR.Friday }} />
            FRIDAY
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: DAY_COLOR.Tuesday }} />
            TUESDAY
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: 'var(--muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              domain={[1, 10]}
              ticks={[1, 5.5, 10]}
              tick={{ fill: 'var(--muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="var(--acc)"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
