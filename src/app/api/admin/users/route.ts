import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

// Helper to check if requester is admin
async function isAdmin(request: NextRequest) {
  const uid = request.headers.get("x-user-uid");
  if (!uid) return false;

  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    return userDoc.exists && userDoc.data()?.role === "admin";
  } catch (e) {
    console.error("Admin check failed", e);
    return false;
  }
}

// GET - Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const usersSnap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
    const users = usersSnap.docs.map(d => {
      const data = d.data();
      return {
        uid: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString()
      };
    });

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update user role or plan (admin only)
export async function PATCH(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { targetUid, role, plan } = body

    if (!targetUid) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
    }

    const updateData: any = {}
    if (role) updateData.role = role
    if (plan) updateData.plan = plan

    const userRef = adminDb.collection("users").doc(targetUid);
    await userRef.update(updateData);

    const updatedSnap = await userRef.get();

    return NextResponse.json({ success: true, user: { uid: updatedSnap.id, ...updatedSnap.data() } })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}