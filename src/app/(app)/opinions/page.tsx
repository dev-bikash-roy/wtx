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
  title: 'Opinions | WTX News',
  description: 'Opinion pieces, analysis, editor picks and in-depth reads from WTX News.',
  alternates: { canonical: 'https://wtxnews.co.uk/opinions' },
}

export default async function OpinionsPage() {
  const [
    opinionRaw,
    exposeRaw,
    editorPicksRaw,
    inReviewRaw,
    knowledgeHubRaw,
    exposeArticlesRaw,
  ] = await Promise.all([
    getWordPressPostsByTag('opinion', 8),
    getWordPressPostsByTag('expose', 8),
    getWordPressPostsByTag('editors-picks', 8),
    getWordPressPostsByTag('in-review', 8),
    getWordPressPostsByTag('knowledge-hub', 8),
    getWordPressPostsByTag('expose-articles', 8),
  ])

  const [
    opinionPosts,
    exposePosts,
    editorPicksPosts,
    inReviewPosts,
    knowledgeHubPosts,
    exposeArticlesPosts,
  ] = dedupSections(
    opinionRaw,
    exposeRaw,
    editorPicksRaw,
    inReviewRaw,
    knowledgeHubRaw,
    exposeArticlesRaw,
  )

  const heroPost = opinionPosts[0] || exposePosts[0] || editorPicksPosts[0]

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {heroPost?.featuredImage?.src && (
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPost.featuredImage.src})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Opinions
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Perspectives that matter — opinion pieces, analysis, editor picks and in-depth reads.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Opinion', slug: 'opinion' },
                { label: 'Exposé', slug: 'expose' },
                { label: 'Editor\'s Picks', slug: 'editors-picks' },
                { label: 'In Review', slug: 'in-review' },
                { label: 'Knowledge Hub', slug: 'knowledge-hub' },
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

      {/* H2: Opinions */}
      {opinionPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            <a href="https://wtxnews.com/tag/opinion/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Opinions</a>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {opinionPosts[0] && <Card2 size="large" post={opinionPosts[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {opinionPosts.slice(1, 5).map(post => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H2: Editor's Picks */}
      {editorPicksPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/editors-picks/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Editor&apos;s Picks</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Handpicked reads from our editorial team</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {editorPicksPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Exposé */}
      {exposePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/expose/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Exposé</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Deep dives and investigative reads</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exposePosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: In Review */}
      {inReviewPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/in-review/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">In Review</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Analysis and reviews of the week's biggest stories</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {inReviewPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Knowledge Hub */}
      {knowledgeHubPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/knowledge-hub/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Knowledge Hub</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Explainers, guides and background reads</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {knowledgeHubPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Exposé Articles */}
      {exposeArticlesPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/expose-articles/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">More Analysis</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">More in-depth articles and analysis</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exposeArticlesPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {[...opinionPosts, ...exposePosts, ...editorPicksPosts, ...inReviewPosts, ...knowledgeHubPosts].length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No opinion pieces found yet. Check back soon.</p>
        </div>
      )}

      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2
          category="Opinions"
          item1="Get the latest opinion pieces and analysis to your inbox"
          item2="Get access to premium content"
        />
      </section>

    </div>
  )
}
