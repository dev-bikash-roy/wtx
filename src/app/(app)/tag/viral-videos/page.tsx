import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Viral Videos | WTX News',
  description: 'The most shared and talked-about viral videos of the moment.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/viral-videos' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="viral-videos"
      fallbackCategory="videos"
      title="Viral Videos"
      description="The most watched, shared and talked-about videos on the internet right now."
      accentFrom="from-rose-700/95"
      accentVia="via-rose-600/80"
      topics={[
        { label: 'Trending', slug: 'trending' },
        { label: 'UK Trending', slug: 'uk-trending' },
        { label: 'UK Entertainment', slug: 'uk-entertainment' },
      ]}
    />
  )
}
