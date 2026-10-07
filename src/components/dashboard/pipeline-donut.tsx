"use client"

import { GitBranch } from 'lucide-react'
import type { PipelineDonutData } from '@/lib/dashboard/types'
import { formatCurrencyShort } from '@/lib/currency'
import { EmptyState } from './empty-state'
import { Skeleton } from './skeleton'
import { useTranslations } from 'next-intl'

interface PipelineDonutProps {
  data: PipelineDonutData | null
  loading: boolean
  /** Account default currency for the totals. */
  currency: string
}

export function PipelineDonut({ data, loading, currency }: PipelineDonutProps) {
  const t = useTranslations('Dashboard.pipelineDonut')
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-xs">
      <header className="border-b border-border/70 px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{t('title')}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t('description')}
        </p>
      </header>

      <div className="flex flex-1 flex-col p-5">
        {loading || !data ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : data.stages.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title={t('noOpenDeals')}
            hint={t('noOpenDealsHint')}
          />
        ) : (
          <>
            <Donut data={data} currency={currency} />
            <ul className="mt-5 space-y-1.5">
              {data.stages.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-muted/40"
                >
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-2xs"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate font-medium text-foreground">{s.name}</span>
                  <span className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                    {t('dealCount', { count: s.dealCount })}
                  </span>
                  <span className="w-20 text-right font-semibold text-foreground tabular-nums">
                    {formatCurrencyShort(s.totalValue, currency)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

// ------------------------------------------------------------
// SVG ring. 200×200 viewBox, 18px ring width. We draw one <path>
// per stage using an SVG arc from startAngle → endAngle.
// ------------------------------------------------------------
function Donut({ data, currency }: { data: PipelineDonutData; currency: string }) {
  const t = useTranslations('Dashboard.pipelineDonut')
  const size = 200
  const r = 80
  const ringWidth = 18
  const cx = size / 2
  const cy = size / 2

  const totalRaw = data.totalValue || 1
  const minFrac = 0.02
  const rawShares = data.stages.map((s) => s.totalValue / totalRaw)
  const floored = rawShares.map((x) => Math.max(x, minFrac))
  const floorSum = floored.reduce((a, b) => a + b, 0)
  const shares = floored.map((x) => x / floorSum)

  const offsets: number[] = [0]
  for (let i = 0; i < shares.length; i++) offsets.push(offsets[i] + shares[i])
  const segments = data.stages.map((s, i) => {
    const start = offsets[i] * Math.PI * 2 - Math.PI / 2
    const end = offsets[i + 1] * Math.PI * 2 - Math.PI / 2
    return { path: arcPath(cx, cy, r, start, end), color: s.color, id: s.id }
  })

  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-48 w-48" role="img" aria-label={t('ariaLabel')}>
        {/* background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--muted)" strokeWidth={ringWidth} />
        {segments.map((seg) => (
          <path
            key={seg.id}
            d={seg.path}
            fill="none"
            stroke={seg.color}
            strokeWidth={ringWidth}
            strokeLinecap="butt"
          />
        ))}
        {/* center label */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-semibold uppercase tracking-wider"
        >
          {t('total')}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          className="fill-foreground text-[19px] font-bold tracking-tight tabular-nums"
        >
          {formatCurrencyShort(data.totalValue, currency)}
        </text>
      </svg>
    </div>
  )
}

function arcPath(cx: number, cy: number, r: number, startRad: number, endRad: number): string {
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = endRad - startRad > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}
