import { Navigate, useLocation } from 'react-router';
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
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
