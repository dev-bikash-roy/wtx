"use client";

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Input from '@/shared/Input'
import ButtonCircle from '@/shared/ButtonCircle'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

const NewsletterForm = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        setStatus('idle')
        setMessage('')

        try {
            await addDoc(collection(db, 'newsletters'), {
                email,
                createdAt: serverTimestamp(),
            })
            setStatus('success')
            setMessage('Thank you for subscribing!')
            setEmail('')
        } catch (error: any) {
            console.error('Error adding document: ', error)
            setStatus('error')
            setMessage(error.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative mt-10 max-w-sm">
            <form className="relative" onSubmit={handleSubmit}>
                <Input
                    required
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <div className="absolute end-1 top-1/2 -translate-y-1/2">
                    <ButtonCircle color="dark/white" type="submit" disabled={loading}>
                        <ArrowRightIcon className="size-5 rtl:rotate-180" />
                    </ButtonCircle>
                </div>
            </form>
            {message && (
                <p className={clsx("mt-2 text-sm", status === 'success' ? "text-green-600" : "text-red-600")}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default NewsletterForm
