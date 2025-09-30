'use client'

import { TCategory } from '@/data/categories'
import Tag from '@/shared/Tag'
import clsx from 'clsx'
import { FC } from 'react'
import WidgetHeading from './WidgetHeading'

interface Props {
  className?: string
  categories: TCategory[]
}

const WidgetCompactCategories: FC<Props> = ({ className = 'bg-neutral-100 dark:bg-neutral-800', categories }) => {
  return (
    <div className={clsx('widget-compact-categories overflow-hidden rounded-3xl', className)}>
      <WidgetHeading title="Categories" viewAll={{ label: 'View all', href: '/categories' }} />
      <div className="flex flex-wrap gap-2 p-4 xl:p-5">
        {categories?.map((category) => (
          <Tag 
            key={category.id} 
            href={`/category/${category.handle}`}
            className="text-xs"
          >
            {category.name}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default WidgetCompactCategories