import type { Product } from "./index";

/* ---------------- Store ---------------- */
export interface Store {
  name: string;
  slug: string;
  brand_name: string;
  logo: string | null;
  rating: number;
  verified: boolean;
}

/* ---------------- Pricing ---------------- */
export interface Pricing {
  price: number;
  sale_price: number | null;
  discount_price: number | null;
  has_discount: boolean;
  discount_period?: {
    start: string;
    end: string;
  } | null;
}

/* ---------------- Availability ---------------- */
export interface Availability {
  store: Store;
  pricing: Pricing;
  stock: number;
  in_stock: boolean;
}

/* ---------------- Product Details ---------------- */
export type ProductDetails = Product & {
  sku: string;
  traits?: string[];
  availability?: Availability[];
};
