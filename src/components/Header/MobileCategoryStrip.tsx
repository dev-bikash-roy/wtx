'use client'

import { TNavigationItem } from '@/data/navigation'
import { Link } from '@/shared/link'
import React from 'react'

interface Props {
    data: TNavigationItem[]
}

const MobileCategoryStrip: React.FC<Props> = ({ data }) => {
    return (
        <div className="w-full overflow-x-auto pb-2 lg:hidden">
            <div className="flex gap-2 px-4 whitespace-nowrap">
                {data?.slice(0, 4).map((item, index) => (
                    <Link
                        key={index}
                        href={item.href || '#'}
                        className="inline-block rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MobileCategoryStrip
