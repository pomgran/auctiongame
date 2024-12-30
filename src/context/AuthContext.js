// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
} from "../firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, username) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCred.user.uid;

    // Create user doc in Firestore with initial money/coins
    await setDoc(doc(db, "users", userId), {
      username,
      coins: 0,     // Will be updated later
      dollars: 0,   // Will be updated later
    });

    return userCred;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Grab user info from Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setCurrentUser({ uid: user.uid, ...docSnap.data() });
        } else {
          // user doc doesn’t exist, or handle error
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
