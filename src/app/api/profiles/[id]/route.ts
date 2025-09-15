// src/app/api/profiles/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ProfileService } from '@/lib/services/profileService'
import { AuthenticationError, NotFoundError } from '@/lib/errors/AppError'
import { logger } from '@/lib/utils/logger'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = params
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Get profile using service
    const profile = await ProfileService.getProfile(id)

    return Response.json({ data: profile })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    
    if (error instanceof NotFoundError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    
    logger.error('Unexpected error in GET /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: params.id 
    })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = params
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Validate request body
    const body = await request.json()
    const { email } = body

    // Update profile using service
    const profile = await ProfileService.updateProfile(id, { email })

    return Response.json({ data: profile })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    
    logger.error('Unexpected error in PUT /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: params.id 
    })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = params
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Delete profile using service
    await ProfileService.deleteProfile(id)

    return Response.json({ message: 'Profile deleted successfully' })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    
    logger.error('Unexpected error in DELETE /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: params.id 
    })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
