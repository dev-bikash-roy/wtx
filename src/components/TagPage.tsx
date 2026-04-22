import { Metadata } from 'next'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'

interface TagPageProps {
  tag: string
  title: string
  description: string
  accentColor: string // tailwind bg color e.g. 'bg-blue-700'
  accentFrom: string  // gradient from e.g. 'from-blue-700/95'
  accentVia: string   // gradient via
  topics?: string[]
}

export default async function TagPage({
  tag,
  title,
  description,
  accentColor,
  accentFrom,
  accentVia,
  topics = [],
}: TagPageProps) {
  const posts = await getWordPressPostsByTag(tag, 50)
  const topStories = posts.slice(0, 10)
  const morePosts = posts.slice(10, 22)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">
      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {topStories[0]?.featuredImage?.src && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${topStories[0].featuredImage.src})` }}
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-r ${accentFrom} ${accentVia} to-black/60`} />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              {description}
            </p>
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full backdrop-blur-sm transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* Top Stories */}
      {topStories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            Top Stories
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {topStories[0] && <Card2 size="large" post={topStories[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {topStories.slice(1, 5).map((post) => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More Stories */}
      {morePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            More Stories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {morePosts.map((post) => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No stories found yet. Check back soon.</p>
        </div>
      )}

      {/* Newsletter */}
      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2
          category={title}
          item1={`Get the latest ${title} stories to your inbox`}
          item2="Get access to premium content"
        />
      </section>
    </div>
  )
}
