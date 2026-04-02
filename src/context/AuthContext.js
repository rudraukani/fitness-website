import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

<<<<<<< Updated upstream
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
=======
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
>>>>>>> Stashed changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
<<<<<<< Updated upstream
      setAuthLoading(false);
=======
      setLoading(false);
>>>>>>> Stashed changes
    });

    return unsubscribe;
  }, []);

<<<<<<< Updated upstream
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!authLoading && children}
=======
  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
>>>>>>> Stashed changes
    </AuthContext.Provider>
  );
};

export default AuthProvider;