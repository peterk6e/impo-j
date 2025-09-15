// src/test/__tests__/api/profiles.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/profiles/route';

// Mock Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
}));

// Mock cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('/api/profiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return profiles for authenticated user', async () => {
      const mockSupabase = {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: { user: { id: 'user-1' } } },
            error: null,
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockResolvedValue({
            data: [{ id: 'user-1', email: 'test@example.com' }],
            error: null,
          }),
        })),
      };

      vi.mocked(require('@supabase/auth-helpers-nextjs').createRouteHandlerClient).mockReturnValue(mockSupabase);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
    });

    it('should return 401 for unauthenticated user', async () => {
      const mockSupabase = {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: null },
            error: null,
          }),
        },
      };

      vi.mocked(require('@supabase/auth-helpers-nextjs').createRouteHandlerClient).mockReturnValue(mockSupabase);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });
  });

  describe('POST', () => {
    it('should create profile for authenticated user', async () => {
      const mockSupabase = {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: { user: { id: 'user-1', email: 'test@example.com' } } },
            error: null,
          }),
        },
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { id: 'user-1', email: 'test@example.com' },
                error: null,
              }),
            })),
          })),
        })),
      };

      vi.mocked(require('@supabase/auth-helpers-nextjs').createRouteHandlerClient).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/profiles', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.email).toBe('test@example.com');
    });
  });
});
