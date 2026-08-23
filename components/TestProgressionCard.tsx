'use client'

import type { TestProgression } from '@/lib/analytics'

const STATUS_COLOR: Record<string, string> = {
  normal: '#37ec13',
  low: '#f59e0b',
  high: '#f59e0b',
  critical: '#ef4444',
}

export default function TestProgressionCard({ progression }: { progression: TestProgression }) {
  const { testName, unit, points, trend, latestStatus, referenceRange } = progression
  const latest = points[points.length - 1]
  const color = STATUS_COLOR[latestStatus || 'normal'] || '#37ec13'

  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 200
  const height = 56
  const stepX = points.length > 1 ? width / (points.length - 1) : 0

  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = height - ((p.value - min) / range) * (height - 10) - 5
    return { x, y }
  })
  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')

  const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat'
  const trendColor = trend === 'flat' ? 'text-slate-400' : latestStatus === 'normal' ? 'text-primary' : 'text-amber-600'

  return (
    <div className="border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-bold text-background-dark text-sm">{testName}</p>
        <span className={`material-symbols-outlined text-xl ${trendColor}`}>{trendIcon}</span>
      </div>
      {referenceRange && <p className="text-xs text-slate-400 mb-3">Reference: {referenceRange}</p>}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-14 mb-3" preserveAspectRatio="none">
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 3.5 : 2} fill={color} />
        ))}
      </svg>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-background-dark">{latest.value}</span>
        <span className="text-sm text-slate-500">{unit}</span>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          {latestStatus || 'normal'}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        {points.length} readings • first {points[0].value}{unit} → latest {latest.value}{unit}
      </p>
    </div>
  )
}
