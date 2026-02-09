export interface StoreForm {
  user_id: number | string;
  name: string;
  slug: string;
  brand_name: string;
  username: string;
  email: string;
  phone: string;
  contact_visible: boolean;
  about: string;
  policy: string;
  shipping_type: string;
  is_active: boolean;
  is_verified: boolean;
  cover_photo: File | null;
  logo: File | null;
  store_hours: { day: string; open_time: string; close_time: string; is_open: boolean }[];
  address: {
    country_id: string;
    state_id: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    zip_code: string;
}
}