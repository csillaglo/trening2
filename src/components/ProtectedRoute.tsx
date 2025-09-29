import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, isLoadingSession, user } = useAuth(); // Added user for a more robust check if needed

  if (isLoadingSession) {
    // While session is loading, don't render anything or show a loader
    // This prevents premature redirection
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Munkamenet betöltése...</div>
      </div>
    );
  }

  // After loading, if not admin (which implies user might also be null or not the admin user)
  // then redirect to login.
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // If session is loaded and user is admin, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
