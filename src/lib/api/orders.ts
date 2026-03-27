import api from "./client";

export interface OrderItem {
  id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  price: string | number;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  order_date: string;
  items: OrderItem[];
  total?: number;
  total_formatted?: string;
  item_count?: number;
  customer?: OrderCustomer;
}

export interface OrderCustomer {
  id: number;
  name: string;
  email: string;
}

export interface OrderMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface PaginatedOrders {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: PaginatedOrders;
}

export type SellerOrdersQuery = {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
};

export type OwnOrdersQuery = {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
};

export interface OwnOrderProduct {
  id: number;
  name: string;
}

export interface OwnOrderAddress {
  line1?: string | null;
  city?: string | null;
}

export interface OwnOrderItem {
  id: number;
  order_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  tax: number;
  total: number;
  product?: OwnOrderProduct | null;
}

export interface OwnOrder {
  id: number;
  order_number: string;
  status: string;
  order_date: string;
  estimated_delivery_date?: string | null;
  shipping_address?: OwnOrderAddress | null;
  billing_address?: OwnOrderAddress | null;
  items: OwnOrderItem[];
}

export interface OwnOrdersPaginated {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  data: OwnOrder[];
}

export interface OwnOrdersResponse {
  success: boolean;
  message: string;
  data: OwnOrdersPaginated;
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
  async getCustomerOrders(page: number = 1, query: Omit<SellerOrdersQuery, "page"> = {}) : Promise<OrderResponse> {
    return await api.get("/seller/orders", {
      params: { page, per_page: 10, ...query },
    });
  },
  async getOwnOrders(page: number = 1, query: Omit<OwnOrdersQuery, "page"> = {}): Promise<OwnOrdersResponse> {
    const res = await api.get("/orders/own-orders", {
      params: { page, per_page: 10, ...query },
    });
    return res.data;
  },
};
