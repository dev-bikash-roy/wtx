import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Football News | WTX News',
  description: 'Latest football news, results, transfers and analysis from the UK and beyond.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/football' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="football"
      title="Football"
      description="The latest football news, match results, transfer rumours and in-depth analysis."
      accentFrom="from-green-800/95"
      accentVia="via-green-700/80"
      topics={[
        { label: 'Premier League', slug: 'premier-league' },
        { label: 'Football Gossip', slug: 'football-gossip' },
        { label: 'Transfers', slug: 'transfer-gossip' },
        { label: 'Sports News', slug: 'sports-news' },
        { label: 'F1', slug: 'f1-news' },
      ]}
    />
  )
}
