import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

const mockExchangeCodeForSession = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login?error=auth_callback_failed when no code is provided', async () => {
    const req = new NextRequest('http://localhost:3000/auth/callback');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/login?error=auth_callback_failed');
  });

  it('exchanges code for session and redirects to /dashboard by default', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null });

    const req = new NextRequest('http://localhost:3000/auth/callback?code=valid-code');
    const res = await GET(req);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('redirects to specified next query param when valid', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null });

    const req = new NextRequest('http://localhost:3000/auth/callback?code=valid-code&next=/settings/profile');
    const res = await GET(req);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/settings/profile');
  });

  it('prevents open redirect attacks by falling back to /dashboard', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null });

    const req = new NextRequest('http://localhost:3000/auth/callback?code=valid-code&next=//evil.com/hack');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('redirects to login error if exchangeCodeForSession returns an error', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: new Error('Invalid or expired PKCE code') });

    const req = new NextRequest('http://localhost:3000/auth/callback?code=expired-code');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/login?error=auth_callback_failed');
  });
});
