'use client'

import { FC, useMemo } from 'react'

interface Props {
  date: string
  className?: string
  options?: Intl.DateTimeFormatOptions
}

const LocalDate: FC<Props> = ({ date, className, options = { month: 'short', day: 'numeric', year: 'numeric' } }) => {
  const formattedDate = useMemo(() => {
    return new Date(date).toLocaleDateString('en-US', options)
  }, [date, options])

  return (
    <time dateTime={date} className={className}>
      {formattedDate}
    </time>
  )
}

export default LocalDate