"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import type { ConversationsSeriesPoint } from '@/lib/dashboard/types'
import { EmptyState } from './empty-state'
import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type RangeDays = 7 | 30 | 90

interface ConversationsChartProps {
  /** Per-range data, so switching tabs never re-fetches. */
  series: Record<RangeDays, ConversationsSeriesPoint[] | null>
  loading: boolean
  range: RangeDays
  onRangeChange: (r: RangeDays) => void
}

// ------------------------------------------------------------
// Layout constants. The SVG renders into a fixed viewBox and scales
// via CSS (preserveAspectRatio default).
// ------------------------------------------------------------
const VB_W = 760
const VB_H = 240
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 }

export function ConversationsChart({ series, loading, range, onRangeChange }: ConversationsChartProps) {
  const t = useTranslations('Dashboard.conversationsChart')
  const data = series[range]

  // Memoise the max so per-day hover math doesn't recompute it.
  const { maxY, niceTicks } = useMemo(() => {
    const arr = data ?? []
    const max = arr.reduce(
      (m, p) => Math.max(m, p.incoming, p.outgoing),
      0,
    )
    const ceil = niceCeil(max)
    const ticks = [0, ceil / 4, ceil / 2, (3 * ceil) / 4, ceil].map((v) =>
      Math.round(v),
    )
    return { maxY: ceil, niceTicks: Array.from(new Set(ticks)) }
  }, [data])

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-xs">
      <header className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{t('title')}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted/70 p-1">
          {[7, 30, 90].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange(r as RangeDays)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                range === r
                  ? 'bg-background text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t('days', { count: r })}
            </button>
          ))}
        </div>
      </header>

      <div className="p-5">
        {loading || !data ? (
          <Skeleton className="h-[240px] w-full rounded-xl" />
        ) : data.every((p) => p.incoming === 0 && p.outgoing === 0) ? (
          <EmptyState
            icon={MessageSquare}
            title={t('noActivity')}
            hint={t('noActivityHint')}
          />
        ) : (
          <LineSvg data={data} maxY={maxY} ticks={niceTicks} t={t} />
        )}
      </div>

      <footer className="flex items-center gap-4 border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
        <LegendDot color="#3b82f6" label={t('incoming')} />
        <LegendDot color="var(--primary, #7c3aed)" label={t('outgoing')} />
      </footer>
    </section>
  )
}

// ------------------------------------------------------------
// The actual SVG. Two polylines + area gradient fills + hover target
// ------------------------------------------------------------

function LineSvg({
  data,
  maxY,
  ticks,
  t,
}: {
  data: ConversationsSeriesPoint[]
  maxY: number
  ticks: number[]
  t: ReturnType<typeof useTranslations>
}) {
  const [hover, setHover] = useState<{ idx: number; tooltipLeftPx: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const chartW = VB_W - PADDING.left - PADDING.right
  const chartH = VB_H - PADDING.top - PADDING.bottom
  const bottomY = PADDING.top + chartH

  const stepX = data.length > 1 ? chartW / (data.length - 1) : 0
  const yFor = (v: number) =>
    maxY === 0 ? bottomY : PADDING.top + chartH - (v / maxY) * chartH
  const xFor = (i: number) => PADDING.left + i * stepX

  const incomingLine = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.incoming)}`).join(' ')
  const outgoingLine = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.outgoing)}`).join(' ')

  const incomingArea = data.length > 0
    ? `${incomingLine} L${xFor(data.length - 1)},${bottomY} L${xFor(0)},${bottomY} Z`
    : ''
  const outgoingArea = data.length > 0
    ? `${outgoingLine} L${xFor(data.length - 1)},${bottomY} L${xFor(0)},${bottomY} Z`
    : ''

  useEffect(() => {
    const svg = svgRef.current
    const wrap = wrapRef.current
    if (!svg || !wrap) return
    const onMove = (e: MouseEvent) => {
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const local = pt.matrixTransform(ctm.inverse())
      const xVb = local.x
      if (xVb < PADDING.left - 8 || xVb > VB_W - PADDING.right + 8) {
        setHover(null)
        return
      }
      const relative = xVb - PADDING.left
      const idx = Math.max(
        0,
        Math.min(data.length - 1, Math.round(stepX === 0 ? 0 : relative / stepX)),
      )
      const dataPointVbX = PADDING.left + idx * stepX
      const dataPointPt = svg.createSVGPoint()
      dataPointPt.x = dataPointVbX
      dataPointPt.y = 0
      const screen = dataPointPt.matrixTransform(ctm)
      const wrapRect = wrap.getBoundingClientRect()
      setHover({ idx, tooltipLeftPx: screen.x - wrapRect.left })
    }
    const onLeave = () => setHover(null)
    svg.addEventListener('mousemove', onMove)
    svg.addEventListener('mouseleave', onLeave)
    return () => {
      svg.removeEventListener('mousemove', onMove)
      svg.removeEventListener('mouseleave', onLeave)
    }
  }, [data, stepX])

  const hovered = hover !== null ? data[hover.idx] : null
  const hoverX = hover !== null ? xFor(hover.idx) : 0
  const labelStride = Math.max(1, Math.ceil(data.length / 6))

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-[240px] w-full"
        role="img"
        aria-label={t('ariaLabel')}
      >
        <defs>
          <linearGradient id="incoming-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="outgoing-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines + labels */}
        {ticks.map((t) => {
          const y = yFor(t)
          return (
            <g key={t}>
              <line
                x1={PADDING.left}
                x2={VB_W - PADDING.right}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text
                x={PADDING.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {t}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((p, i) =>
          i % labelStride === 0 ? (
            <text
              key={p.day}
              x={xFor(i)}
              y={VB_H - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {shortDayLabel(p.day)}
            </text>
          ) : null,
        )}

        {/* Area fills */}
        <path d={incomingArea} fill="url(#incoming-gradient)" />
        <path d={outgoingArea} fill="url(#outgoing-gradient)" />

        {/* Outgoing polyline (violet) */}
        <path
          d={outgoingLine}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Incoming polyline (blue) */}
        <path
          d={incomingLine}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover crosshair */}
        {hover !== null && (
          <g pointerEvents="none">
            <line
              x1={hoverX}
              x2={hoverX}
              y1={PADDING.top}
              y2={bottomY}
              stroke="var(--muted-foreground)"
              strokeDasharray="3 3"
              opacity="0.8"
            />
            <circle cx={hoverX} cy={yFor(data[hover.idx].incoming)} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={1.5} />
            <circle cx={hoverX} cy={yFor(data[hover.idx].outgoing)} r={4} fill="#7c3aed" stroke="#fff" strokeWidth={1.5} />
          </g>
        )}
      </svg>

      {/* Popover tooltip */}
      {hovered && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
          style={{ left: `${hover.tooltipLeftPx}px` }}
        >
          <div className="font-semibold text-popover-foreground">{longDayLabel(hovered.day)}</div>
          <div className="mt-1.5 flex flex-col gap-1">
            <span className="flex items-center gap-2 text-blue-500 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              {t('tooltipIncoming', { count: hovered.incoming })}
            </span>
            <span className="flex items-center gap-2 text-primary font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              {t('tooltipOutgoing', { count: hovered.outgoing })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-medium">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function shortDayLabel(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function longDayLabel(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function niceCeil(max: number): number {
  if (max <= 0) return 4
  const pow = Math.pow(10, Math.floor(Math.log10(max)))
  const normalised = max / pow
  let nice: number
  if (normalised <= 1) nice = 1
  else if (normalised <= 2) nice = 2
  else if (normalised <= 5) nice = 5
  else nice = 10
  return nice * pow
}
