// middleware.ts
import { createClient } from '@/lib/supabase'
import { NextResponse, NextRequest } from 'next/server'
import { logger } from '@/lib/utils/logger'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Log authentication attempts
    logger.info('Middleware auth check', {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      error: error?.message
    })
    
    // Protect profile routes
    if (!session && req.nextUrl.pathname.startsWith('/profile')) {
      logger.info('Redirecting unauthenticated user to login', {
        path: req.nextUrl.pathname,
        userAgent: req.headers.get('user-agent')
      })
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Add security headers
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    return res
  } catch (error) {
    logger.error('Middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.nextUrl.pathname
    })
    
    // On error, redirect to login for protected routes
    if (req.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    return res
  }
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/api/profiles/:path*'
  ]
}