import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// Cache for 5 minutes
export const revalidate = 300;

/**
 * Returns a map of category slug → access level ("free" | "basic" | "premium")
 * Stored in Firestore collection "categories" as documents with id = category slug
 * and field `accessLevel: "free" | "basic" | "premium"`
 *
 * Falls back to all-free if collection doesn't exist yet.
 */
export async function GET() {
  try {
    const snap = await adminDb.collection("categories").get();
    const permissions: Record<string, string> = {};

    snap.docs.forEach((doc) => {
      permissions[doc.id] = doc.data().accessLevel ?? "free";
    });

    return NextResponse.json(permissions, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("Failed to fetch category permissions:", err);
    return NextResponse.json({});
  }
}
