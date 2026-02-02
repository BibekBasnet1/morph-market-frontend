import client from './client';
import type {
  PlaceOrderResponse,
  InitiatePaymentResponse,
  ConfirmPaymentResponse,
  PaymentStatusResponse,
  Address,
  OrderItem,
} from "../../types/PaymentType";

export interface PlaceOrderPayload {
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method?: string;
}

export const PaymentService = {
  placeOrder: async (payload: PlaceOrderPayload): Promise<PlaceOrderResponse> => {
    // POST /orders - create order
    const res = await client.post('/orders', payload);
    return res.data;
  },

  initiateStripePayment: async (
    orderId: number | string,
    payload?: any
  ): Promise<InitiatePaymentResponse> => {
    // POST /orders/{orderId}/pay -> initiate payment (Stripe)
    const res = await client.post(`/orders/${orderId}/pay`, payload || {});
    return res.data;
  },

  confirmPayment: async (
    paymentId: number | string,
    payload?: any
  ): Promise<ConfirmPaymentResponse> => {
    // POST /payments/{paymentId}/confirm
    const res = await client.post(`/payments/${paymentId}/confirm`, payload || {});
    return res.data;
  },

  getPaymentStatus: async (paymentId: number | string): Promise<PaymentStatusResponse> => {
    // GET /payments/{paymentId}
    const res = await client.get(`/payments/${paymentId}`);
    return res.data;
  },
};

export default PaymentService;
