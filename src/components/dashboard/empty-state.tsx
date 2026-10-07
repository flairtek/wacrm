import { BarChart3 } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

/**
 * Shared empty-state panel for charts that can't render meaningfully
 * without a minimum amount of data.
 */
export function EmptyState({
  title,
  hint,
  icon: Icon = BarChart3,
  className,
}: {
  title?: string
  hint?: string
  icon?: ComponentType<{ className?: string }>
  className?: string
}) {
  const t = useTranslations('Dashboard.emptyState')
  const defaultTitle = t('title')

  return (
    <div
      className={cn(
        'flex h-full min-h-[180px] flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center',
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground ring-1 ring-border/60">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-foreground/90">{title || defaultTitle}</p>
      {hint && <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  )
}
