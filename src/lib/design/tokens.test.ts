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
