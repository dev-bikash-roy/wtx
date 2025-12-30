
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { generateSummary } from '../src/lib/ai-summary'

async function verify() {
    console.log('Testing OpenAI Summary Generation...')
    const dummyContent = 'This is a test content for AI summary.'

    try {
        const summary = await generateSummary(dummyContent)
        console.log('Summary result:', summary)
    } catch (e) {
        console.error('Error:', e)
    }
}

verify()
