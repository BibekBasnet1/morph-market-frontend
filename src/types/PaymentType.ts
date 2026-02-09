export interface OrderItem {
  product_id: number;
  store_id: number;
  quantity: number;
  price?: number;
  product_name?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postal_code?: string;
  state?: string;
  country?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'payment_failed' | 'refunded';
  order_date: string;
  total?: number;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripe_payment_intent_id: string;
  stripe_charge_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    order_id: number;
    total: number;
  };
}

export interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    client_secret: string;
    amount: number;
    currency: string;
  };
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: Payment;
    stripe_intent_status: string;
    requires_action: boolean;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    payment: Payment;
    stripe_intent_status: string;
  };
}
