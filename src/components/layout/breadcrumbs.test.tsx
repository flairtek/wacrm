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
