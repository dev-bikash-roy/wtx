
import { NextResponse } from 'next/server'
import { analyzeTags } from '@/lib/ai-tags'

export async function GET() {
    try {
        const analyzedTags = await analyzeTags()
        return NextResponse.json(analyzedTags)
    } catch (error) {
        console.error('API Error analyzing tags:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
