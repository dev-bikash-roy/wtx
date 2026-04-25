import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Celebrity Gossip | WTX News',
  description: 'Latest celebrity gossip, showbiz news and entertainment stories.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/celebrity-gossip' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="celebrity-gossip"
      fallbackTag="celebrities"
      fallbackCategory="entertainment"
      title="Celebrity Gossip"
      description="All the latest showbiz news, celebrity stories, red carpet moments and entertainment gossip."
      accentFrom="from-pink-700/95"
      accentVia="via-pink-600/80"
      topics={[
        { label: 'Celebrities', slug: 'celebrities' },
        { label: 'UK Entertainment', slug: 'uk-entertainment' },
        { label: 'US Entertainment', slug: 'us-entertainment' },
        { label: 'Streaming', slug: 'streaming' },
      ]}
    />
  )
}
