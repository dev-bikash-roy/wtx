'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Link from 'next/link'

export default function UserProfile() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            My Profile
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Account Information
              </h2>
              <div className="space-y-2">
                <p className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Email:</span> {user.firebaseUser.email}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Display Name:</span> {user.firebaseUser.displayName || 'Not set'}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Email Verified:</span> {user.firebaseUser.emailVerified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Subscription
              </h2>
              {user.profile ? (
                <div className="space-y-2">
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Plan:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      user.profile.plan === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {user.profile.plan === 'paid' ? 'Premium' : 'Free'}
                    </span>
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Member Since:</span> {new Date(user.profile.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Last Login:</span> {new Date(user.profile.lastLoginAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">Profile not loaded</p>
              )}
            </div>
          </div>

          {/* Plan Benefits */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Your Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 dark:border-neutral-600">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Free Plan</h3>
                <ul className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>• Access to free articles</li>
                  <li>• Basic news updates</li>
                  <li>• Community access</li>
                </ul>
              </div>
              
              {user.profile?.plan === 'paid' ? (
                <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Premium Plan ✓</h3>
                  <ul className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• All free plan benefits</li>
                    <li>• Premium articles access</li>
                    <li>• Ad-free experience</li>
                    <li>• Early access to content</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              ) : (
                <div className="border rounded-lg p-4 dark:border-neutral-600 opacity-60">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Premium Plan</h3>
                  <ul className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>• All free plan benefits</li>
                    <li>• Premium articles access</li>
                    <li>• Ad-free experience</li>
                    <li>• Early access to content</li>
                    <li>• Priority support</li>
                  </ul>
                  <ButtonPrimary className="mt-3 w-full">
                    Upgrade to Premium
                  </ButtonPrimary>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link href="/">
              <ButtonPrimary>Back to Home</ButtonPrimary>
            </Link>
            
            {user.profile?.role === 'admin' && (
              <Link href="/admin">
                <ButtonPrimary>Admin Dashboard</ButtonPrimary>
              </Link>
            )}
            
            <ButtonPrimary onClick={logout} className="bg-red-600 hover:bg-red-700">
              Logout
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  )
}