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
  title: 'News Briefing | WTX News',
  description: 'Your essential daily UK news briefing — top headlines, politics, world news and more.',
  alternates: { canonical: 'https://wtxnews.co.uk/latest-news' },
}

export default async function NewsBriefingPage() {
  // Fetch all sections in parallel using tags with confirmed posts
  const [
    mainHeadlinesRaw,
    ukNewsBriefingRaw,
    ukPoliticsRaw,
    worldNewsRaw,
    donaldTrumpRaw,
    keirStarmerRaw,
    newsBriefingRaw,
    worldNewsBriefingRaw,
    dailyBriefingRaw,
  ] = await Promise.all([
    getWordPressPostsByTag('main-headlines', 20),
    getWordPressPostsByTag('uk-news-briefing', 12),
    getWordPressPostsByTag('uk-politics', 12),
    getWordPressPostsByTag('world-news', 12),
    getWordPressPostsByTag('donald-trump', 8),
    getWordPressPostsByTag('keir-starmer', 8),
    getWordPressPostsByTag('news-briefing', 8),
    getWordPressPostsByTag('world-news-briefing', 8),
    getWordPressPostsByTag('daily-news-briefing', 8),
  ])

  const [
    mainHeadlines,
    ukNewsBriefing,
    ukPolitics,
    worldNews,
    donaldTrump,
    keirStarmer,
    newsBriefing,
    worldNewsBriefing,
    dailyBriefing,
  ] = dedupSections(
    mainHeadlinesRaw,
    ukNewsBriefingRaw,
    ukPoliticsRaw,
    worldNewsRaw,
    donaldTrumpRaw,
    keirStarmerRaw,
    newsBriefingRaw,
    worldNewsBriefingRaw,
    dailyBriefingRaw,
  )

  const heroPost = mainHeadlines[0]

  return (
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
              News Briefing
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Your essential daily briefing — the biggest UK and world stories you need to know right now.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'UK Politics', slug: 'uk-politics' },
                { label: 'World News', slug: 'world-news' },
                { label: 'Main Headlines', slug: 'main-headlines' },
                { label: 'UK News Briefing', slug: 'uk-news-briefing' },
                { label: 'Donald Trump', slug: 'donald-trump' },
                { label: 'Keir Starmer', slug: 'keir-starmer' },
              ].map(topic => (
                <Link
                  key={topic.slug}
                  href={`/tag/${topic.slug}`}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-medium rounded-full backdrop-blur-sm transition-colors"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* H2: Today's Main Headlines */}
      {mainHeadlines.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              Today's Main Headlines
            </h2>
            <Link href="/tag/main-headlines" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {mainHeadlines[0] && <Card2 size="large" post={mainHeadlines[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {mainHeadlines.slice(1, 5).map(post => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H2: UK News Briefing */}
      {ukNewsBriefing.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              UK News Briefing
            </h2>
            <Link href="/tag/uk-news-briefing" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">The essential UK stories you need to know today</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ukNewsBriefing.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: UK Politics */}
      {ukPolitics.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              UK Politics
            </h2>
            <Link href="/uk-politics" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Westminster, Whitehall and beyond</p>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {ukPolitics[0] && <Card2 size="large" post={ukPolitics[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {ukPolitics.slice(1, 5).map(post => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H2: Keir Starmer */}
      {keirStarmer.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              Keir Starmer
            </h2>
            <Link href="/tag/keir-starmer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Latest news on the Prime Minister</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keirStarmer.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: World News */}
      {worldNews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              World News
            </h2>
            <Link href="/tag/world-news" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">International stories from around the globe</p>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {worldNews[0] && <Card2 size="large" post={worldNews[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {worldNews.slice(1, 5).map(post => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H2: World News Briefing */}
      {worldNewsBriefing.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              World News Briefing
            </h2>
            <Link href="/tag/world-news-briefing" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">The most important international stories summarised</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {worldNewsBriefing.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: Donald Trump */}
      {donaldTrump.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              Donald Trump
            </h2>
            <Link href="/tag/donald-trump" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Latest news from the White House</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {donaldTrump.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: Daily News Briefing */}
      {dailyBriefing.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              Daily News Briefing
            </h2>
            <Link href="/tag/daily-news-briefing" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Your daily roundup of the biggest stories</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dailyBriefing.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: News Briefing */}
      {newsBriefing.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 lg:text-3xl">
              More Briefings
            </h2>
            <Link href="/tag/news-briefing" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newsBriefing.slice(0, 8).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2
          category="News Briefing"
          item1="Get the daily news briefing delivered to your inbox"
          item2="Get access to premium content"
        />
      </section>

    </div>
  )
}
