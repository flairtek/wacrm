# Master UI/UX Redesign Phase 1 & 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate WARCM's design foundation with modern enterprise SaaS design tokens, status badge primitives, and a grouped collapsible sidebar with modern top navigation bar (`Ctrl+K` command launcher, breadcrumb pathing, and quick actions).

**Architecture:** 
1. Upgrade `src/app/globals.css` with semantic surface levels (`card-2`, `surface-elevated`), status badge tokens (success, warning, info, error, ai), and refined typography/radius scales.
2. Build reusable UI primitives: `StatusBadge`, `KpiStatCard`, `EmptyState`, and `SkeletonLoader`.
3. Restructure navigation into logical functional domains (`Sales`, `Marketing`, `Automation`, `AI`, `System`) in `src/components/layout/sidebar-groups.ts`.
4. Refactor `src/components/layout/sidebar.tsx` with collapsible domain sections, active state indicator pill, badge counters, and role chips.
5. Enhance `src/components/layout/header.tsx` with breadcrumbs, command palette search placeholder button (`Ctrl+K`), quick action dropdown menu, and i18n localization parity.

**Tech Stack:** Next.js 16.3.5 (Turbopack), Tailwind CSS v4 (`@theme inline`), Lucide React v1.30, Base UI / Radix primitives, Vitest 4.1.11, next-intl.

**Spec:** Modern SaaS CRM Design System & Grouped Application Shell Architecture

## Global Constraints
- Preserve 100% of existing authentication flows (`useAuth`), real-time unread badges (`useTotalUnread`, `useUnreadNotifications`), and presence listeners (`PresenceHeartbeat`).
- Maintain strict i18n parity across all message files (`messages/en.json`, `messages/es.json`, `messages/pt.json`, `messages/ko.json`) passing `src/i18n/messages.test.ts`.
- Zero database or API breaking changes. All modifications remain strictly within the UI presentation layer.

---

### Task 1: Design Tokens and Semantic Status System in Globals CSS

**Files:**
- Modify: `src/app/globals.css`
- Test: `src/lib/design/tokens.test.ts`

**Interfaces:**
- Consumes: Tailwind v4 theme engine variables
- Produces: CSS color variables for `--status-success`, `--status-warning`, `--status-info`, `--status-error`, `--status-ai`, `--surface-elevated` across dark and light modes.

- [ ] **Step 1: Write the failing test for theme tokens**

Create `src/lib/design/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Design Tokens Contract', () => {
  const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

  it('defines semantic status tokens in @theme inline', () => {
    expect(css).toContain('--color-status-success:');
    expect(css).toContain('--color-status-warning:');
    expect(css).toContain('--color-status-info:');
    expect(css).toContain('--color-status-error:');
    expect(css).toContain('--color-status-ai:');
    expect(css).toContain('--color-surface-elevated:');
  });

  it('declares light and dark mode variable assignments for all status tokens', () => {
    expect(css).toContain('--status-success:');
    expect(css).toContain('--status-warning:');
    expect(css).toContain('--status-info:');
    expect(css).toContain('--status-error:');
    expect(css).toContain('--status-ai:');
    expect(css).toContain('--surface-elevated:');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/design/tokens.test.ts`
Expected: FAIL due to missing token definitions in `globals.css`.

- [ ] **Step 3: Update `src/app/globals.css` with semantic tokens**

Add the `@theme inline` mappings and the corresponding mode definitions in `src/app/globals.css`:
```css
  --color-status-success: var(--status-success);
  --color-status-warning: var(--status-warning);
  --color-status-info: var(--status-info);
  --color-status-error: var(--status-error);
  --color-status-ai: var(--status-ai);
  --color-surface-elevated: var(--surface-elevated);
```
And inside `html[data-mode="dark"]` and `html[data-mode="light"]`:
```css
  /* Status & Elevated Tokens */
  --status-success: oklch(0.68 0.18 145);
  --status-warning: oklch(0.75 0.16 75);
  --status-info: oklch(0.65 0.18 240);
  --status-error: oklch(0.60 0.22 25);
  --status-ai: oklch(0.70 0.22 300);
  --surface-elevated: oklch(0.21 0.01 260);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/design/tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/lib/design/tokens.test.ts
git commit -m "feat(design): add semantic status tokens and elevated surfaces to globals.css"
```

---

### Task 2: Reusable UI Primitives (StatusBadge, EmptyState, KpiStatCard)

**Files:**
- Create: `src/components/ui/status-badge.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/kpi-stat-card.tsx`
- Test: `src/components/ui/ui-primitives.test.tsx`

**Interfaces:**
- Consumes: Lucide icons, Tailwind utility classes, `class-variance-authority`
- Produces: 
  - `StatusBadge`: semantic badge with dot pulse indicator (success, warning, info, error, ai, neutral)
  - `EmptyState`: standardized empty state with title, description, icon, and optional primary CTA
  - `KpiStatCard`: executive KPI widget with sparkline/trend indicator and delta pill

