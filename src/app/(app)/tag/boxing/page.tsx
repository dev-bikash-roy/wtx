import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Boxing News | WTX News',
  description: 'Latest boxing news, fight results, world title bouts and British boxing.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/boxing' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="boxing"
      title="Boxing"
      description="Fight night coverage, world title bouts, British boxing stars and the latest from the ring."
      accentFrom="from-orange-800/95"
      accentVia="via-orange-700/80"
      topics={['World Titles', 'British Boxing', 'Fight Results', 'Heavyweight', 'Undercards']}
    />
  )
}
