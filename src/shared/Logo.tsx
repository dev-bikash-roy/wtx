import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  size?: string
}

const Logo: React.FC<Props> = ({ className, size = 'h-12 w-auto sm:h-14' }) => {
  return (
    <Link href="/" className={clsx('inline-block shrink-0', className)}>
      <div className={clsx(size, 'relative')}>
        <Image
          src="https://wtxnews.com/wp-content/uploads/2025/12/WTX-News-Icon-1.png"
          alt="WTX News"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  )
}

export default Logo