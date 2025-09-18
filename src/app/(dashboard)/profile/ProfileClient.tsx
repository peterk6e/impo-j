'use client'
import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { useProfile, useCreateProfile } from '@/lib/hooks/useProfile'
import { Profile } from '@/lib/validation/schemas'
import { updateProfileAction, createProfileAction } from '@/lib/actions/profileActions'
import { Button } from '@/components/ui/Button'

interface ProfileClientProps {
  initialSession: Session | null
  initialProfile?: Profile | null
}

export default function ProfileClient({ 
  initialSession, 
  initialProfile 
}: ProfileClientProps) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isEditing, setIsEditing] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  

  // React Query hooks
  const { 
    data: profile, 
    isLoading, 
    error, 
    refetch 
  } = useProfile(session?.user.id || '', {
    initialData: initialProfile,
    enabled: !!session?.user.id
  })
  
  const createProfile = useCreateProfile()

  useEffect(() => {
    const supabase = createClient()


    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (profile) {
      setEmail(profile.email)
    }
  }, [profile])

  const handleUpdateProfile = async (formData: FormData) => {
    if (!session?.user.id) return
    
    startTransition(async () => {
      try {
        formData.append('userId', session.user.id)
        const result = await updateProfileAction(formData)
        
        if (result.success) {
          setMessage({ type: 'success', text: result.message || ''  })
          setIsEditing(false)
          refetch() // Refetch to get latest data
        } else {
          setMessage({ type: 'error', text: result.error || '' })
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'An unexpected error occurred. Please try again.' 
        })
      }
    })
  }

  const handleCreateProfile = async () => {
    if (!session?.user.id || !session.user.email) return
    
    try {
      await createProfile.mutateAsync({
        userId: session.user.id,
        email: session.user.email
      })
      setMessage({ type: 'success', text: 'Profile created successfully' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to create profile. Please try again.' 
      })
    }
  }

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-gray-600">Please login first.</p>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 mb-4">Error loading profile: {error.message}</p>
          <Button 
            onClick={handleCreateProfile}
            disabled={createProfile.isPending}
            className="w-full"
          >
            {createProfile.isPending ? 'Creating...' : 'Create Profile'}
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Message display */}
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600 mb-4">Welcome! Your email: {session.user.email}</p>
      
      {profile && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile ID</label>
            <p className="text-sm text-gray-900 font-mono">{profile.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <form action={handleUpdateProfile} className="space-y-2">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-900">{profile.email}</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="text-sm text-gray-900">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Danger zone */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
            <Button
              onClick={() => alert('contact admin')}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              {isPending ? 'Deleting...' : 'Delete Profile'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
