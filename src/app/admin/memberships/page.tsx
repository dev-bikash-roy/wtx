"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { PLANS } from "@/lib/paddle/config";
import type { MembershipPlan } from "@/contexts/AuthContext";

interface MemberUser {
  uid: string;
  email: string;
  displayName?: string;
  plan: MembershipPlan;
  subscriptionStatus?: string;
  paddleSubscriptionId?: string;
  createdAt: string;
  subscriptionExpiresAt?: string;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300",
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  premium: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  past_due: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  paused: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function AdminMembershipsPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!user?.firebaseUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        headers: { "x-user-uid": user.firebaseUser.uid },
      });
      if (res.ok) {
        const data: MemberUser[] = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  }, [user?.firebaseUser]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handlePlanChange = async (uid: string, plan: MembershipPlan) => {
    if (!user?.firebaseUser) return;
    setUpdating(uid);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": user.firebaseUser.uid,
        },
        body: JSON.stringify({ targetUid: uid, plan }),
      });
      if (res.ok) {
        setMembers((prev) => prev.map((m) => (m.uid === uid ? { ...m, plan } : m)));
      }
    } catch (err) {
      console.error("Failed to update plan", err);
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: members.length,
    free: members.filter((m) => m.plan === "free").length,
    basic: members.filter((m) => m.plan === "basic").length,
    premium: members.filter((m) => m.plan === "premium").length,
  };

  const filtered = filterPlan === "all" ? members : members.filter((m) => m.plan === filterPlan);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Memberships</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-neutral-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Memberships</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage subscriber plans and view membership stats.
          </p>
        </div>
        <a
          href="https://vendors.paddle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Paddle Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Plan Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Members", value: counts.all, color: "text-gray-900 dark:text-white", bg: "bg-white dark:bg-neutral-800" },
          { label: "Free", value: counts.free, color: "text-gray-600 dark:text-gray-300", bg: "bg-white dark:bg-neutral-800" },
          { label: "Basic", value: counts.basic, color: "text-blue-600 dark:text-blue-400", bg: "bg-white dark:bg-neutral-800" },
          { label: "Premium", value: counts.premium, color: "text-purple-600 dark:text-purple-400", bg: "bg-white dark:bg-neutral-800" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-5 shadow-sm border border-gray-100 dark:border-neutral-700`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Plan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{plan.name}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{plan.price}<span className="text-sm font-normal text-gray-500">{plan.priceMonthly > 0 ? "/mo" : ""}</span></p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${PLAN_COLORS[plan.id]}`}>
                {counts[plan.id as keyof typeof counts]} users
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{plan.description}</p>
            {plan.paddlePriceId ? (
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 truncate">
                Price ID: {plan.paddlePriceId || "Not configured"}
              </p>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500">No Paddle price — free tier</p>
            )}
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-neutral-700 flex flex-wrap gap-2">
          {["all", "free", "basic", "premium"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterPlan(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterPlan === f
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600"
              }`}
            >
              {f} ({counts[f as keyof typeof counts] ?? members.length})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-neutral-900/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscription ID</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Change Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
              {filtered.map((m) => (
                <tr key={m.uid} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm flex-shrink-0">
                        {m.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {m.displayName || m.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${PLAN_COLORS[m.plan]}`}>
                      {m.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {m.subscriptionStatus ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[m.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {m.subscriptionStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {m.paddleSubscriptionId ? m.paddleSubscriptionId.slice(0, 20) + "…" : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={m.plan}
                      disabled={updating === m.uid}
                      onChange={(e) => handlePlanChange(m.uid, e.target.value as MembershipPlan)}
                      className="text-sm rounded-lg px-3 py-1.5 border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                    No members found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-700 text-sm text-gray-500 dark:text-gray-400">
          Showing {filtered.length} of {members.length} members
        </div>
      </div>
    </div>
  );
}
