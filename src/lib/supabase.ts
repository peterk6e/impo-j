// supabase.ts
import { cookies } from 'next/headers'
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs'

// For server components (SSR in page/layout)
export function supabaseServerComponent() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// For API routes
export function supabaseRouteHandler() {
  const cookieStore = cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore })
}