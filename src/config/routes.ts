// config/routes.ts
import type { RouteConfig, RoleName } from '../types';

export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    roles: ['admin', 'seller', 'buyer', 'superadmin'],
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: 'User',
    roles: ['admin', 'seller', 'buyer', 'superadmin'],
  },
    {
    path: '/products',
    label: 'Products',
    icon: 'Package',
    roles: ['admin', 'seller', 'buyer', 'superadmin'],
  },
  // {
  //   path: '/buyers/:id/review',
  //   label: 'Buyer Review',
  //   icon: 'Package',
  //   roles: ['admin', 'superadmin'],
  // },
  //     {
  //   path: '/activity-log',
  //   label: 'Activity Log',
  //   icon: 'Activity',
  //   roles: ['admin', 'seller', 'buyer', 'superadmin'],
  // },

  {
    path: '/inventory',
    label: 'Inventory',
    icon: 'Package',
    roles: ['buyer', 'seller'],
  },
  {
    path: '/add-listing',
    label: 'Add Listing',
    icon: 'Plus',
    roles: ['seller'],
  },
  {
    path: '/buyers',
    label: 'Buyers',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
    {
    path: '/store',
    label: 'Store',
    icon: 'Store',
    roles: ['admin','buyer','seller'],
  },
    {
    path: '/add-categories',
    label: 'Add Categories',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
      {
    path: '/add-traits',
    label: 'Add Traits',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
      {
    path: '/add-tags',
    label: 'Add Tags',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
        {
    path: '/add-diet',
    label: 'Add Diet',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
{
    path: '/add-maturity',
    label: 'Add Maturity Level',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
  {
    path: '/add-origin',
    label: 'Add Origin',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
    {
    path: '/add-gender',
    label: 'Add Gender',
    icon: 'Users',
    roles: ['admin','buyer'],
  },
  {
    path: '/sellers',
    label: 'Sellers',
    icon: 'Store',
    roles: ['admin','buyer'],
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
    roles: ['admin', 'seller'],
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    roles: ['admin', 'seller'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'Settings',
    roles: ['admin'],
  },
];


export const getRoutesForRoles = (
  roles: RoleName[] = []
): RouteConfig[] => {
  return ROUTES.filter(
    route =>
      route.roles.length === 0 ||
      route.roles.some(role => roles.includes(role))
  );
};

export const getDefaultPathForRoles = (
  roles: RoleName[] = []
): string => {
  const routes = getRoutesForRoles(roles);
  const dashboard = routes.find(r => r.path === '/dashboard');
  return dashboard?.path ?? routes[0]?.path ?? '/dashboard';
};

export const isPathAccessible = (
  path: string,
  roles: RoleName[] = []
): boolean => {
  const route = ROUTES.find(r => path.startsWith(r.path));
  if (!route) return false;
  if (route.roles.length === 0) return true;
  return route.roles.some(role => roles.includes(role));
};

