
const { getWordPressPostsByCategory } = require('./src/data/wordpress-posts');
const { fetchPostsByCategory } = require('./src/data/wp-api');

async function testFetch() {
    console.log('Testing fetch for explore UK categories...');

    const categories = [
        'todays-main-news-story-uk',
        'uk-news',
        'uk-politics'
    ];

    for (const cat of categories) {
        console.log(`Fetching ${cat}...`);
        try {
            // We'll try direct wp-api fetch first as it's the base
            // Note: we need to use the imported functions. Since this runs in node, we might have issues with 'fetch' if not polyfilled in older node, but next.js env usually has it.
            // Also imports in the codebase use TS and alias @, so running this raw with node `ts-node` is needed or simple fetch.

            // Let's just use a simple fetch to the endpoint to check connectivity and data
            const apiBase = 'https://wtxnews.com/wp-json/wp/v2';
            const catRes = await fetch(`${apiBase}/categories?slug=${cat}`);
            const catData = await catRes.json();

            if (catData.length === 0) {
                console.log(`[FAIL] Category ${cat} not found by slug.`);
            } else {
                console.log(`[OK] Category ${cat} found. ID: ${catData[0].id}`);
                const postsRes = await fetch(`${apiBase}/posts?categories=${catData[0].id}&per_page=3`);
                const postsData = await postsRes.json();
                console.log(`[INFO] ${cat} has ${postsData.length} posts.`);
            }
        } catch (e) {
            console.error(`[ERROR] Failed to fetch ${cat}:`, e.message);
        }
    }
}

testFetch();
