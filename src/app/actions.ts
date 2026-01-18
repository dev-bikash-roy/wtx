'use server'

import { fetchPostsByCategory, fetchPostsByTag } from '@/data/wp-api'

export async function fetchPostsByCategoryAction(categorySlug: string) {
    try {
        const posts = await fetchPostsByCategory(categorySlug, 5) // Fetch 5 posts as per SectionMagazine1 layout
        return posts
    } catch (error) {
        console.error('Error fetching posts in action:', error)
        return []
    }
}

export async function fetchPostsByTagAction(tagSlug: string) {
    try {
        const posts = await fetchPostsByTag(tagSlug, 5) // Fetch 5 posts as per SectionMagazine6 layout
        return posts
    } catch (error) {
        console.error('Error fetching posts by tag in action:', error)
        return []
    }
}
