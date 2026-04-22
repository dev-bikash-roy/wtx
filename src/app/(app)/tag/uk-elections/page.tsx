import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'UK Elections | WTX News',
  description: 'Latest UK election news, results, polls and political analysis.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/uk-elections' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="uk-elections"
      fallbackTag="uk-politics"
      fallbackCategory="politics"
      title="UK Elections"
      description="Comprehensive coverage of UK elections — results, polls, candidates and political analysis."
      accentFrom="from-red-700/95"
      accentVia="via-red-600/80"
      topics={['General Election', 'Local Elections', 'Polls', 'Parties']}
    />
  )
}
