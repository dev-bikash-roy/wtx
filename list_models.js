
const fs = require('fs');
const path = require('path');

function getEnvValue(key) {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts[0].trim() === key) {
                    return parts.slice(1).join('=').trim();
                }
            }
        }
    } catch (e) {
        console.error("Error reading .env:", e);
    }
    return process.env[key];
}

async function listModels() {
    const apiKey = getEnvValue("GOOGLE_API_KEY");

    if (!apiKey) {
        console.error("GOOGLE_API_KEY is not set.");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        }
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${model.name}`);
            }
        });

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
