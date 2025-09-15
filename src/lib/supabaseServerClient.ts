// src/lib/supabaseServerClient.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabaseServer = createRouteHandlerClient({
  cookies,
})
