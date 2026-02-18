import Image from 'next/image'

const TheContent = ({ content }: { content: string }) => {
  console.log('[TheContent] Received content length:', content?.length || 0)
  console.log('[TheContent] Content preview:', content?.substring(0, 200))

  // Process the content to wrap Cliff Notes sections with special styling
  const processContent = (htmlContent: string) => {
    // Look for Cliff Notes sections and wrap them with our custom class
    // This regex finds h2 tags containing "Cliff Notes" and the following ul element
    const cliffNotesRegex = /(<h2[^>]*>[^<]*Cliff Notes[^<]*<\/h2>\s*<ul[^>]*>[\s\S]*?<\/ul>)/gi;

    return htmlContent.replace(cliffNotesRegex, '<div class="nc-content-cliff-notes">$1</div>');
  };

  // Use the processed content instead of raw content
  const processedContent = processContent(content || '');

  return (
    <div dangerouslySetInnerHTML={{ __html: processedContent }} />
  )
}

export default TheContent