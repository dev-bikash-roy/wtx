"use client";

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Input from '@/shared/Input'
import ButtonCircle from '@/shared/ButtonCircle'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Props {
    category?: string
}

const NewsletterForm = ({ category = "General" }: Props) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [city, setCity] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !firstName || !lastName || !city) {
            setStatus('error')
            setMessage('Please fill in all fields.')
            return
        }

        setLoading(true)
        setStatus('idle')
        setMessage('')

        try {
            const collectionName = 'newsletters'
            await addDoc(collection(db, collectionName), {
                firstName,
                lastName,
                city,
                email,
                category,
                createdAt: serverTimestamp(),
            })
            setStatus('success')
            setMessage('Thank you for subscribing!')
            setFirstName('')
            setLastName('')
            setCity('')
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
        <div className="relative mt-8 max-w-sm">
            <form className="relative flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <Input
                        required
                        placeholder="First name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                    />
                    <Input
                        required
                        placeholder="Last name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <Input
                    required
                    placeholder="City / Location"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                />
                <div className="relative">
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
                </div>
                {category !== "General" && (
                    <p className="text-xs text-neutral-500 italic px-1">Subscribing to {category} news</p>
                )}
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
