"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PLANS, type Plan } from "@/lib/paddle/config";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import Link from "next/link";
import ButtonPrimary from "@/shared/ButtonPrimary";

export default function PricingClient() {
  const { user, loading, refreshProfile } = useAuth();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production" | undefined;
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment: env ?? "sandbox",
      token,
    }).then((p) => p && setPaddle(p));
  }, []);

  const handleCheckout = async (plan: Plan) => {
    if (!plan.paddlePriceId) return;

    if (!user) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    setCheckingOut(plan.id);
    try {
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.paddlePriceId, uid: user.firebaseUser.uid }),
      });
      const data = await res.json();

      if (!paddle) {
        console.error("Paddle not initialized");
        return;
      }

      const checkoutParams: Parameters<typeof paddle.Checkout.open>[0] = {
        items: [{ priceId: data.priceId, quantity: 1 }],
        settings: {
          successUrl: `${window.location.origin}/pricing/success`,
        },
      };
      // Only pass customer email if we have one — Paddle rejects empty strings
      if (data.customerEmail) {
        checkoutParams.customer = { email: data.customerEmail };
      }
      // Pass uid via customData for webhook correlation
      if (data.customData?.uid) {
        checkoutParams.customData = { uid: data.customData.uid };
      }
      paddle.Checkout.open(checkoutParams);

      // Poll for profile update after checkout opens
      const poll = setInterval(async () => {
        await refreshProfile();
      }, 3000);
      setTimeout(() => clearInterval(poll), 60000);
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckingOut(null);
    }
  };

  const currentPlan = user?.profile?.plan ?? "free";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Get unlimited access to premium journalism. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            loading={loading}
            checkingOut={checkingOut}
            onCheckout={handleCheckout}
          />
        ))}
      </div>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-10">
        Payments are processed securely by{" "}
        <a
          href="https://paddle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Paddle
        </a>
        . All prices include VAT where applicable.
      </p>
    </div>
  );
}

function PlanCard({
  plan,
  currentPlan,
  loading,
  checkingOut,
  onCheckout,
}: {
  plan: Plan;
  currentPlan: string;
  loading: boolean;
  checkingOut: string | null;
  onCheckout: (plan: Plan) => void;
}) {
  const isCurrent = plan.id === currentPlan;
  const isDowngrade = plan.id === "free" && currentPlan !== "free";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.highlighted
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{plan.name}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{plan.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
            {plan.price}
          </span>
          {plan.priceMonthly > 0 && (
            <span className="text-neutral-500 dark:text-neutral-400">/month</span>
          )}
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="rounded-lg bg-green-100 dark:bg-green-900/30 py-2 text-center text-sm font-medium text-green-800 dark:text-green-300">
          Current Plan
        </div>
      ) : isDowngrade ? (
        <Link href="/profile">
          <ButtonPrimary className="w-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200">
            Manage Subscription
          </ButtonPrimary>
        </Link>
      ) : plan.id === "free" ? (
        <Link href="/signup">
          <ButtonPrimary className="w-full">Get Started Free</ButtonPrimary>
        </Link>
      ) : (
        <ButtonPrimary
          className="w-full"
          onClick={() => onCheckout(plan)}
          disabled={loading || checkingOut === plan.id}
        >
          {checkingOut === plan.id ? "Opening checkout..." : `Subscribe — ${plan.price}/mo`}
        </ButtonPrimary>
      )}
    </div>
  );
}
