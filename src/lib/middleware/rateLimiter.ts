// src/lib/middleware/rateLimiter.ts
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest) => {
    // Get IP from headers (typical in Vercel/Next.js deployments)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const windowMs = config.windowMs;
    const maxRequests = config.maxRequests;

    const key = `${ip}:${Math.floor(now / windowMs)}`;
    const current = rateLimitStore.get(key);

    if (!current) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (now > current.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (current.count >= maxRequests) {
      return { success: false, remaining: 0 };
    }

    current.count++;
    return { success: true, remaining: maxRequests - current.count };
  };
}

// Clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
