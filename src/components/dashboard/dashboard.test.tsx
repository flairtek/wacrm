import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';
import { MetricCard } from './metric-card';
import { QuickActions } from './quick-actions';
import { PipelineDonut } from './pipeline-donut';
import { ResponseTimeChart } from './response-time-chart';
import { ActivityFeed } from './activity-feed';
import { SkeletonCard } from './skeleton';
import { MessageSquare, Users, DollarSign } from 'lucide-react';

function renderWithI18n(ui: React.ReactElement) {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('Dashboard Components Redesign', () => {
  describe('MetricCard', () => {
    it('renders title, value, and positive delta trend with status styling', () => {
      const markup = renderToStaticMarkup(
        <MetricCard
          title="Active Conversations"
          value="1,420"
          icon={MessageSquare}
          delta={{ sign: 12, label: '+12 new today' }}
        />
      );
      expect(markup).toContain('Active Conversations');
      expect(markup).toContain('1,420');
      expect(markup).toContain('+12 new today');
      expect(markup).toContain('text-status-success');
    });

    it('renders negative delta with error status styling', () => {
      const markup = renderToStaticMarkup(
        <MetricCard
          title="New Contacts"
          value="85"
          icon={Users}
          delta={{ sign: -5, label: '-5 vs yesterday' }}
        />
      );
      expect(markup).toContain('New Contacts');
      expect(markup).toContain('85');
      expect(markup).toContain('-5 vs yesterday');
      expect(markup).toContain('text-status-error');
    });

    it('renders subtitle when provided instead of delta', () => {
      const markup = renderToStaticMarkup(
        <MetricCard
          title="Open Deals Value"
          value="$45,200"
          icon={DollarSign}
          subtitle="14 open deals"
        />
      );
      expect(markup).toContain('Open Deals Value');
      expect(markup).toContain('$45,200');
      expect(markup).toContain('14 open deals');
    });
  });

  describe('QuickActions', () => {
    it('renders all quick action buttons with links and icons', () => {
      const markup = renderWithI18n(<QuickActions />);
      expect(markup).toContain('/contacts');
      expect(markup).toContain('/pipelines');
      expect(markup).toContain('/broadcasts/new');
      expect(markup).toContain('/automations/new');
      expect(markup).toContain('New Contact');
      expect(markup).toContain('New Deal');
    });
  });

  describe('PipelineDonut', () => {
    it('renders empty state when no open deals are present', () => {
      const markup = renderWithI18n(
        <PipelineDonut data={{ totalValue: 0, stages: [] }} loading={false} currency="USD" />
      );
      expect(markup).toContain('No open deals yet');
    });

    it('renders stages and total value when data is present', () => {
      const markup = renderWithI18n(
        <PipelineDonut
          data={{
            totalValue: 50000,
            stages: [
              { id: '1', name: 'Lead', dealCount: 5, totalValue: 15000, color: '#3b82f6' },
              { id: '2', name: 'Proposal', dealCount: 2, totalValue: 35000, color: '#10b981' },
            ],
          }}
          loading={false}
          currency="USD"
        />
      );
      expect(markup).toContain('Lead');
      expect(markup).toContain('Proposal');
      expect(markup).toContain('$50.0k');
    });
  });

  describe('ActivityFeed', () => {
    it('renders empty state when no activity is found', () => {
      const markup = renderWithI18n(<ActivityFeed items={[]} loading={false} />);
      expect(markup).toContain('No activity yet');
    });

    it('renders activity items with relative time formatting', () => {
      const markup = renderWithI18n(
        <ActivityFeed
          items={[
            {
              id: '1',
              kind: 'message',
              text: 'New message from Alice',
              at: new Date(Date.now() - 60000).toISOString(),
            },
          ]}
          loading={false}
        />
      );
      expect(markup).toContain('New message from Alice');
    });
  });

  describe('SkeletonCard', () => {
    it('renders modern loading placeholder structure', () => {
      const markup = renderToStaticMarkup(<SkeletonCard />);
      expect(markup).toContain('animate-pulse');
      expect(markup).toContain('rounded-2xl');
    });
  });
});
