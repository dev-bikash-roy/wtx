import { Metadata } from 'next'
import TagPage from '@/components/TagPage'

export const metadata: Metadata = {
  title: 'Formula 1 News | WTX News',
  description: 'Latest Formula 1 news, race results, driver standings and team updates.',
  alternates: { canonical: 'https://wtxnews.co.uk/tag/formula-1' },
}
export const revalidate = 180

export default function Page() {
  return (
    <TagPage
      tag="formula-1"
      title="Formula 1"
      description="All the action from the F1 grid — race results, driver news, team updates and championship standings."
      accentFrom="from-red-800/95"
      accentVia="via-red-700/80"
      topics={['Race Results', 'Drivers', 'Teams', 'Championship', 'Technical']}
    />
  )
}
