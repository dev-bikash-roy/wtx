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

        const snap = await adminDb.collection("categories").get();
        const categories = snap.docs.map(d => ({ slug: d.id, ...d.data() }));

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!await isAdmin(request)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const body = await request.json();
        const { slug } = body;
        if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

        await adminDb.collection("categories").doc(slug).set(body);

        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json({ error: "Error creating" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        if (!await isAdmin(request)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { slug, accessLevel } = body;

        const categoryRef = adminDb.collection("categories").doc(slug);
        await categoryRef.set({ accessLevel }, { merge: true });

        const updated = await categoryRef.get();

        return NextResponse.json({ slug: updated.id, ...updated.data() });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
