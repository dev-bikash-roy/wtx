'use client'

import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import clsx from 'clsx'

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  className?: string
  placeholder?: string
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = '',
  onChange,
  className,
  placeholder = 'Write something...'
}) => {
  const [isClient, setIsClient] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    setIsClient(true)
    
    return () => {
      editor?.destroy()
    }
  }, [editor])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!isClient) {
    return (
      <div className={clsx('min-h-[200px] rounded-md border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-neutral-800', className)}>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className={clsx('rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-neutral-800', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 p-2 dark:border-gray-600">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive('bold') 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium italic',
            editor.isActive('italic') 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive('underline') 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          <u>U</u>
        </button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          H2
        </button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={clsx(
            'rounded px-2 py-1 text-sm font-medium',
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          Right
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 min-h-[300px] p-4 focus:outline-none dark:text-white" 
      />
    </div>
  )
}

export default TiptapEditor