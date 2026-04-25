import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Fitness News | WTX News',
  description: 'Latest fitness news, workout tips, health trends and wellbeing advice.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/fitness' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="fitness"
      title="Fitness"
      description="Workout tips, fitness trends, gym news and expert wellbeing advice to keep you moving."
      accentFrom="from-cyan-700/95"
      accentVia="via-cyan-600/80"
      topics={[
        { label: 'Health & Wellness', slug: 'health-wellness' },
        { label: 'Health', slug: 'health' },
        { label: 'Sport', slug: 'sport' },
      ]}
    />
  )
}
