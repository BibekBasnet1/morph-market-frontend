import client from './client';

export interface PlaceOrderPayload {
  items: Array<{ product_id: number; quantity: number; price?: number }>;
  shipping_address?: any;
  payment_method?: string;
}

export interface PlaceOrderResponse {
  order_id: number | string;
  total: number;
}

export const PaymentService = {
  placeOrder: async (payload: PlaceOrderPayload) => {
    // POST /orders - create order
    const res = await client.post('/orders', payload);
    return res.data as PlaceOrderResponse;
  },

  initiateStripePayment: async (orderId: number | string, payload?: any) => {
    // POST /orders/{orderId}/pay -> initiate payment (Stripe)
    const res = await client.post(`/orders/${orderId}/pay`, payload || {});
    return res.data;
  },

  confirmPayment: async (paymentId: number | string, payload?: any) => {
    // POST /payments/{paymentId}/confirm
    const res = await client.post(`/payments/${paymentId}/confirm`, payload || {});
    return res.data;
  },

  getPaymentStatus: async (paymentId: number | string) => {
    // GET /payments/{paymentId}
    const res = await client.get(`/payments/${paymentId}`);
    return res.data;
  },
};

export default PaymentService;
