export type Cart = {
  id: number;
  user_id: number;
  store_id: number | null;
  product_id: number;
  quantity: number;
  price: string;
  status: "active" | "ordered";
  created_at: string;
  updated_at: string;
};

export type AddToCartPayload = {
  product_id: number;
  store_id?: number;
  quantity: number;
};
