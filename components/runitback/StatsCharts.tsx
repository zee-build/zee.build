'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ChartPoint {
  label: string
  value: number
}

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--tile)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontFamily: 'var(--font-barlow)',
  color: '#fff',
}

export function GoalsOverTimeChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} />
        <YAxis stroke="var(--muted)" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="value" stroke="var(--acc)" strokeWidth={2} dot={{ fill: 'var(--acc)' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function GoalsPerPlayerChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" stroke="var(--muted)" fontSize={11} allowDecimals={false} />
        <YAxis type="category" dataKey="label" stroke="var(--muted)" fontSize={11} width={90} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="value" fill="var(--acc)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function WinRateChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" stroke="var(--muted)" fontSize={11} domain={[0, 100]} />
        <YAxis type="category" dataKey="label" stroke="var(--muted)" fontSize={11} width={90} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => `${value}%`} />
        <Bar dataKey="value" fill="var(--acc2)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
