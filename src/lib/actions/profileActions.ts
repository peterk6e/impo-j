'use server';

import { ProfileService } from '@/lib/services/profileService';
import { logger } from '@/lib/utils/logger';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateProfileSchema } from '@/lib/validation/schemas';
import { ValidationError, AuthenticationError, NotFoundError } from '@/lib/errors/AppError';
import { createClient } from '@/lib/supabase';

/**
 * Update profile action
 */
export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new AuthenticationError('You must be logged in to update your profile');
    }

    const email = formData.get('email') as string;
    const userId = formData.get('userId') as string;

    if (!email || !userId) {
      throw new ValidationError('Email and user ID are required');
    }

    const validationResult = UpdateProfileSchema.safeParse({ email });
    if (!validationResult.success) {
      throw new ValidationError('Invalid email format');
    }

    const updatedProfile = await ProfileService.updateProfile(userId, {
      email,
    });

    logger.info('Profile updated successfully', {
      userId,
      email: updatedProfile.email,
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    };
  } catch (error) {
    logger.error('Failed to update profile', {
      error: error instanceof Error ? error.message : 'Unknown error',
      formData: Object.fromEntries(formData.entries()),
    });

    if (
      error instanceof ValidationError ||
      error instanceof AuthenticationError ||
      error instanceof NotFoundError
    ) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Create profile action
 */
export async function createProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new AuthenticationError('You must be logged in to create a profile');
    }

    const email = formData.get('email') as string;
    const userId = session.user.id;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const validationResult = UpdateProfileSchema.safeParse({ email });
    if (!validationResult.success) {
      throw new ValidationError('Invalid email format');
    }

    const newProfile = await ProfileService.createProfile(userId, email);

    logger.info('Profile created successfully', {
      userId,
      email: newProfile.email,
    });

    // Revalidate the profile page after creation
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile created successfully',
      profile: newProfile,
    };
  } catch (error) {
    logger.error('Failed to create profile', {
      error: error instanceof Error ? error.message : 'Unknown error',
      formData: Object.fromEntries(formData.entries()),
    });

    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
