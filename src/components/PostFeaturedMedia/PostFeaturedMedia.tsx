import { TPost } from '@/data/posts'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon'
import GallerySlider from './GallerySlider'
import MediaAudio from './MediaAudio'
import MediaVideo from './MediaVideo'

interface Props {
  className?: string
  post: TPost
  isHover?: boolean
  priority?: boolean
}

const PostFeaturedMedia: FC<Props> = ({ className, post, isHover = false, priority = false }) => {
  const { featuredImage, postType, videoUrl, galleryImgs, audioUrl, handle, title } = post

  const renderPostGallery = () => {
    if (!galleryImgs) {
      return renderImage()
    }

    return <GallerySlider handle={handle} galleryImgs={galleryImgs} />
  }

  const renderPostVideo = () => {
    if (!videoUrl) {
      return (
        <>
          {renderImage()}
          <PostTypeFeaturedIcon
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            postType={postType}
          />
        </>
      )
    }

    return (
      <>
        {renderImage()}
        {!isHover && (
          <PostTypeFeaturedIcon
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            postType={postType}
          />
        )}
        <MediaVideo isHover={isHover} videoUrl={videoUrl} handle={handle} />
      </>
    )
  }

  const renderPostAudio = () => {
    return (
      <>
        {renderImage()}
        {audioUrl && <MediaAudio post={post} />}
        {!audioUrl && (
          <PostTypeFeaturedIcon
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            postType={postType}
          />
        )}
      </>
    )
  }

  const renderImage = () => {
    // Check if featuredImage exists and has a valid src
    if (!featuredImage?.src || featuredImage.src.trim() === "") {
      return null;
    }

    return (
      <Link href={`/news/${handle}`}>
        <Image
          alt={featuredImage.alt || title}
          fill
          className="object-cover"
          src={featuredImage.src}
          sizes="(max-width: 600px) 100vw, 50vw"
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          onError={(e) => {
            // Fallback to a default image if the original fails to load
            const target = e.target as HTMLImageElement;
            if (target.src !== 'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') {
              target.src = 'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
            }
          }}
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    )
  }

  return (
    <div className={clsx('relative size-full overflow-hidden', className)}>
      {postType === 'gallery' && renderPostGallery()}
      {postType === 'video' && renderPostVideo()}
      {postType === 'audio' && renderPostAudio()}
      {postType !== 'audio' && postType !== 'video' && postType !== 'gallery' && renderImage()}
    </div>
  )
}

export default PostFeaturedMedia
