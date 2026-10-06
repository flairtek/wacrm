import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbsProps {
  pathname: string;
  title: string;
  className?: string;
}

export function Breadcrumbs({ pathname, title, className }: BreadcrumbsProps) {
  const isDashboard = pathname === '/dashboard';

  return (
    <nav aria-label="Breadcrumbs" className={cn('hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </Link>
      {!isDashboard && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-medium text-foreground">{title}</span>
        </>
      )}
    </nav>
  );
}
