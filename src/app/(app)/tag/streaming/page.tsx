import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Streaming News | WTX News',
  description: 'Latest streaming news — Netflix, Disney+, Prime Video, Apple TV+ and more.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/streaming' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="streaming"
      title="Streaming"
      description="What to watch, new releases, reviews and news from Netflix, Disney+, Prime Video and all the major platforms."
      accentFrom="from-violet-800/95"
      accentVia="via-violet-700/80"
      topics={['Netflix', 'Disney+', 'Prime Video', 'Apple TV+', 'BBC iPlayer']}
    />
  )
}
