
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { generateSummary } from '../src/lib/ai-summary'
import dbConnect from '../src/db/connection'
import Post from '../src/db/models/Post'

async function verify() {
    console.log('1. Testing Database Connection...')
    try {
        await dbConnect()
        console.log('✅ Database connected')
    } catch (e) {
        console.error('❌ Database connection failed:', e)
    }

    console.log('\n2. Testing OpenAI Summary Generation...')
    const dummyContent = `
    Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.
    React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.
    React can be used as a base in the development of single-page or mobile applications.
  `

    try {
        const summary = await generateSummary(dummyContent)
        if (summary) {
            console.log('✅ Summary generated:', summary)
        } else {
            console.error('❌ Summary generation failed (returned null)')
        }
    } catch (e) {
        console.error('❌ Summary generation threw error:', e)
    }

    console.log('\n3. Testing Post Model...')
    try {
        if (Post) {
            console.log('✅ Post model loaded')
        } else {
            console.error('❌ Post model failed to load')
        }
    } catch (e) {
        console.error('❌ Post model error:', e)
    }

    process.exit(0)
}

verify()
