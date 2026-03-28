// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up new user
  const signup = async (email, password, profileData) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: profileData.name });

    // Create Firestore profile document
    const profile = {
      uid: user.uid,
      email: user.email,
      name: profileData.name,
      phone: profileData.phone || '',
      bloodGroup: profileData.bloodGroup || '',
      role: profileData.role || 'victim', // victim | helper | admin
      emergencyContacts: [],
      subscription: 'free',
      createdAt: new Date().toISOString(),
      isActive: true,
      sosCount: 0,
    };

    await setDoc(doc(db, 'users', user.uid), profile);
    setUserProfile(profile);
    return user;
  };

  // Sign in
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(result.user.uid);
    return result.user;
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      setUserProfile(data);
      return data;
    }
    return null;
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid), updates);
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
