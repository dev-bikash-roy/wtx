'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load ReactPlayer - it's a heavy library
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
      <div className="animate-pulse text-neutral-500">Loading video...</div>
    </div>
  ),
})

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    setIsRendered(true)
  }, [])

  return (
    <div className="container">
      <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-neutral-200 bg-neutral-800 sm:aspect-16/9 dark:border-neutral-700">
        {isRendered ? (
          <ReactPlayer
            url={videoUrl}
            className="absolute inset-0 rounded-3xl"
            playing={true}
            width="100%"
            height="100%"
            controls
            muted
          />
        ) : null}
      </div>
    </div>
  )
}

export default VideoPlayer
