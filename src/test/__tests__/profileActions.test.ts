// src/test/__tests__/profileActions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateProfileAction, createProfileAction, deleteProfileAction } from '@/lib/actions/profileActions'

// Mock dependencies
vi.mock('@/lib/services/profileService', () => ({
  ProfileService: {
    updateProfile: vi.fn(),
    createProfile: vi.fn(),
    deleteProfile: vi.fn(),
  }
}))

vi.mock('@/lib/supabaseServerClient', () => ({
  supabaseServer: {
    auth: {
      getSession: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}))

describe('Profile Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateProfileAction', () => {
    it('should update profile successfully', async () => {
      const { ProfileService } = await import('@/lib/services/profileService')
      const { supabaseServer } = await import('@/lib/supabase')
      
      // Mock session
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null
      })
      
      // Mock successful update
      vi.mocked(ProfileService.updateProfile).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z'
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('userId', 'user-123')

      const result = await updateProfileAction(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Profile updated successfully')
      expect(ProfileService.updateProfile).toHaveBeenCalledWith('user-123', { email: 'test@example.com' })
    })

    it('should handle validation errors', async () => {
      const { supabaseServer } = await import('@/lib/supabase')
      
      // Mock session
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null
      })

      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('userId', 'user-123')

      const result = await updateProfileAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email format')
    })

    it('should handle authentication errors', async () => {
      const { supabaseServer } = await import('@/lib/supabase')
      
      // Mock no session
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('userId', 'user-123')

      const result = await updateProfileAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in to update your profile')
    })
  })

  describe('createProfileAction', () => {
    it('should create profile successfully', async () => {
      const { ProfileService } = await import('@/lib/services/profileService')
      const { supabaseServer } = await import('@/lib/supabase')
      
      // Mock session
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null
      })
      
      // Mock successful creation
      vi.mocked(ProfileService.createProfile).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z'
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await createProfileAction(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Profile created successfully')
      expect(ProfileService.createProfile).toHaveBeenCalledWith('user-123', 'test@example.com')
    })
  })

  describe('deleteProfileAction', () => {
    it('should delete profile successfully', async () => {
      const { ProfileService } = await import('@/lib/services/profileService')
      const { supabaseServer } = await import('@/lib/supabase')
      const { redirect } = await import('next/navigation')
      
      // Mock session
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null
      })
      
      // Mock successful deletion
      vi.mocked(ProfileService.deleteProfile).mockResolvedValue(undefined)

      const formData = new FormData()
      formData.append('userId', 'user-123')

      await deleteProfileAction(formData)

      expect(ProfileService.deleteProfile).toHaveBeenCalledWith('user-123')
      expect(redirect).toHaveBeenCalledWith('/')
    })

    it('should prevent users from deleting other profiles', async () => {
      const { supabaseServer } = await import('@/lib/supabase')
      
      // Mock session with different user
      vi.mocked(supabaseServer.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null
      })

      const formData = new FormData()
      formData.append('userId', 'different-user-id')

      const result = await deleteProfileAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('You can only delete your own profile')
    })
  })
})
