import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'World News | WTX News',
  description: 'Latest world news and international stories from around the globe.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/world-news' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="world-news"
      title="World News"
      description="Breaking international news and global stories from every corner of the world."
      accentFrom="from-slate-800/95"
      accentVia="via-slate-700/80"
      topics={['Europe', 'Americas', 'Asia', 'Middle East', 'Africa']}
    />
  )
}
