'use client'

import { useState } from 'react'
import Input from '@/shared/Input'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/Button'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { loginWithGoogle } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      await loginWithGoogle()
      router.push('/admin')
    } catch (err: any) {
      console.error('Google login error:', err)
      setError('Failed to login with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Admin Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mb-6 flex w-full rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-0.5 dark:bg-neutral-800 disabled:opacity-50"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" className="size-5 shrink-0">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.335-3.486,3.821-5.445,3.821c-3.283,0-5.958-2.681-5.958-5.958s2.675-5.958,5.958-5.958c1.356,0,2.572,0.434,3.529,1.162l2.615-2.615C17.062,2.956,14.93,1.93,12.545,1.93c-5.529,0-10,4.471-10,10s4.471,10,10,10c4.762,0,9.088-3.082,9.888-7.884c0.09-0.545,0.112-1.089,0.112-1.639h-10V10.239z" />
          </svg>
          <p className="grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </p>
        </button>

        {/* OR Divider */}
        <div className="relative text-center mb-6">
          <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
            OR
          </span>
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
        </div>

        <form className="space-y-6" onSubmit={handleEmailLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Email address
            </label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Password
              </label>
              <div className="text-sm">
                <Link href="#" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Not an admin?{' '}
          <Link href="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            User login
          </Link>
        </p>
      </div>
    </div>
  )
}