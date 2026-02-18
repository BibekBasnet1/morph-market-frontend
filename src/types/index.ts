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
  stores?: Array<{
    id: number;
    name: string;
    slug: string;
    brand_name: string;
    logo: string | null;
    cover_photo: string | null;
    is_active: boolean;
    is_verified: boolean;
    rating: string;
    shipping_type: string;
    total_reviews: number;
    total_sales: number;
    username: string;
  }>;
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
  category_id?: number | string;
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

// export interface Product {
//   id: number;
//   name: string;
//   image: string | null;
//   slug: string;
//   description?: string;
//   price?: number;
//   location?: string;
//   breeder?: string;
//   weight?: number;
//   active?: boolean;

//   category?: string | null;

//   origin?: string | null;

//   diet?: string | null;

//   gender?: string | null;

//   maturity_level?: string | null;

//   tag?: string | null;

//   specifications?: {
//     length?: number | null;
//     length_unit?: string | null;
//     weight?: number | null;
//     birth_date?: string | null;
//   };

//   availability?: {
//     store: {
//       name: string;
//       slug: string;
//       brand_name: string;
//       logo: string | null;
//       rating: number;
//       verified: boolean;
//     };
//     pricing: {
//       price: number;
//       sale_price: number;
//       discount_price: number;
//       has_discount: boolean;
//       discount_period: {
//         start: string;
//         end: string;
//       };
//     };
//     stock: number;
//     in_stock: boolean;
//   }[];

//   min_price?: string;
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

  category?: Category | string | null;
  origin?: Origin | string | null;
  diet?: Diet | string | null;
  gender?: Gender | string | null;
  maturity_level?: Maturity | string | null;
  tag?: Tag | string | null;
  trait_ids?: number[];
  traits?: string[];
  availability?: any[];

  image_urls?: {
    thumbnail?: {
      url: string | null;
      thumb?: string | null;
      preview?: string | null;
    };
    gallery?: (string | { url: string })[];
  };
  gallery?: (string | { url: string })[];

  specifications?: {
    length?: number | null;
    length_unit?: string | null;
    weight?: number | null;
    birth_date?: string | null;
  };

  min_price?: string;
  sku?: string;
}


export interface ProductFilters {
  search?: string;
  category_id?: number;
  origin_id?: number;
  diet_id?: number;
  gender_id?: number;
  maturity_level_id?: number;
  price_min?: number;
  price_max?: number;
}

export interface InventoryItem {
  id: number;
  product: Product;
  quantity: number;
  purchased_at: string;
  status: 'in_stock' | 'sold' | 'pending';
}

export interface ReptileFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  sex?: string | 'male' | 'female' | 'unknown';
  weightMin?: number;
  weightMax?: number;
  traits?: string[];
  search?: string;
}
