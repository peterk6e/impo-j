import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { logger } from '@/lib/utils/logger';
import { CreateProfileSchema } from '@/lib/validation/schemas';
import { AuthenticationError, ValidationError } from '@/lib/errors/AppError';
import { ProfileService } from '@/lib/services/profileService';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new AuthenticationError();
    }

    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      logger.error('Failed to fetch profiles', {
        error: error.message,
        userId: session.user.id,
      });
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in GET /api/profiles', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create new profile
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    })(req as any);

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new AuthenticationError();
    }

    // Validate request body
    const body = await req.json();
    const validationResult = CreateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ValidationError('Invalid profile data');
    }

    // Create profile using service
    const profile = await ProfileService.createProfile(
      session.user.id,
      session.user.email!
    );

    return NextResponse.json({ data: profile }, { status: 201 });
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in POST /api/profiles', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('profiles')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
