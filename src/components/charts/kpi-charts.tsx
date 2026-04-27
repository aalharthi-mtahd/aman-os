'use client'
// src/components/charts/kpi-charts.tsx
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { WeeklyKPI } from '@/types'

interface TransactionChartProps {
  data: WeeklyKPI[]
  height?: number
}

export function TransactionChart({ data, height = 220 }: TransactionChartProps) {
  const chartData = data.map((w) => ({
    label: `W${w.weekId.split('-')[1]}`,
    transactions: w.transactions,
    gmv: Math.round(w.gmv / 1000),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v) => v.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="transactions"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#10B981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function CompletionRateChart({ data, height = 220 }: TransactionChartProps) {
  const chartData = data.map((w) => ({
    label: `W${w.weekId.split('-')[1]}`,
    rate: w.completionRate,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[62, 78]}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="rounded-lg border border-brand-border bg-brand-card2 p-2 text-xs">
                <div className="font-bold text-white">{payload[0]?.value?.toFixed(1)}%</div>
              </div>
            )
          }}
        />
        <ReferenceLine
          y={70}
          stroke="#F59E0B"
          strokeDasharray="5 5"
          strokeOpacity={0.6}
          label={{ value: '70% target', fill: '#F59E0B', fontSize: 10 }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#EF4444"
          strokeWidth={2.5}
          dot={{ fill: '#EF4444', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#EF4444' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface ForecastChartProps {
  labels: string[]
  actual: (number | null)[]
  best: (number | null)[]
  expected: (number | null)[]
  worst: (number | null)[]
  height?: number
}

export function ForecastChart({
  labels,
  actual,
  best,
  expected,
  worst,
  height = 250,
}: ForecastChartProps) {
  const chartData = labels.map((label, i) => ({
    label,
    actual: actual[i],
    best: best[i],
    expected: expected[i],
    worst: worst[i],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
          tickFormatter={(v) => v?.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="best"
          stroke="#22C55E"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="expected"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 3, strokeWidth: 0 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="worst"
          stroke="#EF4444"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface GAChartProps {
  data: { date: string; sessions: number; transactions: number }[]
  height?: number
}

export function GACorrelationChart({ data, height = 200 }: GAChartProps) {
  const chartData = data.map((d) => ({
    label: new Date(d.date).toLocaleDateString('en-SA', { weekday: 'short' }),
    sessions: Math.round(d.sessions / 1000),
    transactions: Math.round(d.transactions / 100),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="rounded-lg border border-brand-border bg-brand-card2 p-2.5 text-xs">
                <div className="mb-1 font-bold text-white">{label}</div>
                {payload.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-slate-400">{p.name}:</span>
                    <span className="font-semibold text-white">{p.value}</span>
                  </div>
                ))}
              </div>
            )
          }}
        />
        <Bar dataKey="sessions" fill="#3B82F6" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
        <Bar dataKey="transactions" fill="#10B981" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-border bg-brand-card2 p-2.5 text-xs shadow-lg">
      <div className="mb-1 font-bold text-slate-300">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-mono font-semibold text-white">
            {p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}
