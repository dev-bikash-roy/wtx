import { NextRequest, NextResponse } from "next/server";
import type { MembershipPlan } from "@/contexts/AuthContext";
import { adminDb } from "@/lib/firebase/admin";

// Map Paddle price IDs to our plan names
const PRICE_TO_PLAN: Record<string, MembershipPlan> = {
  [process.env.PADDLE_BASIC_PRICE_ID || ""]: "basic",
  [process.env.PADDLE_PREMIUM_PRICE_ID || ""]: "premium",
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("paddle-signature");
  const rawBody = await req.text();

  // Verify webhook signature
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("PADDLE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  // Paddle uses ts=timestamp;h1=hash format
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Verify signature using Web Crypto API (Edge-compatible)
  const isValid = await verifyPaddleSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const db = adminDb;

  try {
    switch (event.event_type) {
      case "subscription.activated":
      case "subscription.updated": {
        const sub = event.data;
        const customerId = sub.customer_id;
        const priceId = sub.items?.[0]?.price?.id;
        const plan: MembershipPlan = PRICE_TO_PLAN[priceId] ?? "basic";

        // Find user by paddleCustomerId
        const usersRef = db.collection("users");
        const snap = await usersRef.where("paddleCustomerId", "==", customerId).limit(1).get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            plan,
            paddleSubscriptionId: sub.id,
            subscriptionStatus: sub.status,
            subscriptionExpiresAt: sub.current_billing_period?.ends_at
              ? new Date(sub.current_billing_period.ends_at)
              : null,
          });
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.paused": {
        const sub = event.data;
        const usersRef = db.collection("users");
        const snap = await usersRef
          .where("paddleSubscriptionId", "==", sub.id)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            plan: "free",
            subscriptionStatus: event.event_type === "subscription.cancelled" ? "cancelled" : "paused",
          });
        }
        break;
      }

      case "transaction.completed": {
        // One-time payment fallback — link customer to user via metadata
        const tx = event.data;
        const uid = tx.custom_data?.uid;
        const priceId = tx.items?.[0]?.price?.id;
        const plan: MembershipPlan = PRICE_TO_PLAN[priceId] ?? "basic";

        if (uid) {
          await db.collection("users").doc(uid).update({
            plan,
            paddleCustomerId: tx.customer_id,
            subscriptionStatus: "active",
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function verifyPaddleSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = Object.fromEntries(
      signature.split(";").map((p) => p.split("=") as [string, string])
    );
    const ts = parts["ts"];
    const h1 = parts["h1"];

    if (!ts || !h1) return false;

    const signedPayload = `${ts}:${rawBody}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const computed = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return computed === h1;
  } catch {
    return false;
  }
}
