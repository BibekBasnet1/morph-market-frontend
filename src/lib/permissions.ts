// lib/permissions.ts
import type { RoleName } from '../types';

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  admin: [
    'view:dashboard',
    'view:buyers',
    'view:sellers',
    'manage:buyers',
    'manage:sellers',
    'manage:admins',
    'view:analytics',
    'manage:settings',
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
    'view:dashboard',
    'view:products',
    'view:orders',
    'manage:profile',
  ],
  superadmin: [
    '*',
  ],
};

export const hasPermission = (
  roles: RoleName[],
  permission: string
): boolean => {
  return roles.some(role =>
    ROLE_PERMISSIONS[role]?.includes(permission) ||
    ROLE_PERMISSIONS[role]?.includes('*')
  );
};

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  superadmin: 4,
  admin: 3,
  seller: 2,
  buyer: 1,
};

export const isRoleHigherOrEqual = (
  userRoles: RoleName[],
  requiredRole: RoleName
): boolean => {
  return userRoles.some(
    role => ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole]
  );
};
