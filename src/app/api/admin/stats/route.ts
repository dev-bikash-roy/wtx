import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// Helper to check if requester is admin
async function isAdmin(request: NextRequest) {
  const uid = request.headers.get("x-user-uid");
  if (!uid) return false;

  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    return userDoc.exists && userDoc.data()?.role === "admin";
  } catch (e) {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const usersColl = adminDb.collection("users");

    const totalUsersSnap = await usersColl.count().get();
    const paidUsersSnap = await usersColl.where("plan", "==", "paid").count().get();
    const freeUsersSnap = await usersColl.where("plan", "==", "free").count().get();

    const stats = {
      totalUsers: totalUsersSnap.data().count,
      paidUsers: paidUsersSnap.data().count,
      freeUsers: freeUsersSnap.data().count,
      totalPosts: 0, // Placeholder
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}