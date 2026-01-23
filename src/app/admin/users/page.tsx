
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface User {
    uid: string;
    email: string;
    role: "user" | "admin";
    plan: "free" | "paid";
    createdAt: string;
    lastLoginAt?: string; // Should be added to DB model if we want to show it
}

export default function UsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchUsers = useCallback(async () => {
        if (!user?.firebaseUser) return;

        try {
            const res = await fetch("/api/admin/users", {
                headers: {
                    "x-user-uid": user.firebaseUser.uid,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [user?.firebaseUser]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUpdate = async (targetUid: string, field: "role" | "plan", value: string) => {
        if (!user?.firebaseUser) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-uid": user.firebaseUser.uid,
                },
                body: JSON.stringify({
                    targetUid,
                    [field]: value,
                }),
            });

            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u.uid === targetUid ? { ...u, [field]: value } : u))
                );
            }
        } catch (error) {
            console.error("Failed to update user", error);
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter === 'paid') return u.plan === 'paid';
        if (filter === 'free') return u.plan === 'free';
        if (filter === 'admin') return u.role === 'admin';
        return true;
    });

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your platform users and their subscription plans.</p>
                </div>
                <ButtonPrimary>Add New User</ButtonPrimary>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{users.length}</h3>
                        </div>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            +12%
                        </span>
                        <span className="text-gray-400 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Subscribers</p>
                            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                                {users.filter(u => u.plan === 'paid').length}
                            </h3>
                        </div>
                        <span className="p-2 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        65.5% conversion rate
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {users.filter(u => u.role === 'admin').length}
                            </h3>
                        </div>
                        <span className="p-2 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Signups</p>
                            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">18</h3>
                        </div>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        In the last 24 hours
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-neutral-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-2">
                        {['all', 'paid', 'free', 'admin'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-neutral-900/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Last Login</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                            {filteredUsers.map((u) => (
                                <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg dark:bg-primary-900/20 dark:text-primary-400">
                                                    {u.email[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {u.email.split('@')[0]}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleUpdate(u.uid, "role", e.target.value)}
                                            className="text-sm rounded-full px-3 py-1 border-gray-300 bg-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={u.plan}
                                            onChange={(e) => handleUpdate(u.uid, "plan", e.target.value)}
                                            className={`text-sm rounded-full px-3 py-1 font-medium border-0 focus:ring-2 ring-offset-1 focus:ring-primary-500 cursor-pointer ${u.plan === 'paid'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <option value="free">Free</option>
                                            <option value="paid">Pro</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors mx-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing 1 to {filteredUsers.length} of {filteredUsers.length} results
                    </p>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 dark:border-neutral-700 dark:text-gray-300">Previous</button>
                        <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm">1</button>
                        <button disabled className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 dark:border-neutral-700 dark:text-gray-300">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
