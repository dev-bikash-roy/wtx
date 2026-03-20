"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ButtonPrimary from "@/shared/ButtonPrimary";

export default function CheckoutSuccessPage() {
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Refresh profile so plan updates immediately
    refreshProfile();
  }, [refreshProfile]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 text-6xl">🎉</div>
      <h1 className="mb-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        Welcome to the club!
      </h1>
      <p className="mb-8 max-w-md text-neutral-600 dark:text-neutral-400">
        Your subscription is now active. Enjoy unlimited access to premium content.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <ButtonPrimary>Start Reading</ButtonPrimary>
        </Link>
        <Link href="/profile">
          <ButtonPrimary className="bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200">
            View Profile
          </ButtonPrimary>
        </Link>
      </div>
    </div>
  );
}
