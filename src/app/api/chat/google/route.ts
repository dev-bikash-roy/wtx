
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

// Initialize Gemini
// Ensure GOOGLE_API_KEY is allowed in your Next.js config or environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages, context } = body

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: 'GOOGLE_API_KEY is not set' },
                { status: 500 }
            )
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const lastMessage = messages[messages.length - 1]

        // Construct prompt with context
        const prompt = `
      You are a helpful news assistant for WTX News. 
      You are answering questions based on the following news articles currently visible to the user:
      
      ${context.map((p: any) => `- Title: ${p.title}\n  Summary: ${p.content}\n  Slug: ${p.handle || p.slug}`).join('\n\n')}
      
      User Question: ${lastMessage.content}

      Instructions:
      1. Answer the question based ONLY on the provided context.
      2. If you use information from an article, include it as a reference.
      3. Return your response in this strict JSON format (no markdown formatting):
      {
        "answer": "Your direct answer here...",
        "references": [
          { "title": "Article Title", "url": "/post/article-slug" }
        ]
      }
    `
        const result = await model.generateContent(prompt)
        const response = await result.response
        let text = response.text()

        // Clean up if the model adds markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim()

        const jsonResponse = JSON.parse(text)

        return NextResponse.json(jsonResponse)
    } catch (error: any) {
        console.error('Error in Gemini Chat API:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        )
    }
}

