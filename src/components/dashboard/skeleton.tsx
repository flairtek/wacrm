import { cn } from '@/lib/utils'

/**
 * Shared skeleton primitive — a pulsing block sized to whatever
 * container it's dropped into. Used by every dashboard widget while
 * its data fetches.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted/80', className)} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card/90 shadow-xs p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-8 w-24" />
      <Skeleton className="mt-2.5 h-4 w-20 rounded-full" />
    </div>
  )
}
