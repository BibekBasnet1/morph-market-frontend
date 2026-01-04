// User roles enum
// export type UserRole = 'superadmin'|'admin' | 'seller' | 'buyer';

export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: UserRole[]; // now an array
  avatar?: string | null;
  phone?: string | null;
  postal_code?: string | null;
  birth_date?: string | null;
  bio?: string | null;
}

// types/roles.ts
export type RoleName = 'admin' | 'seller' | 'buyer' | 'superadmin';



// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Buyer interface
export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  lastOrderAt?: string;
}

// Seller interface
export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  totalProducts: number;
  totalSales: number;
  revenue: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: string;
  rating: number;
}

// Sales data for dashboard
export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

// Dashboard stats
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  totalBuyers: number;
  totalSellers: number;
  salesGrowth: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

// Pagination
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Filter state
export interface FilterState {
  search: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationState;
  success: boolean;
  message?: string;
}

// Route config
export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  roles: RoleName[];
  children?: RouteConfig[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: File | null;
}


// Reptile types
export interface Reptile {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  image: string;
  breeder: string;
  verified: boolean;
  sex: 'male' | 'female' | 'unknown';
  weight: number; // in grams
  traits: string[];
  description?: string;
  age?: string;
  createdAt: string;
}

export interface ReptileFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  sex?: 'male' | 'female' | 'unknown';
  weightMin?: number;
  weightMax?: number;
  traits?: string[];
  search?: string;
}
