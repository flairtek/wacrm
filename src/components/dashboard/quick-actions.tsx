"use client"

import Link from 'next/link'
import { UserPlus, Briefcase, Radio, Zap, ArrowUpRight } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslations } from 'next-intl'

interface Action {
  labelKey: string
  href: string
  icon: ComponentType<{ className?: string }>
  badgeBg: string
  badgeText: string
}

const ACTIONS: Action[] = [
  {
    labelKey: 'newContact',
    href: '/contacts',
    icon: UserPlus,
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    labelKey: 'newDeal',
    href: '/pipelines',
    icon: Briefcase,
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    labelKey: 'newBroadcast',
    href: '/broadcasts/new',
    icon: Radio,
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    labelKey: 'newAutomation',
    href: '/automations/new',
    icon: Zap,
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
  },
]

export function QuickActions() {
  const t = useTranslations('Dashboard.quickActions')

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map((a) => {
        const Icon = a.icon
        return (
          <Link
            key={a.href}
            href={a.href}
            className="group relative flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30 hover:shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.badgeBg} ${a.badgeText} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="truncate text-sm font-medium text-foreground">
                {t(a.labelKey as string)}
              </span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </Link>
        )
      })}
    </div>
  )
}
