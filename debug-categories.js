
// Standalone script, no imports
async function check() {
    const fetch = global.fetch; // Use node fetch
    const apiBase = 'https://wtxnews.com/wp-json/wp/v2';
    const slugs = ['todays-main-news-story-uk', 'uk-news', 'uk-politics'];

    console.log('Checking slugs:', slugs);

    for (const slug of slugs) {
        try {
            const url = `${apiBase}/categories?slug=${slug}`;
            console.log('Fetching:', url);
            const r = await fetch(url);
            if (!r.ok) {
                console.log(`Error ${r.status}`);
                continue;
            }
            const data = await r.json();
            if (data.length === 0) {
                console.log(`[FAIL] Slug '${slug}' not found.`);
            } else {
                console.log(`[OK] Slug '${slug}' found. ID: ${data[0].id}`);
                // Check posts
                const pUrl = `${apiBase}/posts?categories=${data[0].id}&per_page=1`;
                const pr = await fetch(pUrl);
                const pData = await pr.json();
                console.log(`   -> Found ${pData.length} posts.`);
            }
        } catch (e) {
            console.log('Error:', e.message);
        }
    }
}

check();
