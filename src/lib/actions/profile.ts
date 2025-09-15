// src/lib/actions/profile.ts
'use server'

// DEPRECATED: Use ProfileService instead
// This file is kept for backward compatibility but should be removed

import { ProfileService } from '@/lib/services/profileService'

export async function ensureUserProfile(userId: string, email: string) {
  // Delegate to service layer
  return await ProfileService.getOrCreateProfile(userId, email)
}
