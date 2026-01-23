'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import ButtonPrimary from '@/shared/ButtonPrimary'

export default function TestAuth() {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Firebase Auth Test</h1>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          {user ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-lg font-semibold">
                ✅ Authentication Working!
              </div>
              
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.firebaseUser.email}</p>
                <p><strong>UID:</strong> {user.firebaseUser.uid}</p>
                <p><strong>Display Name:</strong> {user.firebaseUser.displayName || 'Not set'}</p>
              </div>

              {user.profile && (
                <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded">
                  <h3 className="font-semibold mb-2">Firestore Profile:</h3>
                  <p><strong>Role:</strong> {user.profile.role}</p>
                  <p><strong>Plan:</strong> {user.profile.plan}</p>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Link href="/dashboard">
                  <ButtonPrimary>Go to Dashboard</ButtonPrimary>
                </Link>
                <ButtonPrimary onClick={logout}>
                  Logout
                </ButtonPrimary>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-neutral-600 text-lg">
                Not authenticated
              </div>
              
              <div className="flex gap-4 justify-center">
                <ButtonPrimary onClick={loginWithGoogle}>
                  Login with Google
                </ButtonPrimary>
                <Link href="/login">
                  <ButtonPrimary>Go to Login Page</ButtonPrimary>
                </Link>
                <Link href="/signup">
                  <ButtonPrimary>Go to Signup Page</ButtonPrimary>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}