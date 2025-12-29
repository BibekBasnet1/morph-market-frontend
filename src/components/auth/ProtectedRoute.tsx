import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  isPathAccessible,
  getDefaultPathForRoles,
} from '../../config/routes';
import type { RoleName } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleName[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  

  const location = useLocation();
  if (isLoading) {
  return null; // or a spinner
}

  // Not authenticated

  console.log('is auth,user',isAuthenticated,user);
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Convert role objects → role names
const roleNames: RoleName[] = user.roles?.map(r => r.name as RoleName) ?? [];

    console.log('roles',allowedRoles)

  // Role-based access
  if (
    allowedRoles &&
    !allowedRoles?.some(role => roleNames.includes(role))
  ) {
    // console.log('roles',allowedRoles)
    const defaultPath = getDefaultPathForRoles(roleNames);
    return <Navigate to={defaultPath} replace />;
  }

  // Path-based access
  if (!isPathAccessible(location.pathname, roleNames)) {
    const defaultPath = getDefaultPathForRoles(roleNames);
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};