- [ ] **Step 1: Write the failing unit tests for UI primitives**

Create `src/components/ui/ui-primitives.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusBadge } from './status-badge';
import { EmptyState } from './empty-state';
import { KpiStatCard } from './kpi-stat-card';
import { MessageSquare, TrendingUp } from 'lucide-react';

describe('UI Primitives Contract', () => {
  it('renders StatusBadge with semantic variants and pulse dot', () => {
    const markup = renderToStaticMarkup(
      <StatusBadge variant="success" dot>Active</StatusBadge>
    );
    expect(markup).toContain('Active');
    expect(markup).toContain('bg-status-success/15');
  });

  it('renders EmptyState with icon and action button', () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        icon={MessageSquare}
        title="No messages"
        description="No conversations found in your inbox."
      />
    );
    expect(markup).toContain('No messages');
    expect(markup).toContain('No conversations found in your inbox.');
  });

  it('renders KpiStatCard with value and delta trend', () => {
    const markup = renderToStaticMarkup(
      <KpiStatCard
        title="Total Inbound"
        value="1,248"
        delta="+14.2%"
        trend="up"
        icon={TrendingUp}
      />
    );
    expect(markup).toContain('Total Inbound');
    expect(markup).toContain('1,248');
    expect(markup).toContain('+14.2%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/ui-primitives.test.tsx`
Expected: FAIL due to missing components.

- [ ] **Step 3: Implement `StatusBadge`, `EmptyState`, and `KpiStatCard`**

Create `src/components/ui/status-badge.tsx`:
```tsx
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
      }
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

export function StatusBadge({ className, variant, size, dot, children, ...props }: StatusBadgeProps) {
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
```

Create `src/components/ui/empty-state.tsx`:
```tsx
import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center animate-in fade-in-50', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
```

Create `src/components/ui/kpi-stat-card.tsx`:
```tsx
import * as React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface KpiStatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function KpiStatCard({ title, value, delta, trend, description, icon: Icon, className }: KpiStatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden transition-all hover:shadow-md hover:border-primary/20', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
                trend === 'up' && 'bg-status-success/15 text-status-success',
                trend === 'down' && 'bg-status-error/15 text-status-error',
                trend === 'neutral' && 'bg-muted text-muted-foreground'
              )}
            >
              {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {delta}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/ui-primitives.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/status-badge.tsx src/components/ui/empty-state.tsx src/components/ui/kpi-stat-card.tsx src/components/ui/ui-primitives.test.tsx
git commit -m "feat(ui): add reusable StatusBadge, EmptyState, and KpiStatCard primitives"
```

---

### Task 3: Navigation Grouping & Modern Collapsible Sidebar

**Files:**
- Create: `src/components/layout/sidebar-groups.ts`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `messages/en.json`, `messages/es.json`, `messages/pt.json`, `messages/ko.json`
- Test: `src/components/layout/sidebar-groups.test.ts`
- Test: `src/i18n/messages.test.ts`

**Interfaces:**
- Consumes: `usePathname`, `useAuth`, `useTotalUnread`, `useUnreadNotifications`, `useTranslations`
- Produces: Structured domain navigation groups (`workspace`, `sales`, `marketing`, `automation`, `ai`, `settings`)

- [ ] **Step 1: Write failing unit test for sidebar navigation groups**

Create `src/components/layout/sidebar-groups.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { SIDEBAR_NAV_GROUPS, isRouteActive } from './sidebar-groups';

describe('Sidebar Navigation Grouping', () => {
  it('defines 6 primary functional domain groups', () => {
    const groupKeys = SIDEBAR_NAV_GROUPS.map((g) => g.groupKey);
    expect(groupKeys).toEqual(['workspace', 'sales', 'marketing', 'automation', 'ai', 'settings']);
  });

  it('matches active routes correctly', () => {
    expect(isRouteActive('/dashboard', '/dashboard')).toBe(true);
    expect(isRouteActive('/inbox', '/inbox?c=123')).toBe(true);
    expect(isRouteActive('/contacts', '/settings')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/sidebar-groups.test.ts`
Expected: FAIL due to missing `sidebar-groups.ts`.

- [ ] **Step 3: Create `src/components/layout/sidebar-groups.ts` and add translation keys**

