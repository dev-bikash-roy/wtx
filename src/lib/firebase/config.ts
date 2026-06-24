import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Treat the placeholder values from .env.example as "not configured".
const apiKey = firebaseConfig.apiKey;
export const isFirebaseConfigured = Boolean(
    apiKey && !apiKey.includes("your_") && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: any = null;

if (isFirebaseConfigured) {
    // Initialize Firebase only when real credentials are present, so a missing
    // local .env doesn't crash the whole app with auth/invalid-api-key.
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Analytics only in browser environment and if supported
    if (typeof window !== "undefined") {
        isSupported().then((supported) => {
            if (supported && app) {
                analytics = getAnalytics(app);
            }
        });
    }
} else if (typeof window !== "undefined") {
    console.warn(
        "[firebase] Not configured — set NEXT_PUBLIC_FIREBASE_* env vars to enable auth/Firestore. Auth features are disabled."
    );
}

export { app, auth, db, analytics };
