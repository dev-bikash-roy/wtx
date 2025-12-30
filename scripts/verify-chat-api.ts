
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

async function verifyChatApi() {
    console.log('Testing /api/chat endpoint...')

    const payload = {
        message: "Summarize this brief text.",
        context: "WTX News is a global news platform covering politics, sports, and lifestyle. It aims to provide unbiased reporting."
    }

    try {
        // We can't fetch localhost:3000 from here easily if the server is running in a different process, 
        // but the user environment usually allows curl or similar. 
        // Actually, I can import the POST function directly if I mock the request, 
        // BUT the environment variables might be an issue if next/server isn't mocked.
        // Let's try to use the fetch to localhost:3000 assuming the dev server is running.

        // Note: The previous tools showed 'npm run dev' is running.
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (response.ok) {
            const data = await response.json()
            console.log('✅ API Response:', data)
        } else {
            console.error('❌ API Error:', response.status, response.statusText)
            const text = await response.text()
            console.error('Body:', text)
        }

    } catch (e) {
        console.error('❌ Verification failed:', e)
    }
}

verifyChatApi()
