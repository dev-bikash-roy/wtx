import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Premier League | WTX News',
  description: 'Latest Premier League news, fixtures, results and transfer gossip.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/premier-league' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="premier-league"
      title="Premier League"
      description="All the latest from the world's most-watched football league — results, fixtures, transfers and analysis."
      accentFrom="from-purple-800/95"
      accentVia="via-purple-700/80"
      topics={['Results', 'Fixtures', 'Transfers', 'Table', 'Gossip']}
    />
  )
}
