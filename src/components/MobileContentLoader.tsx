'use client'

import { ReactNode, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
  delay?: number
}

// Component that defers loading content on mobile for better initial load
export default function MobileContentLoader({ children, delay = 1000 }: Props) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Check if mobile
    const isMobile = window.innerWidth < 768
    
    if (!isMobile) {
      // Desktop: load immediately
      setShouldLoad(true)
      return
    }

    // Mobile: defer loading
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!shouldLoad) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  return <>{children}</>
}
