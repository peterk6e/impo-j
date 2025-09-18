import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase";
import { cookies } from 'next/headers'
import { ProfileService } from '@/lib/services/profileService'
import { AuthenticationError, NotFoundError } from '@/lib/errors/AppError'
import { logger } from '@/lib/utils/logger'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = context.params;
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Get profile using service
    const profile = await ProfileService.getProfile(id)

    return NextResponse.json({ data: profile })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    let id: string | undefined;
    try {
      id = (await context.params).id;
    } catch {
      id = undefined;
    }

    logger.error('Unexpected error in GET /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: id 
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {

  try {
    const supabase = await createClient()
    const { id } = context.params;
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Validate request body
    const body = await req.json()
    const { email } = body

    // Update profile using service
    const profile = await ProfileService.updateProfile(id, { email })

    return NextResponse.json({ data: profile })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    let id: string | undefined;
    try {
      id = (await context.params).id;
    } catch {
      id = undefined;
    }

    logger.error('Unexpected error in PUT /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: id 
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = context.params;
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new AuthenticationError()
    }

    // Delete profile using service
    await ProfileService.deleteProfile(id)

    return NextResponse.json({ message: 'Profile deleted successfully' })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    let id: string | undefined;
    try {
      id = (await context.params).id;
    } catch {
      id = undefined;
    }

    logger.error('Unexpected error in DELETE /api/profiles/[id]', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      profileId: id 
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
