import { TPost } from '@/data/posts'

/**
 * Normalize a title/slug for duplicate detection.
 * Lowercases, strips trailing ellipsis, removes punctuation and collapses whitespace
 * so that "Police defend use of Tasers…" and "Police defend use of Tasers" match.
 */
function normalizeKey(value: string | undefined | null): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .replace(/[……]/g, '') // ellipsis
    .replace(/[^\p{L}\p{N}\s]/gu, '') // strip punctuation, keep letters/numbers
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Remove duplicate posts.
 *
 * A post is considered a duplicate if it shares the same id, the same handle/slug,
 * or the same normalized title as a post already kept. The FIRST occurrence wins
 * (callers should pass posts pre-sorted newest-first), so the freshest copy survives.
 */
export function dedupePosts(posts: (TPost | null | undefined)[]): TPost[] {
  const seenIds = new Set<string>()
  const seenHandles = new Set<string>()
  const seenTitles = new Set<string>()
  const result: TPost[] = []

  for (const post of posts) {
    if (!post) continue

    const id = String(post.id ?? '')
    const handleKey = normalizeKey(post.handle)
    const titleKey = normalizeKey(post.title)

    if (id && seenIds.has(id)) continue
    if (handleKey && seenHandles.has(handleKey)) continue
    if (titleKey && seenTitles.has(titleKey)) continue

    if (id) seenIds.add(id)
    if (handleKey) seenHandles.add(handleKey)
    if (titleKey) seenTitles.add(titleKey)
    result.push(post)
  }

  return result
}
