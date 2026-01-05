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

export interface Tag extends Category {}
export interface Trait extends Category {}
export interface Diet extends Category {}
export interface Maturity extends Category {}
export interface Origin extends Category {}
export interface Gender extends Category {}


// export interface Product {
//   id: number;
//   title: string;
//   slug: string;
//   category_id: number;
//   category?: Category;
//   price: number;
//   location: string;
//   images: string[];
//   breeder: string;
//   verified: boolean;
//   sex: 'male' | 'female' | 'unknown';
//   weight: number; // in grams
//   tag_ids: number[];
//   tags?: Tag[];
//   trait_ids: number[];
//   traits?: Trait[];
//   diet_id?: number;
//   diet?: Diet;
//   maturity_id?: number;
//   maturity?: Maturity;
//   origin_id?: number;
//   origin?: Origin;
//   description?: string;
//   age?: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Product {
  id: number;
  name: string;
  image: string | null;
  slug: string;
  description?: string;
  price?: number;
  location?: string;
  breeder?: string;
  weight?: number;

  category?: {
    id: number;
    name: string;
  } | null;

  origin?: {
    id: number;
    name: string;
  } | null;

  diet?: {
    id: number;
    name: string;
  } | null;

  gender?: {
    id: number;
    name: string;
  } | null;

  maturity_level?: {
    id: number;
    name: string;
  } | null;
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
