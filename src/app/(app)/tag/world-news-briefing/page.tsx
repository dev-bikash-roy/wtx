import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'World News Briefing | WTX News',
  description: 'Your daily world news briefing — the top international stories you need to know.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/world-news-briefing' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="world-news-briefing"
      title="World News Briefing"
      description="The most important international stories of the day, summarised and delivered clearly."
      accentFrom="from-teal-800/95"
      accentVia="via-teal-700/80"
      topics={['Global', 'Conflict', 'Climate', 'Economy']}
    />
  )
}
