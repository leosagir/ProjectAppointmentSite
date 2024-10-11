import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  role: UserRole;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, element }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  console.log('ProtectedRoute:', { isAuthenticated, user, requiredRole: role });

  if (!isAuthenticated || !user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    console.log('User role does not match required role:', { userRole: user.role, requiredRole: role });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('Rendering element:', element);
  return element;
};

export default ProtectedRoute;