import { TPost } from '@/data/posts'

/**
 * Takes multiple arrays of posts and returns them deduplicated globally.
 * Posts that appear in earlier arrays are removed from later arrays.
 * This prevents the same post showing in multiple sections on a page.
 */
export function dedupSections<T extends Pick<TPost, 'id'>>(
  ...sections: T[][]
): T[][] {
  const seen = new Set<string>()
  return sections.map(posts =>
    posts.filter(post => {
      if (seen.has(post.id)) return false
      seen.add(post.id)
      return true
    })
  )
}
