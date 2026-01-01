
'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { TPost } from '@/data/posts'
import Link from 'next/link'

interface GeminiSmartSearchProps {
    posts: TPost[]
}

interface Reference {
    title: string
    url: string
}

interface ApiResponse {
    answer: string
    references: Reference[]
}

const GeminiSmartSearch = ({ posts }: GeminiSmartSearchProps) => {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState<ApiResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim() || isLoading) return

        setIsLoading(true)
        setError('')
        setResult(null)

        try {
            // Simplify context
            const context = posts.slice(0, 20).map(p => ({
                title: p.title,
                content: p.excerpt || p.title,
                handle: p.handle || p.slug // Ensure we pass the handle/slug
            }))

            const response = await fetch('/api/chat/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: query }],
                    context
                }),
            })

            if (!response.ok) throw new Error('Failed to fetch response')

            const data = await response.json()
            setResult(data)
        } catch (err) {
            console.error('Search error:', err)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl border border-blue-100 dark:border-neutral-700 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-xs font-semibold mb-3">
                    <SparklesIcon className="w-4 h-4" />
                    <span>AI Powered</span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Ask about the news</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">Get instant answers based on today&apos;s headlines.</p>
            </div>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. What is the latest on the Premier League?"
                        className="w-full pl-6 pr-14 py-4 rounded-xl border-2 border-transparent bg-white dark:bg-neutral-800 focus:border-blue-500 focus:ring-0 shadow-sm text-lg transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">AI Answer</h3>
                        <p className="text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                            {result.answer}
                        </p>

                        {result.references && result.references.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
                                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Related Articles</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {result.references.map((ref, idx) => (
                                        <Link
                                            key={idx}
                                            href={ref.url}
                                            className="group flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                        >
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                                {ref.title}
                                            </span>
                                            <ArrowRightIcon className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GeminiSmartSearch
