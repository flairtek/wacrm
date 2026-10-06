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
