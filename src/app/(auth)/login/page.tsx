'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import type { JSX } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

const socials: {
  name: string
  href: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  action?: string
}[] = [
    {
      name: 'Continue with Google',
      href: '#',
      action: 'google',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.335-3.486,3.821-5.445,3.821c-3.283,0-5.958-2.681-5.958-5.958s2.675-5.958,5.958-5.958c1.356,0,2.572,0.434,3.529,1.162l2.615-2.615C17.062,2.956,14.93,1.93,12.545,1.93c-5.529,0-10,4.471-10,10s4.471,10,10,10c4.762,0,9.088-3.082,9.888-7.884c0.09-0.545,0.112-1.089,0.112-1.639h-10V10.239z" />
        </svg>
      ),
    },
  ]

const LoginPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, loginWithGoogle } = useAuth()

  const redirect = searchParams.get('redirect') || '/profile' // Changed from '/dashboard/posts' to '/profile'

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect)
    }
  }, [user, router, redirect])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      // Redirect happens in useEffect
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to login with Google')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redirect happens in useEffect
    } catch (err: any) {
      console.error(err)
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Logo />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div className="grid gap-3">
          {socials.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (item.action === 'google') handleGoogleLogin()
              }}
              className="flex w-full rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-0.5 dark:bg-neutral-800"
            >
              <item.icon className="size-5 shrink-0" />
              <p className="grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.name}</p>
            </button>
          ))}
        </div>
        {/* OR */}
        <div className="relative text-center">
          <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
            OR
          </span>
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
        </div>
        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
            <Input type="email" name="email" placeholder="example@example.com" className="mt-1" required />
          </Field>
          <Field className="block">
            <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              <Label>Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium underline">
                Forgot password?
              </Link>
            </div>
            <Input type="password" name="password" className="mt-1" required />
          </Field>
          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </ButtonPrimary>
        </form>

        {/* ==== */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          New user? {` `}
          <Link href="/signup" className="font-medium underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

export default LoginPage