import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'UK/EU Relations | WTX News',
  description: 'Latest news on UK and EU post-Brexit relations, trade and politics.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/uk-eu-relations' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="uk-eu-relations"
      title="UK/EU Relations"
      description="Post-Brexit developments, trade agreements, and the evolving relationship between the UK and European Union."
      accentFrom="from-indigo-800/95"
      accentVia="via-indigo-700/80"
      topics={['Brexit', 'Trade', 'Borders', 'Diplomacy']}
    />
  )
}
