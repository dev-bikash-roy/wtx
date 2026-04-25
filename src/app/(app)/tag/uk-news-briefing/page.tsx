import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'UK News Briefing | WTX News',
  description: 'Your daily UK news briefing — the top stories you need to know.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/uk-news-briefing' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="uk-news-briefing"
      fallbackTag="uk-politics"
      fallbackCategory="uk-news"
      title="UK News Briefing"
      description="Your essential daily briefing on the biggest UK stories — concise, clear and up to date."
      accentFrom="from-neutral-800/95"
      accentVia="via-neutral-700/80"
      topics={[
        { label: 'Main Headlines', slug: 'main-headlines' },
        { label: 'UK Politics', slug: 'uk-politics' },
        { label: 'UK News', slug: 'uk-news' },
        { label: 'Daily Briefing', slug: 'daily-news-briefing' },
      ]}
    />
  )
}
