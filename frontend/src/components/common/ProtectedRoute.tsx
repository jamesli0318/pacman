import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowGuests?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowGuests = false }) => {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // Allow access if authenticated OR (guest AND route allows guests)
  const hasAccess = isAuthenticated || (allowGuests && isGuest);

  // Redirect to login if no access, preserving the intended destination
  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;