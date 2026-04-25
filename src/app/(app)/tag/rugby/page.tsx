import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Rugby News | WTX News',
  description: 'Latest rugby news — Six Nations, Premiership, World Cup and international rugby.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/rugby' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="rugby"
      title="Rugby"
      description="Rugby union and league news — Six Nations, Premiership, World Cup and all the latest from the pitch."
      accentFrom="from-emerald-800/95"
      accentVia="via-emerald-700/80"
      topics={[
        { label: 'Six Nations', slug: 'six-nations' },
        { label: 'England Rugby', slug: 'england-rugby' },
        { label: 'Sport', slug: 'sport' },
      ]}
    />
  )
}
