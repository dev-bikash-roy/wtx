import LocalDate from '@/components/LocalDate'
import PaginationWrapper from '@/components/PaginationWrapper'
import { getAllPosts } from '@/data/posts'
import { Badge } from '@/shared/Badge'
import Image from 'next/image'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export const metadata = {
  title: 'Dashboard - Posts',
  description: 'Dashboard - Posts',
}

const Page = async () => {
  const posts = await getAllPosts()
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flow-root">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Link href="/dashboard/submit-post">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Create New Post
            </button>
          </Link>
        </div>
        
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 ps-3 pe-4 text-left text-sm font-semibold sm:ps-0 rtl:text-right">
                    Post
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold rtl:text-right">
                    Stats
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold rtl:text-right">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold rtl:text-right">
                    Date created
                  </th>
                  <th scope="col" className="relative py-3.5 ps-3 pe-4 sm:pe-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.slice(0, 10).map((post) => (
                  <tr key={post.id}>
                    <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                      <div className="flex items-center">
                        <div className="relative size-14 shrink-0">
                          <Image
                            alt={post.title}
                            src={post.featuredImage.src}
                            className="rounded-full object-cover"
                            fill
                            sizes="100px"
                          />
                        </div>
                        <div className="ms-4">
                          <div className="font-medium">{post.title}</div>
                          <div className="mt-1 text-gray-500 dark:text-gray-400">{post.categories[0]?.name || 'Uncategorized'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-5 text-sm whitespace-nowrap">
                      <div className="">{post.viewCount} views</div>
                      <div className="mt-1 text-gray-500 dark:text-gray-400">{post.commentCount} comments</div>
                    </td>

                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <Badge color={post.status === 'published' ? 'green' : 'red'}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <LocalDate date={post.date} />
                    </td>
                    <td className="relative py-5 ps-3 pe-4 text-right text-sm font-medium whitespace-nowrap sm:pe-0">
                      <Link href={`/dashboard/submit-post?edit=${post.id}`} className="underline">
                        Edit<span className="sr-only">, {post.title}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PaginationWrapper className="mt-16" />
      </div>
    </ProtectedRoute>
  )
}

export default Page