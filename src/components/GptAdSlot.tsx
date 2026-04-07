'use client'

interface GptAdSlotProps {
  slotId: string
  className?: string
}

export default function GptAdSlot({ slotId, className = '' }: GptAdSlotProps) {
  return (
    <div className={`gpt-ad-container flex justify-center ${className}`}>
      <div id={slotId}>
        <script
          dangerouslySetInnerHTML={{
            __html: `googletag.cmd.push(function() { googletag.display('${slotId}'); });`,
          }}
        />
      </div>
    </div>
  )
}
