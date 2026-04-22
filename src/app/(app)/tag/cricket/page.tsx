import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Cricket News | WTX News',
  description: 'Latest cricket news, Test matches, The Ashes, IPL and international cricket.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/cricket' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="cricket"
      title="Cricket"
      description="Comprehensive cricket coverage — England, The Ashes, Test cricket, T20 and international tournaments."
      accentFrom="from-amber-800/95"
      accentVia="via-amber-700/80"
      topics={['England', 'The Ashes', 'Test Cricket', 'T20', 'IPL']}
    />
  )
}
