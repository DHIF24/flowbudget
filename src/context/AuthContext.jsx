import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { signUpUser, loginUser, loginWithGoogle, logoutUser } from '../firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * AuthProvider component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Connection Validation as requested by Firebase Integration guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Setup standard Auth State listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updatePassword = async (newPassword) => {
    if (!user) throw new Error('Utilisateur non connecté');
    await firebaseUpdatePassword(user, newPassword);
  };

  const value = {
    user,
    loading,
    register: signUpUser,
    login: loginUser,
    loginWithGoogle,
    logout: logoutUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
