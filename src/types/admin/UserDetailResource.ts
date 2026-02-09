export interface UserDetail {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  region?: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
  };
  currency?: {
    id: number;
    code: string;
    name: string;
    symbol: string;
    position: number;
    is_active: boolean;
  };
  stores: StoreDetail[];
}

export interface StoreDetail {
  id: number;
  name: string;
  slug: string;
  email: string;
  username: string;
  brand_name: string;
  phone: string | null;
  policy: string | null;
  about: string | null;
  cover_photo: string | null;
  logo: string | null;
  contact_visible: boolean;
  is_active: boolean;
  is_verified: boolean;
  is_draft: boolean;
  shipping_type: string;
  rating: number;
  total_sales: number;
  total_reviews: number;
  qr_code: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  hours: StoreHour[];
  address: StoreAddress | null;
  products_count: number;
  reviews_count: number;
}

export interface StoreHour {
  id: number;
  day: string;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

export interface StoreAddress {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  zip_code: string;
  country: {
    id: number;
    name: string;
    code: string | null;
  } | null;
  state: {
    id: number;
    name: string;
    code: string | null;
  } | null;
}