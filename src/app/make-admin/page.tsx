'use client'

import { useAuth } from '@/contexts/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Link from 'next/link'

export default function MakeAdmin() {
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const makeAdmin = async () => {
    if (!user?.firebaseUser) {
      setMessage('Please login first')
      return
    }

    setLoading(true)
    try {
      // Update user role to admin
      const userRef = doc(db, 'users', user.firebaseUser.uid)
      await updateDoc(userRef, {
        role: 'admin'
      })

      // Refresh the user profile
      await refreshProfile()
      
      setMessage('✅ You are now an admin! You can access the admin panel at /admin')
    } catch (error) {
      console.error('Error making admin:', error)
      setMessage('❌ Error making admin. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Make Admin</h1>
          <p className="mb-4">Please login first to become an admin.</p>
          <a href="/login" className="text-primary-600 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Make Admin</h1>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current User:</p>
            <p className="font-medium">{user.firebaseUser.email}</p>
            <p className="text-sm text-gray-500">
              Current Role: {user.profile?.role || 'user'}
            </p>
          </div>

          {user.profile?.role === 'admin' ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">✅ You are already an admin!</p>
              <a href="/admin">
                <ButtonPrimary>Go to Admin Panel</ButtonPrimary>
              </a>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click the button below to make yourself an admin.
              </p>
              <ButtonPrimary onClick={makeAdmin} disabled={loading}>
                {loading ? 'Making Admin...' : 'Make Me Admin'}
              </ButtonPrimary>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-700 rounded">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}