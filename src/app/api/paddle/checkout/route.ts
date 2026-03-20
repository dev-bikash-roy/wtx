import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const { priceId, uid } = await req.json();

    if (!priceId || !uid) {
      return NextResponse.json({ error: "Missing priceId or uid" }, { status: 400 });
    }

    // Verify the user exists
    await adminAuth.getUser(uid);

    // Get user's email for Paddle pre-fill
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const email = userDoc.data()?.email ?? "";

    // Return the data needed for Paddle.js client-side checkout
    // Paddle Billing uses client-side checkout with custom_data for webhook correlation
    return NextResponse.json({
      priceId,
      customData: { uid },
      customerEmail: email,
    });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
