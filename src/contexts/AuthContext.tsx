"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

// Define the shape of our User Profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  plan: "free" | "paid";
  createdAt: Date;
  lastLoginAt: Date;
}

// Combined User type for ease of use
export interface AuthUser {
  firebaseUser: FirebaseUser;
  profile: UserProfile | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => { },
  loginWithGoogle: async () => { },
  refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile> => {
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      role: "user",
      plan: "free",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
    return userProfile;
  };

  const updateLastLogin = async (uid: string) => {
    try {
      await setDoc(doc(db, "users", uid), { lastLoginAt: new Date() }, { merge: true });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  };

  const refreshProfile = async () => {
    if (user?.firebaseUser) {
      const profile = await fetchUserProfile(user.firebaseUser.uid);
      setUser({ ...user, profile });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await fetchUserProfile(firebaseUser.uid);
        
        // If profile doesn't exist, create it
        if (!profile) {
          profile = await createUserProfile(firebaseUser);
        } else {
          // Update last login
          await updateLastLogin(firebaseUser.uid);
        }
        
        setUser({ firebaseUser, profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Profile will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};