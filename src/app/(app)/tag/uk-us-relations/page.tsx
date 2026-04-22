import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'UK–US Relations | WTX News',
  description: 'Latest news on UK and US diplomatic, trade and political relations.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/uk-us-relations' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="uk-us-relations"
      title="UK–US Relations"
      description="Covering the special relationship — trade, diplomacy, politics and culture between the UK and United States."
      accentFrom="from-blue-800/95"
      accentVia="via-blue-700/80"
      topics={['Trade', 'Diplomacy', 'Defence', 'Politics']}
    />
  )
}
