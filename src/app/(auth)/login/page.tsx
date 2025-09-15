'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setStatus('idle')
    const { error } = await supabase.auth.signInWithOtp({ email,  options: {
      emailRedirectTo: `${window.location.origin}/profile`
    } })
    console.log(error)

    if (error) {
      setMessage(error.message)
      setStatus('error')
    } else {
      setMessage('Check your email for the login link!')
      setStatus('success')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className={`w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>

        {/* Radix AlertDialog */}
        {status !== 'idle' && (
            <AlertDialog.Root
              open={status === 'success' || status === 'error'}  
              onOpenChange={(open) => {
                if (!open) setStatus('idle')
              }}
            >
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 items-center">
                {status === 'success' ? (
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircleIcon className="h-12 w-12 text-red-500" />
                )}
                <p className="text-center">{message}</p>
                <AlertDialog.Action className="mt-2 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition">
                  Close
                </AlertDialog.Action>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}
      </div>
    </div>
  )
}
