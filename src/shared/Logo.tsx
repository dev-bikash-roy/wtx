import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  size?: string
}

const Logo: React.FC<Props> = ({ className, size = 'h-12 w-auto sm:h-14', ...props }) => {
  return (
    <Link href="/" className={clsx('inline-block shrink-0', className)}>
      <img 
        src="https://wtxnews.com/wp-content/uploads/2025/09/WTX-News-Icon-1.png" 
        alt="WTX News" 
        className={clsx(size, 'object-contain')}
        {...props}
      />
    </Link>
  )
}

export default Logo