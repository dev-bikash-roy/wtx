import Image from 'next/image'

const TheContent = ({ content }: { content: string }) => {
  // Use the actual content instead of lorem ipsum
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )
}

export default TheContent
