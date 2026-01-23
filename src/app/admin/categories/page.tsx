"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";

interface Category {
    slug: string;
    name: string;
    count?: number;
    accessLevel: "free" | "paid";
}

export default function CategoriesPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        if (!user?.firebaseUser) return;

        try {
            const res = await fetch("/api/admin/categories", {
                headers: {
                    "x-user-uid": user.firebaseUser.uid,
                },
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

    const handleUpdate = async (slug: string, field: "accessLevel", value: string) => {
        if (!user?.firebaseUser) return;

        try {
            const res = await fetch("/api/admin/categories", {
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
                setCategories((prev) =>
                    prev.map((c) => (c.slug === slug ? { ...c, [field]: value as "free" | "paid" } : c))
                );
            }
        } catch (error) {
            console.error("Failed to update category", error);
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Category Management</h2>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full bg-white dark:bg-neutral-800">
                    <thead>
                        <tr className="border-b bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Slug</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Access Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {categories.map((cat) => (
                            <tr key={cat.slug} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                    {cat.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {cat.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={cat.accessLevel || 'free'}
                                        onChange={(e) => handleUpdate(cat.slug, "accessLevel", e.target.value)}
                                        className="rounded border-gray-300 bg-white text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                                    >
                                        <option value="free">Free</option>
                                        <option value="paid">Premium</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
