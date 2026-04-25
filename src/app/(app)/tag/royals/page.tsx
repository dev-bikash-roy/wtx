import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Royals News | WTX News',
  description: 'Latest Royal Family news — King Charles, Prince William, Princess of Wales and the wider Royal Family.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/royals' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="royals"
      title="Royals"
      description="The latest news from the Royal Family — King Charles, the Prince and Princess of Wales, and the wider monarchy."
      accentFrom="from-yellow-700/95"
      accentVia="via-yellow-600/80"
      topics={[
        { label: 'Royal Family', slug: 'royal-family' },
        { label: 'King Charles', slug: 'king-charles' },
        { label: 'Prince William', slug: 'prince-william' },
        { label: 'Prince Harry', slug: 'prince-harry' },
      ]}
    />
  )
}
