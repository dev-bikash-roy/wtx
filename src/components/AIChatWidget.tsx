
'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface AIChatWidgetProps {
    postContent: string
}

export default function AIChatWidget({ postContent }: AIChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I can help you answer questions about this article. Ask away!' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, context: postContent }),
            })

            const data = await response.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your connection.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 overflow-hidden transition-all duration-300 origin-bottom-right">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="size-5" />
                            <span className="font-medium">WTX AI Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 hover:bg-white/20 transition-colors">
                            <XMarkIcon className="size-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={clsx(
                                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary-600 text-white rounded-br-none"
                                        : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10 rounded-bl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                                    <div className="flex gap-1">
                                        <span className="size-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="size-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="size-2 bg-neutral-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about this article..."
                                className="w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary-500 placeholder-neutral-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-1.5 rounded-lg bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                            >
                                <PaperAirplaneIcon className="size-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TOGGLE BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 rounded-full bg-primary-600 p-4 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white dark:ring-neutral-900"
            >
                {isOpen ? (
                    <XMarkIcon className="size-6 sm:size-7" />
                ) : (
                    <ChatBubbleLeftRightIcon className="size-6 sm:size-7" />
                )}
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 text-sm font-semibold pr-2">
                    Ask AI
                </span>
            </button>

        </div>
    )
}
