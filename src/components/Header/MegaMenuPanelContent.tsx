'use client'

import { TNavigationItem } from '@/data/navigation'
import { TPost } from '@/data/posts'
import { Link } from '@/shared/link'
import clsx from 'clsx'
import React from 'react'
import Card20 from '../PostCards/Card20'

interface Props {
    megamenu: TNavigationItem
    featuredPosts: TPost[]
    renderNavlink: (item: TNavigationItem) => React.JSX.Element
}

const MegaMenuPanelContent: React.FC<Props> = ({ megamenu, featuredPosts, renderNavlink }) => {
    return (
        <div className="bg-white shadow-lg dark:bg-neutral-900">
            <div className="container">
                <div className="flex py-12 text-sm">
                    <div className="grid flex-1 grid-cols-4 gap-6 pe-10 xl:gap-8 2xl:pe-14">
                        {megamenu.children?.map((menuChild, index) => (
                            <div key={index}>
                                <p className="font-medium text-neutral-900 dark:text-neutral-200">{menuChild.name}</p>
                                <ul className="mt-4 grid space-y-4">{menuChild.children?.map(renderNavlink)}</ul>
                            </div>
                        ))}
                    </div>
                    <div className="grid w-2/7 grid-cols-1 gap-5 xl:w-4/9 xl:grid-cols-2">
                        {featuredPosts.map((post, index) => (
                            <Card20 key={post.id} post={post} className={clsx(index === 0 ? '' : 'hidden xl:block')} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MegaMenuPanelContent
