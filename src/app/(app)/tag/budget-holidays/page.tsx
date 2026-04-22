import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Budget Holidays | WTX News',
  description: 'Affordable travel ideas, cheap holiday deals and money-saving travel tips.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/budget-holidays' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="budget-holidays"
      fallbackTag="travel"
      title="Budget Holidays"
      description="Affordable travel ideas, cheap flight deals, budget destinations and money-saving tips for your next holiday."
      accentFrom="from-orange-700/95"
      accentVia="via-orange-600/80"
      topics={['Cheap Flights', 'Package Deals', 'Europe', 'UK Breaks', 'Tips']}
    />
  )
}
