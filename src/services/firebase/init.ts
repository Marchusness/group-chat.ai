// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDX5gNVh2cxHH8hi958EM0hcyywpsCZARw",
  authDomain: "group-chat-ai.firebaseapp.com",
  projectId: "group-chat-ai",
  storageBucket: "group-chat-ai.firebasestorage.app",
  messagingSenderId: "699290503972",
  appId: "1:699290503972:web:ef33ec02434b65db11c1b1",
  measurementId: "G-VBHMFCELQF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

export { auth, firestore };