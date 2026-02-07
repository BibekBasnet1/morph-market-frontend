type UserType = 'seller' | 'buyer';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified: boolean;
  created_at: string;
  stores: Store[];
}

interface Store {
  id: number;
  name: string;
  brand_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_draft: boolean;
  rating: string;
  total_sales: number;
}

interface UsersListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: User[];
    total: number;
    per_page: number;
    last_page: number;
  };
}

export type {
    UsersListResponse, UserType, User
}