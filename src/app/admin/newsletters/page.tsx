"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Subscriber {
    id: string;
    email: string;
    createdAt: Timestamp | null;
}

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const q = query(collection(db, "newsletters"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data: Subscriber[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Subscriber);
                });
                setSubscribers(data);
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
                    Newsletter Subscribers
                </h1>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                    Total: {subscribers.length}
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Email</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Subscribed Date</th>
                                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-neutral-500 dark:text-neutral-400">
                                        No subscribers found yet.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                                            {sub.createdAt?.toDate().toLocaleDateString()} {sub.createdAt?.toDate().toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Placeholder for future actions like delete */}
                                            <span className="text-neutral-400 text-xs">...</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
