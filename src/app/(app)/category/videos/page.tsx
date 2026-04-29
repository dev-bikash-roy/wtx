import { Metadata } from 'next'
import Link from 'next/link'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { dedupSections } from '@/utils/dedup-posts'

export const revalidate = 180

export const metadata: Metadata = {
  title: 'Videos | WTX News',
  description: 'Watch the latest news videos, clips and briefings from WTX News.',
  alternates: { canonical: 'https://wtxnews.co.uk/category/videos' },
}

export default async function VideosPage() {
  const [
    videoNewsRaw,
    newsBriefingVideoRaw,
    usNewsBriefingVideoRaw,
    euNewsBriefingVideoRaw,
  ] = await Promise.all([
    getWordPressPostsByTag('video-news', 20),
    getWordPressPostsByTag('news-briefing-video', 8),
    getWordPressPostsByTag('us-news-briefing-video', 8),
    getWordPressPostsByTag('eu-news-briefing-video', 8),
  ])

  const [
    videoNewsPosts,
    newsBriefingVideoPosts,
    usNewsBriefingVideoPosts,
    euNewsBriefingVideoPosts,
  ] = dedupSections(
    videoNewsRaw,
    newsBriefingVideoRaw,
    usNewsBriefingVideoRaw,
    euNewsBriefingVideoRaw,
  )

  const heroPost = videoNewsPosts[0]
  const topStories = videoNewsPosts.slice(0, 10)
  const morePosts = videoNewsPosts.slice(10, 14)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {heroPost?.featuredImage?.src && (
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPost.featuredImage.src})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-800/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Videos
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Watch the latest news videos, clips and briefings from WTX News.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Video News', slug: 'video-news' },
                { label: 'News Clips', slug: 'news-clips' },
                { label: 'Viral Videos', slug: 'viral-videos' },
                { label: 'News Briefing', slug: 'news-briefing-video' },
              ].map(t => (
                <Link key={t.slug} href={`/tag/${t.slug}`}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-medium rounded-full backdrop-blur-sm transition-colors">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* H2: Latest Videos */}
      {topStories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            <a href="https://wtxnews.com/tag/video-news/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Latest Videos</a>
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

      {/* H2: News Briefing Videos */}
      {newsBriefingVideoPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/news-briefing-video/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">News Briefing Videos</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Video briefings on the biggest stories</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newsBriefingVideoPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: US News Videos */}
      {usNewsBriefingVideoPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/us-news-briefing-video/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">US News Videos</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Video briefings from the United States</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {usNewsBriefingVideoPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: EU News Videos */}
      {euNewsBriefingVideoPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/eu-news-briefing-video/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">EU News Videos</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Video briefings from Europe</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {euNewsBriefingVideoPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: More Videos */}
      {morePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            <a href="https://wtxnews.com/tag/video-news/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">More Videos</a>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {morePosts.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {videoNewsPosts.length === 0 && newsBriefingVideoPosts.length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No videos found yet. Check back soon.</p>
        </div>
      )}

      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2
          category="Videos"
          item1="Get the latest video news and briefings to your inbox"
          item2="Get access to premium content"
        />
      </section>

    </div>
  )
}
