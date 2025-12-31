
'use client'

import { AnalyzedTag } from '@/lib/ai-tags'
import { Link } from '@/shared/link'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { FC, useEffect, useState } from 'react'

const SectionSmartTags: FC<{ className?: string }> = ({ className = '' }) => {
    const [tags, setTags] = useState<AnalyzedTag[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/analyze-tags')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTags(data.slice(0, 5))
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return null // Or skeleton

    if (tags.length === 0) return null

    return (
        <div className={`nc-SectionSmartTags ${className}`}>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mr-10 lg:w-2/5">
                    <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="size-6 text-yellow-500" />
                        <h2 className="text-3xl font-semibold">Trending Questions</h2>
                    </div>
                    <span className="block text-neutral-500 dark:text-neutral-400 mt-2 text-lg">
                        What people are asking about today&apos;s news
                    </span>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col gap-3">
                        {tags.map((tag) => (
                            tag.relatedQuestion ? (
                                <Link
                                    key={tag.id}
                                    href={`/tag/${tag.handle}`} // Assuming AnalyzedTag extends TTag which has handle
                                    className="group block rounded-xl border border-neutral-100 bg-white p-4 transition-colors hover:border-primary-100 hover:bg-primary-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600">
                                            {tag.relatedQuestion}
                                        </span>
                                        <span className="ml-4 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-800">
                                            #{tag.name}
                                        </span>
                                    </div>
                                </Link>
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionSmartTags
