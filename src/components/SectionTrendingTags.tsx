import { getTrendingTags } from '@/data/categories'
import { Link } from '@/shared/link'
import { FC } from 'react'

interface SectionTrendingTagsProps {
  className?: string
  heading?: string
  subHeading?: string
}

const SectionTrendingTags: FC<SectionTrendingTagsProps> = async ({
  className = '',
  heading = 'Trending Tags',
  subHeading = 'Most popular tags used today'
}) => {
  const trendingTags = await getTrendingTags(5)

  return (
    <div className={`nc-SectionTrendingTags ${className}`}>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mr-10 lg:w-2/5">
          <h2 className="text-3xl font-semibold">{heading}</h2>
          {subHeading && (
            <span className="block text-neutral-500 dark:text-neutral-400 mt-2 text-lg">
              {subHeading}
            </span>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, index) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.handle}`}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${index === 0 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100' 
                    : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                  }
                  hover:bg-primary-100 hover:text-primary-800 dark:hover:bg-primary-800 dark:hover:text-primary-100
                `}
              >
                #{tag.name}
                <span className="ml-2 text-xs opacity-75">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionTrendingTags