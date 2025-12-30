
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            console.error("❌ OpenAI API Key is MISSING in process.env")
            return NextResponse.json({ error: 'Server Configuration Error: API Key missing' }, { status: 500 })
        }

        // Initialize OpenAI client inside the handler
        const openai = new OpenAI({ apiKey })

        let body;
        try {
            body = await req.json()
        } catch (e) {
            console.error('❌ Error parsing JSON body:', e)
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        const { message, context } = body

        if (!message || !context) {
            return NextResponse.json({ error: 'Message and context are required' }, { status: 400 })
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful AI assistant for a news website. 
          Your goal is to answer user questions based ONLY on the provided article content.
          If the answer is not in the article, politely say you don't know based on the current article.
          Keep answers concise and relevant.
          
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

        return NextResponse.json({ reply })
    } catch (error: any) {
        console.error('❌ OpenAI API Error Triggered:', error)
        if (error.response) {
            console.error('OpenAI Response Status:', error.response.status)
            console.error('OpenAI Response Data:', error.response.data)
        }
        // Return the actual error message to the client for debugging
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message || 'Unknown error'
        }, { status: 500 })
    }
}
