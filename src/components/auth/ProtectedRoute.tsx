import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isPathAccessible, getDefaultPathForRole } from '../../config/routes';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default path for their role
    const defaultPath = getDefaultPathForRole(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  // Check path-based access
  if (!isPathAccessible(location.pathname, user.role)) {
    const defaultPath = getDefaultPathForRole(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};
