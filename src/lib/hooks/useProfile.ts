// src/lib/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Profile, UpdateProfile } from '@/lib/validation/schemas'
import { logger } from '@/lib/utils/logger'

// API functions with proper error handling
async function fetchProfile(userId: string): Promise<Profile> {
  try {
    const response = await fetch(`/api/profiles/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const { data } = await response.json()
    return data
  } catch (error) {
    logger.error('Failed to fetch profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
    throw error
  }
}

async function createProfile(userId: string, email: string): Promise<Profile> {
  try {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const { data } = await response.json()
    logger.info('Profile created successfully', { userId, email })
    return data
  } catch (error) {
    logger.error('Failed to create profile', { userId, email, error: error instanceof Error ? error.message : 'Unknown error' })
    throw error
  }
}

async function updateProfile(userId: string, updates: UpdateProfile): Promise<Profile> {
  try {
    const response = await fetch(`/api/profiles/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const { data } = await response.json()
    logger.info('Profile updated successfully', { userId, updates })
    return data
  } catch (error) {
    logger.error('Failed to update profile', { userId, updates, error: error instanceof Error ? error.message : 'Unknown error' })
    throw error
  }
}

async function deleteProfile(userId: string): Promise<void> {
  try {
    const response = await fetch(`/api/profiles/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    logger.info('Profile deleted successfully', { userId })
  } catch (error) {
    logger.error('Failed to delete profile', { userId, error: error instanceof Error ? error.message : 'Unknown error' })
    throw error
  }
}

// React Query hooks with enhanced options
export function useProfile(userId: string, options?: { initialData?: Profile | null; enabled?: boolean }) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    enabled: options?.enabled ?? !!userId,
    initialData: options?.initialData || undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        return false
      }
      return failureCount < 3
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, email }: { userId: string; email: string }) =>
      createProfile(userId, email),
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(['profile', data.id], data)
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      logger.info('Profile created and cache updated', { userId: variables.userId })
    },
    onError: (error, variables) => {
      logger.error('Profile creation failed', { 
        userId: variables.userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: UpdateProfile }) =>
      updateProfile(userId, updates),
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(['profile', data.id], data)
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
      logger.info('Profile updated and cache updated', { userId: variables.userId })
    },
    onError: (error, variables) => {
      logger.error('Profile update failed', { 
        userId: variables.userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    },
  })
}

export function useDeleteProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => deleteProfile(userId),
    onSuccess: (_, userId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['profile', userId] })
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      logger.info('Profile deleted and cache cleared', { userId })
    },
    onError: (error, userId) => {
      logger.error('Profile deletion failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    },
  })
}

// Convenience hook for get or create
export function useProfileOrCreate(userId: string, email: string) {
  const profileQuery = useProfile(userId)
  const createMutation = useCreateProfile()
  
  const createProfileIfNeeded = () => {
    if (profileQuery.error && 'status' in profileQuery.error && 
        (profileQuery.error as any).status === 404) {
      createMutation.mutate({ userId, email })
    }
  }
  
  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading || createMutation.isPending,
    error: profileQuery.error || createMutation.error,
    createProfileIfNeeded,
    isCreating: createMutation.isPending,
  }
}
