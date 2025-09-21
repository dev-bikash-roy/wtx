'use client'
import { TPost } from '@/data/posts'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useState } from 'react'
import CategoryBadgeList from '../CategoryBadgeList'
import NcImage from '../NcImage/NcImage'
import PostCardMeta3 from '../PostCardMeta/PostCardMeta3'
import PostCardSaveBtn from '../PostCardSaveBtn'
import PostFeaturedMedia from '../PostFeaturedMedia/PostFeaturedMedia'

interface Props {
  className?: string
  post: TPost
  galleryType?: 1 | 2
}

const Card10V3: FC<Props> = ({ className, post, galleryType = 1 }) => {
  const [isHover, setIsHover] = useState(false)
  
  // Check if post exists before destructuring
  if (!post) {
    return null;
  }
  
  const { title, handle, categories, postType, galleryImgs, author, date, readingTime, bookmarked } = post

  const renderGallery2 = () => {
    if (!galleryImgs) return null
    return (
      <div className="grid size-full grid-rows-2 gap-2">
        <div className="grid grid-cols-3 gap-2">
          <NcImage
            alt="gallery 1"
            fill
            containerClassName="relative col-span-2"
            src={galleryImgs[0]}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="size-full object-cover"
          />
          <NcImage
            alt="gallery 2"
            fill
            src={galleryImgs[1]}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="size-full object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <NcImage
            alt="gallery 3"
            fill
            src={galleryImgs[2]}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="size-full object-cover"
          />
          <NcImage
            alt="gallery 4"
            fill
            containerClassName="relative col-span-2"
            src={galleryImgs[3]}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="size-full object-cover"
          />
        </div>
      </div>
    )
  }

  const renderGallery = () => {
    if (!galleryImgs) return null
    return (
      <div className="grid size-full grid-cols-3 gap-2">
        <div className="grid">
          <NcImage alt="gallery 1" fill src={galleryImgs[0]} />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <NcImage alt="gallery 2" fill src={galleryImgs[1]} />
          <NcImage alt="gallery 3" fill src={galleryImgs[2]} />
        </div>
        <div className="grid">
          <NcImage alt="gallery 4" fill src={galleryImgs[3]} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx('group post-card-10-v3 relative flex flex-col', className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl sm:aspect-16/9">
        {postType !== 'gallery' || !galleryImgs?.length ? (
          <PostFeaturedMedia post={post} isHover={isHover} />
        ) : galleryType === 1 ? (
          renderGallery()
        ) : (
          renderGallery2()
        )}

        {postType === 'gallery' && galleryImgs?.length && (
          <Link
            href={`/post/${handle}`}
            className="absolute inset-0 bg-neutral-900/20 opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>

      <div className="absolute inset-x-3 top-3 flex items-start justify-between space-x-4">
        <CategoryBadgeList categories={categories} />
        <PostCardSaveBtn bookmarked={bookmarked} />
      </div>

      <div className="mt-4 space-y-4 px-4">
        <h2 className="block font-semibold text-neutral-900 sm:text-lg dark:text-neutral-100">
          <Link href={`/post/${handle}`} title={title}>
            {title}
          </Link>
        </h2>
        <PostCardMeta3 author={author} date={date} readingTime={readingTime} />
      </div>
    </div>
  )
}

export default Card10V3