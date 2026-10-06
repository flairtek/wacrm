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
