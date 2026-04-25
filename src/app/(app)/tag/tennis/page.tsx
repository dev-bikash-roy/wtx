import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Tennis News | WTX News',
  description: 'Latest tennis news, Wimbledon, Grand Slams, ATP and WTA tour updates.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/tennis' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="tennis"
      title="Tennis"
      description="Tennis news from Wimbledon, the Grand Slams, ATP and WTA tours — results, rankings and player news."
      accentFrom="from-lime-700/95"
      accentVia="via-lime-600/80"
      topics={[
        { label: 'Wimbledon', slug: 'wimbledon' },
        { label: 'Emma Raducanu', slug: 'emma-raducanu' },
        { label: 'Novak Djokovic', slug: 'novak-djokovic' },
        { label: 'Andy Murray', slug: 'andy-murray' },
      ]}
    />
  )
}
