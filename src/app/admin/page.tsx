"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  freeUsers: number;
  totalPosts: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.firebaseUser) return;

    try {
      const res = await fetch("/api/admin/stats", {
        headers: {
          "x-user-uid": user.firebaseUser.uid,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error("Stats fetch failed", await res.text());
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  }, [user?.firebaseUser]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div>
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded dark:bg-neutral-700 mb-2 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded dark:bg-neutral-700 w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your platform&apos;s performance.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            View Site
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Users */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded dark:bg-green-900/20 dark:text-green-400">
            +5% from last month
          </p>
        </div>

        {/* Paid Subscribers */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Subscribers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.paidUsers || 0}
              </p>
            </div>
            <span className="p-2 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/20 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded dark:bg-green-900/20 dark:text-green-400">
            Current Active
          </p>
        </div>

        {/* Free Users */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Free Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.freeUsers || 0}
              </p>
            </div>
            <span className="p-2 bg-gray-50 text-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded dark:bg-gray-800 dark:text-gray-400">
            Potential conversions
          </p>
        </div>

        {/* Total Posts */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalPosts || 0}
              </p>
            </div>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded dark:bg-purple-900/20 dark:text-purple-400">
            Across all categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/users" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">Manage Users</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/admin/posts" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">Manage Posts</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/admin/categories" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">Manage Categories</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New user registration</p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">A new user just signed up via Google.</p>
                  <p className="text-xs text-gray-400 mt-2">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}