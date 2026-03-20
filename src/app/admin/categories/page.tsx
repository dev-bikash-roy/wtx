"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";

type AccessLevel = "free" | "basic" | "premium";

interface Category {
  slug: string;
  name: string;
  count?: number;
  accessLevel: AccessLevel;
}

const ACCESS_COLORS: Record<AccessLevel, string> = {
  free: "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300",
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  premium: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const fetchCategories = useCallback(async () => {
    if (!user?.firebaseUser) return;
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { "x-user-uid": user.firebaseUser.uid },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  }, [user?.firebaseUser]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleUpdate = async (slug: string, value: AccessLevel) => {
    if (!user?.firebaseUser) return;
    // Optimistic update
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, accessLevel: value } : c)));
    try {
      await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.firebaseUser.uid,
        },
        body: JSON.stringify({ slug, accessLevel: value }),
      });
    } catch (error) {
      console.error("Failed to update category", error);
      fetchCategories(); // Revert on error
    }
  };

  // Sync categories from WordPress into Firestore
  const syncFromWordPress = async () => {
    if (!user?.firebaseUser) return;
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch(
        `https://wtxnews.com/wp-json/wp/v2/categories?per_page=100&hide_empty=true`,
        { headers: { "User-Agent": "WTXNews-Admin/1.0" } }
      );
      if (!res.ok) throw new Error(`WP API returned ${res.status}`);
      const wpCats: { id: number; name: string; slug: string; count: number }[] = await res.json();

      // Upsert each category into Firestore (preserve existing accessLevel)
      const existing = Object.fromEntries(categories.map((c) => [c.slug, c.accessLevel]));
      const upserts = wpCats.map((cat) =>
        fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-uid": user.firebaseUser.uid,
          },
          body: JSON.stringify({
            slug: cat.slug,
            name: cat.name,
            count: cat.count,
            accessLevel: existing[cat.slug] ?? "free",
          }),
        })
      );
      await Promise.all(upserts);
      await fetchCategories();
      setSyncMsg(`Synced ${wpCats.length} categories from WordPress.`);
    } catch (err: any) {
      setSyncMsg(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading categories...</div>;

  const counts = {
    free: categories.filter((c) => c.accessLevel === "free").length,
    basic: categories.filter((c) => c.accessLevel === "basic").length,
    premium: categories.filter((c) => c.accessLevel === "premium").length,
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Category Access Control</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Set which membership plan is required to read posts in each category.
          </p>
        </div>
        <button
          onClick={syncFromWordPress}
          disabled={syncing}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {syncing ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Sync from WordPress
        </button>
      </div>

      {syncMsg && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${syncMsg.startsWith("Sync failed") ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300" : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"}`}>
          {syncMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["free", "basic", "premium"] as AccessLevel[]).map((level) => (
          <div key={level} className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts[level]}</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ACCESS_COLORS[level]}`}>{level}</span>
          </div>
        ))}
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 text-center border border-gray-100 dark:border-neutral-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No categories yet. Sync from WordPress to get started.</p>
          <button onClick={syncFromWordPress} disabled={syncing} className="px-4 py-2 bg-black text-white rounded-lg text-sm dark:bg-white dark:text-black">
            Sync from WordPress
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-neutral-900/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Posts</th>
                <th className="px-6 py-4">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
              {categories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {cat.count ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={cat.accessLevel ?? "free"}
                      onChange={(e) => handleUpdate(cat.slug, e.target.value as AccessLevel)}
                      className={`text-sm rounded-lg px-3 py-1.5 border-0 font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer ${ACCESS_COLORS[cat.accessLevel ?? "free"]}`}
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
