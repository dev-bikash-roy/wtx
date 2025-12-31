
'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Message {
    role: 'user' | 'assistant'
    content: string
    isOffline?: boolean
}

interface AIChatWidgetProps {
    postContent: string
}

// Smart fallback responses for when AI is unavailable
const SMART_RESPONSES = {
    greetings: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],

    responses: {
        greeting: "Hello! I'm here to help you understand this article better. What would you like to know?",

        whatCanYouDo: "I can help you with:\n• Understanding key points in this article\n• Explaining complex topics mentioned\n• Providing context about the news\n• Answering questions about the content\n\nWhat interests you most?",

        summary: "I can help you understand the main points of this article. What specific aspect would you like me to focus on?",

        explain: "I'd be happy to explain any part of this article. Which topic or section would you like me to clarify?",

        opinion: "I can help you understand what this article reports, but I'd recommend reading multiple sources to form your own opinion on current events.",

        facts: "This article contains several key facts and developments. What specific information are you looking for?",

        context: "I can provide context about topics mentioned in this article. What would you like to know more about?",

        default: "I'm here to help you understand this article! Try asking:\n• What is this article about?\n• Can you explain [specific topic]?\n• What are the key points?\n• Why is this important?"
    }
}

function getSmartResponse(message: string, postContent: string): string {
    const lowerMessage = message.toLowerCase().trim()

    // Greetings
    if (SMART_RESPONSES.greetings.some(greeting => lowerMessage.includes(greeting))) {
        return SMART_RESPONSES.responses.greeting
    }

    // What can you do
    if (lowerMessage.includes("what can you do") || lowerMessage.includes("what do you do") || lowerMessage.includes("help me")) {
        return SMART_RESPONSES.responses.whatCanYouDo
    }

    // Summary requests
    if (lowerMessage.includes("summary") || lowerMessage.includes("summarize") || lowerMessage.includes("main point")) {
        return SMART_RESPONSES.responses.summary
    }

    // Explanation requests
    if (lowerMessage.includes("explain") || lowerMessage.includes("what does") || lowerMessage.includes("what is")) {
        return SMART_RESPONSES.responses.explain
    }

    // Opinion requests
    if (lowerMessage.includes("opinion") || lowerMessage.includes("what do you think") || lowerMessage.includes("is this true")) {
        return SMART_RESPONSES.responses.opinion
    }

    // Facts requests
    if (lowerMessage.includes("facts") || lowerMessage.includes("what happened") || lowerMessage.includes("tell me about")) {
        return SMART_RESPONSES.responses.facts
    }

    // Context requests
    if (lowerMessage.includes("context") || lowerMessage.includes("background") || lowerMessage.includes("why")) {
        return SMART_RESPONSES.responses.context
    }

    // Try to extract article topics for smarter responses
    if (postContent) {
        const contentPreview = postContent.replace(/<[^>]*>/g, '').substring(0, 100).trim()
        if (contentPreview) {
            return `I can help you understand this article about "${contentPreview}...". What specific aspect would you like me to explain?`
        }
    }

    return SMART_RESPONSES.responses.default
}

export default function AIChatWidget({ postContent }: AIChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I can help you answer questions about this article. Ask away!' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOfflineMode, setIsOfflineMode] = useState(false)
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
                setIsOfflineMode(false) // Reset offline mode if API works
            } else {
                // Use smart fallback if API doesn't return a reply
                const smartResponse = getSmartResponse(userMessage, postContent)
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: smartResponse,
                    isOffline: true
                }])
                setIsOfflineMode(true)
            }
        } catch (error) {
            console.error('Chat error:', error)

            // Use smart fallback instead of generic error
            const smartResponse = getSmartResponse(userMessage, postContent)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: smartResponse,
                isOffline: true
            }])
            setIsOfflineMode(true)
        } finally {
            setIsLoading(false)
        }
    }

    // Quick suggestion buttons
    const quickSuggestions = [
        "What is this about?",
        "Key points?",
        "Why is this important?",
        "Can you explain more?"
    ]

    const handleQuickSuggestion = (suggestion: string) => {
        setInput(suggestion)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 overflow-hidden transition-all duration-300 origin-bottom-right">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <ChatBubbleLeftRightIcon className="size-5" />
                                {isOfflineMode && (
                                    <div className="absolute -top-1 -right-1 size-2 bg-yellow-400 rounded-full animate-pulse" />
                                )}
                            </div>
                            <span className="font-medium">Your Newsreader</span>
                            {isOfflineMode && (
                                <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full">Smart Mode</span>
                            )}
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
                                        : clsx(
                                            "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10 rounded-bl-none",
                                            msg.isOffline && "border-l-2 border-yellow-400"
                                        )
                                )}>
                                    {msg.isOffline && (
                                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                                            <SparklesIcon className="size-3" />
                                            <span>Smart Response</span>
                                        </div>
                                    )}
                                    <div className="whitespace-pre-line">{msg.content}</div>
                                </div>
                            </div>
                        ))}

                        {/* Quick Suggestions */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {quickSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickSuggestion(suggestion)}
                                        className="text-xs px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

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
                        {isOfflineMode && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
                                <SparklesIcon className="size-3" />
                                Using smart responses - AI service temporarily unavailable
                            </p>
                        )}
                    </form>
                </div>
            )}

            {/* TOGGLE BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 rounded-full bg-primary-600 p-4 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white dark:ring-neutral-900"
            >
                <div className="relative">
                    {isOpen ? (
                        <XMarkIcon className="size-6 sm:size-7" />
                    ) : (
                        <ChatBubbleLeftRightIcon className="size-6 sm:size-7" />
                    )}
                    {isOfflineMode && !isOpen && (
                        <div className="absolute -top-1 -right-1 size-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </div>
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 text-sm font-semibold pr-2">
                    {isOfflineMode ? 'Smart Reader' : 'Your Newsreader'}
                </span>
            </button>

        </div>
    )
}
