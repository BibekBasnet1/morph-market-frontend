import type { RouteConfig, UserRole } from '../types';

export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    roles: ['superadmin', 'admin', 'seller'],
  },
  {
    path: '/buyers',
    label: 'Buyers',
    icon: 'Users',
    roles: ['superadmin', 'admin'],
  },
  {
    path: '/sellers',
    label: 'Sellers',
    icon: 'Store',
    roles: ['superadmin', 'admin'],
  },
  {
    path: '/products',
    label: 'Products',
    icon: 'Package',
    roles: ['seller'],
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: 'ShoppingCart',
    roles: ['superadmin', 'admin', 'seller'],
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    roles: ['superadmin', 'admin', 'seller'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'Settings',
    roles: ['superadmin'],
  },
];

// Get routes for specific role
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return ROUTES.filter(route => route.roles.includes(role));
};

// Get default redirect path for role
export const getDefaultPathForRole = (role: UserRole): string => {
  const routes = getRoutesForRole(role);
  return routes.length > 0 ? routes[0].path : '/';
};

// Check if path is accessible by role
export const isPathAccessible = (path: string, role: UserRole): boolean => {
  const route = ROUTES.find(r => path.startsWith(r.path));
  return route ? route.roles.includes(role) : false;
};
