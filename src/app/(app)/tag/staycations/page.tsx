import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Staycations | WTX News',
  description: 'The best UK staycation ideas, destinations and travel tips for holidays at home.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/staycations' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="staycations"
      title="Staycations"
      description="Discover the best of Britain — staycation destinations, hidden gems and tips for the perfect UK holiday."
      accentFrom="from-sky-700/95"
      accentVia="via-sky-600/80"
      topics={['England', 'Scotland', 'Wales', 'Coastal', 'Countryside']}
    />
  )
}
