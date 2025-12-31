

import OpenAI from 'openai'
import { getTags } from '@/data/categories'


export interface AnalyzedTag {
    id: string
    name: string
    handle: string
    count: number
    isTrending: boolean
    relatedQuestion?: string
}

export async function analyzeTags(): Promise<AnalyzedTag[]> {
    try {
        // Initialize OpenAI client
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY not set, skipping tag analysis')
            return []
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        // 1. Fetch tags from WordPress
        const tags = await getTags()

        if (!tags || tags.length === 0) return []

        // 2. Prepare data for AI
        const tagData = tags.map(t => ({ id: t.id, name: t.name, count: t.count }))

        // 3. Ask AI to analyze
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Analyze the following website tags. 
          1. Identify the top 5 trending tags based on count and relevance.
          2. For each trending tag, generate a short, commonly asked question related to it (e.g., for "Bitcoin" -> "Is Bitcoin a good investment?").
          
          Return ONLY a JSON array with objects: { id, relatedQuestion, isTrending }.`
                },
                {
                    role: 'user',
                    content: JSON.stringify(tagData.slice(0, 50)) // Limit input
                }
            ],
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(response.choices[0].message.content || '{"tags": []}')
        const aiResults: { id: string | number, relatedQuestion: string, isTrending: boolean }[] = result.tags || result

        // 4. Merge results
        return tags.map(tag => {
            const aiAnalysis = aiResults.find((r: any) => String(r.id) === String(tag.id) || r.name === tag.name)
            return {
                id: tag.id,
                name: tag.name,
                handle: tag.handle,
                count: tag.count || 0,
                isTrending: aiAnalysis ? aiAnalysis.isTrending : false,
                relatedQuestion: aiAnalysis ? aiAnalysis.relatedQuestion : undefined
            }
        }).sort((a, b) => (b.isTrending === a.isTrending ? 0 : b.isTrending ? 1 : -1))

    } catch (error) {
        console.error('Error analyzing tags:', error)
        return []
    }
}
