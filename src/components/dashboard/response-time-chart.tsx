"use client"

import { Clock } from 'lucide-react'
import { DOW_SHORT_MON_FIRST } from '@/lib/dashboard/date-utils'
import type { ResponseTimeSummary } from '@/lib/dashboard/types'
import { BarChart } from '@/components/tremor/bar-chart'
import { EmptyState } from './empty-state'
import { Skeleton } from './skeleton'
import { useTranslations } from 'next-intl'

interface ResponseTimeChartProps {
  data: ResponseTimeSummary | null
  loading: boolean
  /** Minutes. Surfaced as a "target" pill in the header. */
  thresholdMinutes?: number
}

const CATEGORY = 'Avg minutes'

export function ResponseTimeChart({
  data,
  loading,
  thresholdMinutes = 5,
}: ResponseTimeChartProps) {
  const t = useTranslations('Dashboard.responseTimeChart')
  const hasData = data?.buckets.some((b) => b.avgMinutes != null) ?? false

  const chartData =
    data?.buckets.map((b, i) => ({
      day: DOW_SHORT_MON_FIRST[i],
      [CATEGORY]: b.avgMinutes ?? 0,
      samples: b.samples,
    })) ?? []

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-xs">
      <header className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t('title')}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <div className="flex items-center gap-3 text-right text-xs">
          {thresholdMinutes > 0 && (
            <span className="rounded-full border border-status-warning/30 bg-status-warning/15 px-2.5 py-0.5 text-xs font-semibold text-status-warning tabular-nums">
              {t('target', { minutes: thresholdMinutes })}
            </span>
          )}
          {data && (data.thisWeekAvg != null || data.lastWeekAvg != null) && (
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                {t('thisWeek')}{' '}
                <span className="font-semibold text-foreground tabular-nums">
                  {fmt(data.thisWeekAvg)}
                </span>
              </div>
              <div className="text-muted-foreground">
                {t('lastWeek')}{' '}
                <span className="tabular-nums font-medium">{fmt(data.lastWeekAvg)}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="p-5">
        {loading || !data ? (
          <Skeleton className="h-[260px] w-full rounded-xl" />
        ) : !hasData ? (
          <EmptyState
            icon={Clock}
            title={t('noReplies')}
            hint={t('noRepliesHint')}
          />
        ) : (
          <BarChart
            data={chartData}
            index="day"
            categories={[CATEGORY]}
            colors={['violet']}
            valueFormatter={(value) => `${value.toFixed(1)}m`}
            showLegend={false}
            yAxisWidth={48}
            className="h-[260px]"
          />
        )}
      </div>
    </section>
  )
}

function fmt(mins: number | null): string {
  if (mins == null) return '—'
  if (mins < 1) return `${Math.max(1, Math.round(mins * 60))}s`
  if (mins < 60) return `${mins.toFixed(1)}m`
  return `${(mins / 60).toFixed(1)}h`
}
