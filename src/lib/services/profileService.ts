// src/lib/services/profileService.ts
import { supabaseServer } from '@/lib/supabaseServerClient'
import { logger } from '@/lib/utils/logger'
import { Profile, CreateProfile, UpdateProfile } from '@/lib/validation/schemas'
import { NotFoundError, ConflictError } from '@/lib/errors/AppError'

export class ProfileService {
  /**
   * Get profile by user ID
   */
  static async getProfile(userId: string): Promise<Profile> {
    try {
      const { data: profile, error } = await supabaseServer
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Profile not found')
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return profile
    } catch (error) {
      logger.error('Failed to get profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  /**
   * Create profile for user
   */
  static async createProfile(userId: string, email: string): Promise<Profile> {
    try {
      // Check if profile already exists
      const existingProfile = await this.getProfile(userId).catch(() => null)
      if (existingProfile) {
        throw new ConflictError('Profile already exists')
      }

      const { data: profile, error } = await supabaseServer
        .from('profiles')
        .insert({
          id: userId,
          email,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      logger.info('Profile created successfully', { userId })
      return profile
    } catch (error) {
      logger.error('Failed to create profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(userId: string, updates: UpdateProfile): Promise<Profile> {
    try {
      const { data: profile, error } = await supabaseServer
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Profile not found')
        }
        throw new Error(`Database error: ${error.message}`)
      }

      logger.info('Profile updated successfully', { userId })
      return profile
    } catch (error) {
      logger.error('Failed to update profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  /**
   * Delete profile
   */
  static async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabaseServer
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      logger.info('Profile deleted successfully', { userId })
    } catch (error) {
      logger.error('Failed to delete profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  /**
   * Get or create profile (convenience method)
   */
  static async getOrCreateProfile(userId: string, email: string): Promise<Profile> {
    try {
      return await this.getProfile(userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return await this.createProfile(userId, email)
      }
      throw error
    }
  }
}
