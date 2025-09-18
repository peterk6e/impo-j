import { createClient } from '@/lib/supabase'
import { ProfileService } from '@/lib/services/profileService'
import { logger } from '@/lib/utils/logger'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'
import { Suspense } from 'react'
import ProfileSkeleton from './ProfileSkeleton'
import ScaleApp from '../../../components/ScaleApp'

export default async function ProfilePage() {
  const supabase = await createClient()

  try {
    // Get session first
    const {data: { session }, error } = await supabase.auth.getSession()
    console.log('Session:', session)
    console.log('Error:', error)
    
    if (!session) {
      redirect('/login')
    }

    // Fetch initial profile data for SEO
    let initialProfile = null
    try {
      initialProfile = await ProfileService.getProfile(session.user.id)
    } catch (error) {
      // Profile doesn't exist yet - this is handled by the client component
      logger.info('Profile not found, will be created by client', { userId: session.user.id })
    }

    return (
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileClient 
          initialSession={session} 
          initialProfile={initialProfile}
        />
        <ScaleApp />
      </Suspense>
    )
  } catch (error) {
    logger.error('Unexpected error in ProfilePage', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    redirect('/login')
  }
}
