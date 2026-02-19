import api from "./client";

export interface OrderItem {
  id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  tax: string;
  total: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  order_date: string;
  items: OrderItem[];
}

export interface OrderMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface OrderResponse {
  data: Order[];
  meta: OrderMeta;
}

export const OrderService = {
  async getBuyerOrders(page: number = 1): Promise<OrderResponse> {
    const res = await api.get("/orders", {
      params: { page, per_page: 10 },
    });
    return res.data;
  },
    async getSellerOrders(page: number = 1): Promise<OrderResponse> {
    const res = await api.get("/seller/customer-orders", {
      params: { page, per_page: 10 },
    });
    return res.data;
  },
};