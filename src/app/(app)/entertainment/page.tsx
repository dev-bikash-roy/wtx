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
  title: 'Entertainment News | WTX News',
  description: 'Latest celebrity gossip, TV, film, music, streaming and showbiz news from WTX News.',
  keywords: ['entertainment news', 'celebrity gossip', 'TV news', 'film news', 'streaming', 'showbiz'],
  alternates: { canonical: 'https://wtxnews.co.uk/entertainment' },
  openGraph: {
    title: 'Entertainment News | WTX News',
    description: 'Latest celebrity gossip, TV, film, music and showbiz news.',
    url: 'https://wtxnews.co.uk/entertainment',
    type: 'website',
  },
}

// Reusable section header with "View all" link
function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-6 border-b-2 border-neutral-900 dark:border-neutral-100 pb-3">
      <div>
        <h2 className="text-xl font-extrabold uppercase tracking-tight text-neutral-900 dark:text-neutral-100 lg:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      <Link href={href} className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:underline dark:text-blue-400 shrink-0 ml-4">
        More →
      </Link>
    </div>
  )
}

// Lead + list layout (Metro style): 1 big card left, 3 small right
function LeadSection({ posts }: { posts: any[] }) {
  if (!posts.length) return null
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {posts[0] && <Card2 size="large" post={posts[0]} />}
      </div>
      <div className="flex flex-col gap-4">
        {posts.slice(1, 4).map(post => (
          <Card6 key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default async function EntertainmentPage() {
  const [
    ukEntertainmentRaw,
    usEntertainmentRaw,
    celebritiesRaw,
    streamingRaw,
    royalFamilyRaw,
    netflixRaw,
    hollywoodRaw,
    eastendersRaw,
    coronationStreetRaw,
    loveIslandRaw,
    musicRaw,
    celebrityDeathsRaw,
  ] = await Promise.all([
    getWordPressPostsByTag('uk-entertainment', 20),
    getWordPressPostsByTag('us-entertainment', 12),
    getWordPressPostsByTag('celebrities', 12),
    getWordPressPostsByTag('streaming', 12),
    getWordPressPostsByTag('royal-family', 12),
    getWordPressPostsByTag('netflix', 8),
    getWordPressPostsByTag('hollywood', 8),
    getWordPressPostsByTag('eastenders', 8),
    getWordPressPostsByTag('coronation-street', 8),
    getWordPressPostsByTag('love-island', 8),
    getWordPressPostsByTag('music', 8),
    getWordPressPostsByTag('celebrity-deaths', 6),
  ])

  // Deduplicate globally — posts seen in earlier sections won't appear again
  const [
    ukEntertainment,
    usEntertainment,
    celebrities,
    streaming,
    royalFamily,
    netflix,
    hollywood,
    eastenders,
    coronationStreet,
    loveIsland,
    music,
    celebrityDeaths,
  ] = dedupSections(
    ukEntertainmentRaw,
    usEntertainmentRaw,
    celebritiesRaw,
    streamingRaw,
    royalFamilyRaw,
    netflixRaw,
    hollywoodRaw,
    eastendersRaw,
    coronationStreetRaw,
    loveIslandRaw,
    musicRaw,
    celebrityDeathsRaw,
  )

  const heroPost = ukEntertainment[0]

  return (
    <div className="relative container pb-16 lg:pb-20">

      {/* ── HERO BANNER ── */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {heroPost?.featuredImage?.src && (
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPost.featuredImage.src})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-purple-800/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Entertainment
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Celebrity gossip, TV, film, music, streaming and all the showbiz news you need.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Celebrities', slug: 'celebrities' },
                { label: 'Streaming', slug: 'streaming' },
                { label: 'Royals', slug: 'royal-family' },
                { label: 'Netflix', slug: 'netflix' },
                { label: 'Hollywood', slug: 'hollywood' },
                { label: 'Music', slug: 'music' },
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

      <div className="space-y-14">

        {/* ── UK ENTERTAINMENT ── */}
        {ukEntertainment.length > 0 && (
          <section aria-labelledby="uk-entertainment-heading">
            <SectionHeader title="UK Entertainment" subtitle="The biggest stories from British showbiz" href="/tag/uk-entertainment" />
            <LeadSection posts={ukEntertainment} />
            {ukEntertainment.length > 4 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ukEntertainment.slice(4, 8).map(post => <Card11 key={post.id} post={post} />)}
              </div>
            )}
          </section>
        )}

        {/* ── CELEBRITIES ── */}
        {celebrities.length > 0 && (
          <section aria-labelledby="celebrities-heading">
            <SectionHeader title="Celebrity Gossip" subtitle="Who's doing what in the world of fame" href="/tag/celebrities" />
            <LeadSection posts={celebrities} />
          </section>
        )}

        {/* ── ROYAL FAMILY ── */}
        {royalFamily.length > 0 && (
          <section aria-labelledby="royals-heading">
            <SectionHeader title="Royal Family" subtitle="News from the Palace" href="/tag/royal-family" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {royalFamily.slice(0, 8).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── STREAMING ── */}
        {streaming.length > 0 && (
          <section aria-labelledby="streaming-heading">
            <SectionHeader title="Streaming" subtitle="What to watch on Netflix, Disney+ and more" href="/tag/streaming" />
            <LeadSection posts={streaming} />
            {streaming.length > 4 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {streaming.slice(4, 8).map(post => <Card11 key={post.id} post={post} />)}
              </div>
            )}
          </section>
        )}

        {/* ── US ENTERTAINMENT ── */}
        {usEntertainment.length > 0 && (
          <section aria-labelledby="us-entertainment-heading">
            <SectionHeader title="US Entertainment" subtitle="Hollywood, music and American showbiz" href="/tag/us-entertainment" />
            <LeadSection posts={usEntertainment} />
          </section>
        )}

        {/* ── SOAPS: EASTENDERS + CORONATION STREET ── */}
        {(eastenders.length > 0 || coronationStreet.length > 0) && (
          <section aria-labelledby="soaps-heading">
            <SectionHeader title="Soaps" subtitle="EastEnders, Coronation Street and more" href="/tag/eastenders" />
            <div className="grid gap-6 lg:grid-cols-2">
              {eastenders.length > 0 && (
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300 mb-4 border-l-4 border-purple-600 pl-3">
                    EastEnders
                  </h3>
                  <div className="flex flex-col gap-4">
                    {eastenders.slice(0, 4).map(post => <Card6 key={post.id} post={post} />)}
                  </div>
                </div>
              )}
              {coronationStreet.length > 0 && (
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300 mb-4 border-l-4 border-purple-600 pl-3">
                    Coronation Street
                  </h3>
                  <div className="flex flex-col gap-4">
                    {coronationStreet.slice(0, 4).map(post => <Card6 key={post.id} post={post} />)}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── NETFLIX ── */}
        {netflix.length > 0 && (
          <section aria-labelledby="netflix-heading">
            <SectionHeader title="Netflix" subtitle="Latest from the world's biggest streaming platform" href="/tag/netflix" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {netflix.slice(0, 8).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── LOVE ISLAND ── */}
        {loveIsland.length > 0 && (
          <section aria-labelledby="love-island-heading">
            <SectionHeader title="Love Island" subtitle="All the drama from the villa" href="/tag/love-island" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loveIsland.slice(0, 8).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── MUSIC ── */}
        {music.length > 0 && (
          <section aria-labelledby="music-heading">
            <SectionHeader title="Music" subtitle="Charts, tours, albums and artist news" href="/tag/music" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {music.slice(0, 8).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── HOLLYWOOD ── */}
        {hollywood.length > 0 && (
          <section aria-labelledby="hollywood-heading">
            <SectionHeader title="Hollywood" subtitle="Movies, stars and the film industry" href="/tag/hollywood" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hollywood.slice(0, 8).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── CELEBRITY DEATHS ── */}
        {celebrityDeaths.length > 0 && (
          <section aria-labelledby="celebrity-deaths-heading">
            <SectionHeader title="Tributes & Obituaries" subtitle="Remembering those we've lost" href="/tag/celebrity-deaths" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {celebrityDeaths.slice(0, 6).map(post => <Card11 key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {/* ── NEWSLETTER ── */}
        <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
          <SectionSubscribe2
            category="Entertainment"
            item1="Get the latest entertainment news delivered to your inbox"
            item2="Get access to premium content"
          />
        </section>

      </div>
    </div>
  )
}
