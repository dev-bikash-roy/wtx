"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface Props {
  postCategories: { handle: string; name: string }[];
  children: React.ReactNode;
}

type AccessLevel = "free" | "basic" | "premium";

export default function PremiumGuard({ postCategories, children }: Props) {
  const { user, loading } = useAuth();
  const [requiredPlan, setRequiredPlan] = useState<AccessLevel | null>(null);
  const [checking, setChecking] = useState(true);

  const categoryHandles = useMemo(
    () => postCategories.map((cat) => cat.handle).join(","),
    [postCategories]
  );

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("/api/categories/permissions", { signal: controller.signal });
        clearTimeout(timeoutId);

        const permissions: Record<string, string> = res.ok ? await res.json() : {};

        // Find the highest required plan for this post's categories
        let required: AccessLevel | null = null;
        for (const cat of postCategories) {
          const perm = permissions[cat.handle];
          if (perm === "premium") { required = "premium"; break; }
          if (perm === "basic") required = "basic";
        }
        setRequiredPlan(required);
      } catch {
        // On error, default to open access
      } finally {
        setChecking(false);
      }
    };

    if (!loading) checkAccess();
  }, [user, loading, categoryHandles, postCategories]);

  if (loading || checking) {
    return <div className="animate-pulse p-4 text-neutral-400">Checking access...</div>;
  }

  // No restriction
  if (!requiredPlan) return <>{children}</>;

  const userPlan = user?.profile?.plan ?? "free";
  const planRank: Record<string, number> = { free: 0, basic: 1, premium: 2 };
  const hasAccess = planRank[userPlan] >= planRank[requiredPlan];

  if (hasAccess) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-100 p-12 text-center dark:bg-neutral-800">
      <div className="mb-4 text-5xl">🔒</div>
      <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {requiredPlan === "premium" ? "Premium" : "Basic"} Content
      </h2>
      <p className="mb-6 max-w-sm text-neutral-600 dark:text-neutral-400">
        {user
          ? `This article requires a ${requiredPlan} plan or higher. Upgrade to keep reading.`
          : "This article is for subscribers only. Sign in or create an account to continue."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {!user ? (
          <>
            <Link href="/login">
              <ButtonPrimary>Sign In</ButtonPrimary>
            </Link>
            <Link href="/pricing">
              <ButtonPrimary className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                View Plans
              </ButtonPrimary>
            </Link>
          </>
        ) : (
          <Link href="/pricing">
            <ButtonPrimary>Upgrade Plan</ButtonPrimary>
          </Link>
        )}
      </div>
    </div>
  );
}
