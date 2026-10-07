import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  /** Pre-formatted value for display (e.g. "42" or "$1,250"). */
  value: string
  icon: ComponentType<{ className?: string }>
  /**
   * Delta-mode secondary row: arrow + delta text. Omit when the metric
   * doesn't have a sensible comparison (e.g. total pipeline value).
   */
  delta?: {
    /** Positive / negative / zero drives arrow + color. */
    sign: number
    /** Pre-formatted delta, e.g. "+3 vs yesterday". */
    label: string
  }
  /** Used instead of `delta` when the metric has a static subtitle. */
  subtitle?: string
}

export function MetricCard({ title, value, icon: Icon, delta, subtitle }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/90 p-5 shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
        {value}
      </p>
      {delta ? (
        <DeltaRow sign={delta.sign} label={delta.label} />
      ) : subtitle ? (
        <p className="mt-2 text-xs font-medium text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  )
}

function DeltaRow({ sign, label }: { sign: number; label: string }) {
  const isPositive = sign > 0
  const isNegative = sign < 0
  const Arrow = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus

  return (
    <div
      className={cn(
        'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border',
        isPositive && 'border-status-success/30 bg-status-success/15 text-status-success',
        isNegative && 'border-status-error/30 bg-status-error/15 text-status-error',
        !isPositive && !isNegative && 'border-border bg-muted/50 text-muted-foreground'
      )}
    >
      <Arrow className="h-3.5 w-3.5" aria-hidden />
      <span className="tabular-nums">{label}</span>
    </div>
  )
}
