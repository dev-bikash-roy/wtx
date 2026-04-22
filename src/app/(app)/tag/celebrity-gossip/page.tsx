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
      title="Celebrity Gossip"
      description="All the latest showbiz news, celebrity stories, red carpet moments and entertainment gossip."
      accentFrom="from-pink-700/95"
      accentVia="via-pink-600/80"
      topics={['Showbiz', 'Red Carpet', 'Relationships', 'TV Stars', 'Music']}
    />
  )
}
