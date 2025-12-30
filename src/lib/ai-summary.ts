
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSummary(content: string): Promise<string | null> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY is not set')
        return null
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful news editor. Generate a concise TL;DR summary (max 3 sentences) for the following article content. Focus on the main facts and outcome.',
                },
                {
                    role: 'user',
                    content: content.substring(0, 10000), // Limit input size
                },
            ],
            max_tokens: 150,
            temperature: 0.5,
        })

        return response.choices[0].message.content
    } catch (error) {
        console.error('Error generating AI summary:', error)
        return null
    }
}
