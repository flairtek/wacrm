import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        success: 'border-status-success/30 bg-status-success/15 text-status-success',
        warning: 'border-status-warning/30 bg-status-warning/15 text-status-warning',
        info: 'border-status-info/30 bg-status-info/15 text-status-info',
        error: 'border-status-error/30 bg-status-error/15 text-status-error',
        ai: 'border-status-ai/30 bg-status-ai/15 text-status-ai shadow-sm shadow-status-ai/10',
        neutral: 'border-border bg-muted/50 text-muted-foreground',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.2',
        default: 'text-xs px-2.5 py-0.5',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
