import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'News Clips | WTX News',
  description: 'Watch the latest news clips and video reports from WTX News.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/news-clips' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="news-clips"
      fallbackCategory="videos"
      title="News Clips"
      description="Watch the latest video news reports, breaking news clips and on-the-ground footage."
      accentFrom="from-gray-800/95"
      accentVia="via-gray-700/80"
      topics={[
        { label: 'UK News', slug: 'uk-news' },
        { label: 'Main Headlines', slug: 'main-headlines' },
        { label: 'UK Politics', slug: 'uk-politics' },
        { label: 'World News', slug: 'world-news' },
      ]}
    />
  )
}