Create `src/components/layout/sidebar-groups.ts`:
```ts
import {
  Bell,
  Bot,
  GitBranch,
  LayoutDashboard,
  MessageSquare,
  Radio,
  Settings,
  Users,
  Workflow,
  Zap,
  LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  beta?: boolean;
}

export interface NavGroupConfig {
  groupKey: string;
  items: NavItemConfig[];
}

export const SIDEBAR_NAV_GROUPS: NavGroupConfig[] = [
  {
    groupKey: 'workspace',
    items: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/inbox', labelKey: 'inbox', icon: MessageSquare },
      { href: '/notifications', labelKey: 'notifications', icon: Bell },
    ],
  },
  {
    groupKey: 'sales',
    items: [
      { href: '/contacts', labelKey: 'contacts', icon: Users },
      { href: '/pipelines', labelKey: 'pipelines', icon: GitBranch },
    ],
  },
  {
    groupKey: 'marketing',
    items: [
      { href: '/broadcasts', labelKey: 'broadcasts', icon: Radio },
    ],
  },
  {
    groupKey: 'automation',
    items: [
      { href: '/automations', labelKey: 'automations', icon: Zap },
      { href: '/flows', labelKey: 'flows', icon: Workflow, beta: true },
    ],
  },
  {
    groupKey: 'ai',
    items: [
      { href: '/agents', labelKey: 'aiAgents', icon: Bot },
    ],
  },
  {
    groupKey: 'settings',
    items: [
      { href: '/settings', labelKey: 'settings', icon: Settings },
    ],
  },
];

export function isRouteActive(itemHref: string, currentPathname: string): boolean {
  if (itemHref === '/dashboard') {
    return currentPathname === '/dashboard';
  }
  return currentPathname.startsWith(itemHref);
}
```

Update `messages/en.json`, `messages/es.json`, `messages/pt.json`, `messages/ko.json` with the group label keys under `"Sidebar"` (`"groupWorkspace"`, `"groupSales"`, `"groupMarketing"`, `"groupAutomation"`, `"groupAi"`, `"groupSettings"`).

- [ ] **Step 4: Refactor `src/components/layout/sidebar.tsx` to render grouped navigation**

Update `src/components/layout/sidebar.tsx` to iterate over `SIDEBAR_NAV_GROUPS`, rendering subtle domain headers, polished active pill states (`bg-primary-soft text-primary font-semibold`), badge counters, and account footer.

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run src/components/layout/sidebar-groups.test.ts src/i18n/messages.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/sidebar-groups.ts src/components/layout/sidebar.tsx src/components/layout/sidebar-groups.test.ts messages/*.json
git commit -m "feat(navigation): modernize sidebar with domain grouping and refined active states"
```

---

### Task 4: Modern Header with Breadcrumbs, Command Palette Trigger, and Quick Actions

**Files:**
- Create: `src/components/layout/breadcrumbs.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `messages/en.json`, `messages/es.json`, `messages/pt.json`, `messages/ko.json`
- Test: `src/components/layout/breadcrumbs.test.tsx`
- Test: `src/i18n/messages.test.ts`

**Interfaces:**
- Consumes: `usePathname`, `useTranslations`, `useAuth`
- Produces: Contextual page breadcrumbs, `Ctrl+K` global search placeholder bar, Quick Action menu.

- [ ] **Step 1: Write failing unit test for Breadcrumbs component**

Create `src/components/layout/breadcrumbs.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs Component', () => {
  it('renders section and active page link from pathname', () => {
    const markup = renderToStaticMarkup(
      <Breadcrumbs pathname="/settings" title="Settings" />
    );
    expect(markup).toContain('Settings');
    expect(markup).toContain('Dashboard');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/breadcrumbs.test.tsx`
Expected: FAIL due to missing `breadcrumbs.tsx`.

- [ ] **Step 3: Implement `Breadcrumbs` and integrate into `Header`**

Create `src/components/layout/breadcrumbs.tsx`:
```tsx
import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs({ pathname, title }: { pathname: string; title: string }) {
  const isDashboard = pathname === '/dashboard';

  return (
    <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
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
```

Update `src/components/layout/header.tsx` with:
1. Breadcrumb navigation.
2. Fast command palette search button (`Ctrl+K` / `⌘K`).
3. ModeToggle and User Profile menu.

- [ ] **Step 4: Run test suite & i18n parity check**

Run: `npx vitest run src/components/layout/breadcrumbs.test.tsx src/i18n/messages.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/breadcrumbs.tsx src/components/layout/breadcrumbs.test.tsx src/components/layout/header.tsx messages/*.json
git commit -m "feat(header): add breadcrumbs navigation and command search launcher"
```

---

### Task 5: Full Suite Verification & Typecheck

**Files:**
- Test: All 89 test suites + TypeScript compiler

- [ ] **Step 1: Run complete unit test suite**

Run: `npm run test`
Expected: All 89 test files PASS (1040+ tests).

- [ ] **Step 2: Run TypeScript strict check**

Run: `npm run typecheck`
Expected: 0 errors.

- [ ] **Step 3: Final verification commit**

```bash
git commit --allow-empty -m "chore: complete Phase 1 & 2 UI redesign verification"
```
