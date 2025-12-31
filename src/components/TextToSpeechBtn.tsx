
'use client'

import { SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/solid'
import { FC, useEffect, useState } from 'react'

interface TextToSpeechBtnProps {
    text: string
    className?: string
}

const TextToSpeechBtn: FC<TextToSpeechBtnProps> = ({ text, className = '' }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

    useEffect(() => {
        // Only support if browser has speech synthesis
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text)
            u.onend = () => setIsPlaying(false)
            setUtterance(u)
        }
    }, [text])

    const handleSpeak = () => {
        if (!utterance) return

        if (isPlaying) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
        } else {
            window.speechSynthesis.cancel() // Clear queue
            window.speechSynthesis.speak(utterance)
            setIsPlaying(true)
        }
    }

    if (!utterance) return null // Hide if not supported

    return (
        <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${isPlaying
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                } ${className}`}
            title={isPlaying ? "Stop reading" : "Read aloud"}
        >
            {isPlaying ? (
                <StopIcon className="size-4" />
            ) : (
                <SpeakerWaveIcon className="size-4" />
            )}
            {isPlaying ? 'Stop' : 'Listen'}
        </button>
    )
}

export default TextToSpeechBtn
