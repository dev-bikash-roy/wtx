import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import GptAdSlot from '@/components/GptAdSlot'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getCategoryByHandle } from '@/data/categories'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)
  if (!category) return { title: 'Category not found' }
  return {
    title: `${category.name} | WTX News`,
    description: category.description,
    alternates: { canonical: `https://wtxnews.co.uk/category/${handle}` },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `https://wtxnews.co.uk/category/${handle}`,
      type: 'website',
      images: [{ url: category.thumbnail?.src || 'https://wtxnews.co.uk/wtx-logo.png', width: 1200, height: 630, alt: category.name }],
    },
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)

  if (!category || !category.posts || category.posts.length === 0) {
    return notFound()
  }

  const posts = category.posts
  const heroPost = posts[0]
  const topStories = posts.slice(0, 10)
  const morePosts = posts.slice(10, 22)

  return (
    <div className={`page-category-${handle}`}>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wtxnews.co.uk' },
          { '@type': 'ListItem', position: 2, name: category.name, item: `https://wtxnews.co.uk/category/${handle}` },
        ],
      }} />

      <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

        {/* Hero Banner */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
          {heroPost?.featuredImage?.src && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroPost.featuredImage.src})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-800/80 to-black/60" />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-white rounded-full" />
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-base text-white/80 max-w-xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
        </div>

        {/* H2: Top Stories */}
        {topStories.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
              Top Stories
            </h2>
            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
              {topStories[0] && <Card2 size="large" post={topStories[0]} />}
              <div className="flex flex-col gap-6 md:gap-8">
                {topStories.slice(1, 5).map(post => (
                  <Card6 key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* H2: More Stories */}
        {morePosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
              More Stories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {morePosts.map(post => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Ad Slot 3 */}
        <GptAdSlot slotId="div-gpt-ad-2784081-3" className="w-full" />

        {/* Newsletter */}
        <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
          <SectionSubscribe2
            category={category.name}
            item1={`Top stories from ${category.name} to your inbox`}
            item2="Get access to premium content"
          />
        </section>

      </div>
    </div>
  )
}

export default Page
