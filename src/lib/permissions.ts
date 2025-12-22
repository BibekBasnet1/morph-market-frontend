import type { UserRole, RouteConfig } from '../types';

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  superadmin: [
    'view:dashboard',
    'view:buyers',
    'view:sellers',
    'manage:buyers',
    'manage:sellers',
    'manage:admins',
    'view:analytics',
    'manage:settings',
  ],
  admin: [
    'view:dashboard',
    'view:buyers',
    'view:sellers',
    'manage:buyers',
    'manage:sellers',
    'view:analytics',
  ],
  seller: [
    'view:dashboard',
    'view:products',
    'manage:products',
    'view:orders',
    'manage:orders',
    'view:analytics',
  ],
  buyer: [
    'view:products',
    'view:orders',
    'manage:profile',
  ],
};

// Check if role has permission
export const hasPermission = (role: UserRole, permission: string): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

// Check if role can access route
export const canAccessRoute = (role: UserRole, route: RouteConfig): boolean => {
  return route.roles.includes(role);
};

// Get allowed routes for role
export const getAllowedRoutes = (role: UserRole, routes: RouteConfig[]): RouteConfig[] => {
  return routes.filter(route => canAccessRoute(role, route));
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 4,
  admin: 3,
  seller: 2,
  buyer: 1,
};

// Check if role is higher or equal
export const isRoleHigherOrEqual = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
