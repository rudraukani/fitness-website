import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }

  const { currentUser } = authContext;

  return currentUser ? children : <Navigate to="/account" replace />;
};

export default ProtectedRoute;