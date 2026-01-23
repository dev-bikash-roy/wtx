"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface Props {
    postCategories: { handle: string; name: string }[];
    children: React.ReactNode;
}

export default function PremiumGuard({ postCategories, children }: Props) {
    const { user, loading } = useAuth();
    const [isLocked, setIsLocked] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                // Fetch permissions (could be cached in context or separate hook in future)
                const res = await fetch('/api/categories/permissions');
                const permissions = res.ok ? await res.json() : {};

                // Check if any category of the post is Paid
                const isPremiumPost = postCategories.some(cat => permissions[cat.handle] === 'paid');

                if (isPremiumPost) {
                    // If User is not logged in OR is 'free'
                    if (!user || user.profile?.plan === 'free') {
                        setIsLocked(true);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setChecking(false);
            }
        };

        if (!loading) {
            checkAccess();
        }
    }, [user, loading, postCategories]);

    if (loading || checking) {
        return <div className="animate-pulse p-4">Checking access...</div>;
    }

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-100 p-12 text-center dark:bg-neutral-800">
                <div className="mb-4 text-4xl">🔒</div>
                <h2 className="mb-2 text-2xl font-bold">Premium Content</h2>
                <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                    This article is for subscribers only.
                </p>
                <div className="flex gap-4">
                    <Link href="/login">
                        <ButtonPrimary>Login</ButtonPrimary>
                    </Link>
                    <Link href="/signup">
                        <ButtonPrimary className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">Sign Up</ButtonPrimary>
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
