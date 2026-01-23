"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Post {
  slug: string;
  title: string;
  status: string;
  accessLevel: "free" | "paid";
  createdAt: string;
}

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user?.firebaseUser) return;

    try {
      const res = await fetch("/api/admin/posts", {
        headers: {
          "x-user-uid": user.firebaseUser.uid,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleUpdate = async (slug: string, field: "accessLevel", value: string) => {
    if (!user?.firebaseUser) return;

    try {
      const res = await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.firebaseUser.uid,
        },
        body: JSON.stringify({
          slug,
          [field]: value,
        }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
        );
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Post Management</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full bg-white dark:bg-neutral-800">
          <thead>
            <tr className="border-b bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Access Level</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white max-w-sm">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">/{post.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={post.accessLevel}
                    onChange={(e) => handleUpdate(post.slug, "accessLevel", e.target.value)}
                    className="rounded border-gray-300 bg-white text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Premium</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}