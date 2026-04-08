'use client'

import { useEffect } from 'react'

interface GptAdSlotProps {
  slotId: string
  className?: string
}

declare global {
  interface Window {
    googletag: any
  }
}

export default function GptAdSlot({ slotId, className = '' }: GptAdSlotProps) {
  useEffect(() => {
    window.googletag = window.googletag || { cmd: [] }
    window.googletag.cmd.push(function () {
      window.googletag.display(slotId)
    })
  }, [slotId])

  return (
    <div className={`gpt-ad-container flex justify-center ${className}`}>
      <div id={slotId} />
    </div>
  )
}
