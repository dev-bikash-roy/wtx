import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Hiking | WTX News',
  description: 'Hiking guides, trail news and outdoor adventure stories from across the UK.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/hiking' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="hiking"
      title="Hiking"
      description="Trail guides, walking routes, gear reviews and outdoor adventure stories from across the UK and beyond."
      accentFrom="from-green-700/95"
      accentVia="via-green-600/80"
      topics={['UK Trails', 'National Parks', 'Gear', 'Safety', 'Wild Camping']}
    />
  )
}
