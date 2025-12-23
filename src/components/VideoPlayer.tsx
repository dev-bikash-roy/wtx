import { FC } from 'react'

interface VideoPlayerProps {
    className?: string
    src?: string // Optional src in case it gets updated later
}

const VideoPlayer: FC<VideoPlayerProps> = ({ className }) => {
    return (
        <div className={`video-player-placeholder flex items-center justify-center bg-black text-white ${className}`}>
            <p>Video Player (Placeholder)</p>
        </div>
    )
}

export default VideoPlayer
