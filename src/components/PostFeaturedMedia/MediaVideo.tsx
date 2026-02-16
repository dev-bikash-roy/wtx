'use client'

import { Link } from '@/shared/link'
import SpinLoading from '@/shared/spin-loading'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type ReactPlayerType from 'react-player'

// Lazy load ReactPlayer - heavy library
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <SpinLoading />,
})

interface Props {
  videoUrl: string
  isHover: boolean
  handle: string
}

const MediaVideo: FC<Props> = ({ videoUrl, isHover, handle }) => {
  const [isMuted, setIsMuted] = useState(true)
  const [showDescUnmuted, setShowDescUnmuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  let __timeOut: NodeJS.Timeout | null = null
  const playerRef = useRef<ReactPlayerType | null>(null)

  useEffect(() => {
    if (isHover) {
      setIsRendered(true)
      playerRef.current?.seekTo(0, 'seconds')
    }
  }, [isHover])

  useEffect(() => {
    return () => {
      __timeOut && clearTimeout(__timeOut)
    }
  }, [__timeOut])

  return (
    <div className={clsx('absolute inset-0', isHover ? 'opacity-100' : 'opacity-0')}>
      {isRendered && (
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          muted={isMuted}
          playing={isHover}
          style={{
            opacity: isPlaying ? 1 : 0,
          }}
          className="absolute inset-0 bg-neutral-900 transition-opacity"
          width="100%"
          height="100%"
          onStart={() => {
            setIsPlaying(true)
            __timeOut && clearTimeout(__timeOut)
            __timeOut = setTimeout(() => {
              setShowDescUnmuted(false)
            }, 2500)
          }}
        />
      )}

      <Link
        href={`/news/${handle}`}
        className={clsx('absolute inset-0 flex items-center justify-center', isPlaying ? 'opacity-0' : 'opacity-100')}
      >
        <SpinLoading />
      </Link>

      {isPlaying && (
        <div
          className={clsx(
            'absolute start-2 bottom-2 flex h-6 items-center justify-center rounded-full bg-black/70 text-sm text-white transition-transform',
            showDescUnmuted ? 'ps-1.5 pe-2' : 'w-6 hover:scale-125'
          )}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <>
              <SpeakerXMarkIcon className="size-3.5" />
              {showDescUnmuted && <span className="ms-1 inline-block text-[9px]">Click here to unmute</span>}
            </>
          ) : (
            <SpeakerWaveIcon className="size-3.5" />
          )}
        </div>
      )}
    </div>
  )
}

export default MediaVideo
