import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, email } = body;

        if (!uid || !email) {
            return NextResponse.json(
                { error: "UID and Email are required" },
                { status: 400 }
            );
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return NextResponse.json({ ...userSnap.data(), uid }, { status: 200 });
        }

        // Create new user in Firestore
        const userData = {
            uid,
            email,
            role: "user",
            plan: "free",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(userRef, userData);

        return NextResponse.json(userData, { status: 201 });
    } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
