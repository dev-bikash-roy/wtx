
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Fallback responses for common questions
const FALLBACK_RESPONSES = {
  // Greetings and basic interactions
  greetings: [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening"
  ],
  greetingResponse: "Hello! I'm the WTX News AI Assistant. I can help you understand this article better. What would you like to know?",

  // Common questions about articles
  commonQuestions: {
    "what is this about": "This article covers the latest news and developments. I can help explain specific parts if you'd like to ask about particular details.",
    "what can you do": "I can help you understand this article by answering questions about its content, explaining key points, and providing context about the topics discussed.",
    "who wrote this": "You can find the author information at the top or bottom of the article. I can help explain the content they've written.",
    "when was this published": "The publication date should be visible near the article title. I can help you understand the content and its relevance.",
    "is this true": "I can help you understand what the article says, but I'd recommend checking multiple reliable news sources for verification of current events.",
    "what happened": "Based on this article, I can explain the key events and developments mentioned. What specific aspect would you like me to clarify?",
    "why is this important": "This article covers newsworthy developments. I can help explain the significance of specific points mentioned in the content.",
    "what does this mean": "I can help explain any part of the article that might be unclear. Which specific section or term would you like me to clarify?",
    "can you summarize": "I can help highlight key points from the article. What particular aspect would you like me to focus on?",
    "tell me more": "I'd be happy to elaborate on any part of this article. What specific topic or section interests you most?"
  },

  // Helpful suggestions when no specific match
  helpfulSuggestions: [
    "I can help you understand this article better. Try asking:",
    "• What is the main point of this article?",
    "• Can you explain [specific topic] mentioned here?",
    "• What are the key facts in this story?",
    "• Why is this news important?",
    "• What happened according to this article?"
  ],

  // Error fallback
  errorFallback: "I'm having trouble connecting to my AI service right now, but I'm still here to help! I can assist with understanding this article. Try asking about specific topics mentioned in the content, and I'll do my best to provide helpful information based on common news patterns."
}

// Function to find the best fallback response
function getFallbackResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase().trim()
  
  // Check for greetings
  if (FALLBACK_RESPONSES.greetings.some(greeting => lowerMessage.includes(greeting))) {
    return FALLBACK_RESPONSES.greetingResponse
  }
  
  // Check for common questions
  for (const [question, answer] of Object.entries(FALLBACK_RESPONSES.commonQuestions)) {
    if (lowerMessage.includes(question.toLowerCase())) {
      return answer
    }
  }
  
  // Check for question words to provide contextual help
  if (lowerMessage.includes("what") || lowerMessage.includes("how") || lowerMessage.includes("why") || lowerMessage.includes("when") || lowerMessage.includes("where")) {
    return `I can help answer questions about this article. ${FALLBACK_RESPONSES.helpfulSuggestions.join('\n')}`
  }
  
  // Try to extract key topics from the article for a smart response
  if (context && context.length > 100) {
    const contextPreview = context.substring(0, 200).replace(/<[^>]*>/g, '').trim()
    return `I can help you understand this article about "${contextPreview}...". What specific aspect would you like me to explain?`
  }
  
  // Default helpful response
  return `${FALLBACK_RESPONSES.helpfulSuggestions.join('\n')}`
}

// Function to provide smart responses based on article content
function getSmartFallbackResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase()
  const lowerContext = context.toLowerCase()
  
  // Extract potential topics from context
  const topics = []
  
  // Common news topics
  const newsTopics = ['politics', 'sports', 'business', 'technology', 'health', 'entertainment', 'weather', 'breaking news']
  for (const topic of newsTopics) {
    if (lowerContext.includes(topic)) {
      topics.push(topic)
    }
  }
  
  // If asking about specific topics
  if (lowerMessage.includes('politics') && topics.includes('politics')) {
    return "This article discusses political developments. I can help explain the key political points mentioned in the content."
  }
  
  if (lowerMessage.includes('sports') && topics.includes('sports')) {
    return "This appears to be a sports-related article. I can help explain the sports news and developments covered here."
  }
  
  // If asking for summary or main points
  if (lowerMessage.includes('summary') || lowerMessage.includes('main point') || lowerMessage.includes('key point')) {
    return "I can help identify the main points of this article. The content covers several important aspects that I can break down for you."
  }
  
  return getFallbackResponse(message, context)
}

export async function POST(req: Request) {
    try {
        let body;
        try {
            body = await req.json()
        } catch (e) {
            console.error('❌ Error parsing JSON body:', e)
            return NextResponse.json({ 
                reply: "I had trouble understanding your message. Could you please rephrase your question about this article?"
            })
        }

        const { message, context } = body

        if (!message) {
            return NextResponse.json({ 
                reply: FALLBACK_RESPONSES.helpfulSuggestions.join('\n')
            })
        }

        if (!context) {
            return NextResponse.json({ 
                reply: "I can help you with questions about articles. Please make sure you're asking about a specific article."
            })
        }

        // Check if OpenAI API key is available
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            console.error("❌ OpenAI API Key is MISSING in process.env")
            return NextResponse.json({ 
                reply: getSmartFallbackResponse(message, context)
            })
        }

        // Try OpenAI API first
        try {
            const openai = new OpenAI({ apiKey })

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful AI assistant for WTX News website. 
                        Your goal is to answer user questions based ONLY on the provided article content.
                        If the answer is not in the article, politely say you don't know based on the current article.
                        Keep answers concise, helpful, and engaging.
                        Always be friendly and professional.
                        
                        Article Content:
                        ${context.substring(0, 15000)}`
                    },
                    {
                        role: 'user',
                        content: message,
                    },
                ],
                max_tokens: 300,
                temperature: 0.7,
            })

            const reply = completion.choices[0].message.content

            if (reply && reply.trim()) {
                return NextResponse.json({ reply })
            } else {
                // If OpenAI returns empty response, use fallback
                return NextResponse.json({ 
                    reply: getSmartFallbackResponse(message, context)
                })
            }

        } catch (openaiError: any) {
            console.error('❌ OpenAI API Error:', openaiError)
            
            // Return smart fallback response instead of error
            return NextResponse.json({ 
                reply: getSmartFallbackResponse(message, context)
            })
        }

    } catch (error: any) {
        console.error('❌ General API Error:', error)
        
        // Even if everything fails, provide a helpful response
        return NextResponse.json({
            reply: FALLBACK_RESPONSES.errorFallback
        })
    }
}
