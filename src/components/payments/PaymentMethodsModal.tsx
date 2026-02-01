import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { PaymentService } from '../../lib/api/payments';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type Item = { product_id: number; store_id: number; quantity: number; price?: number };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
}

type FlowState = 'idle' | 'placing' | 'initiating' | 'waiting' | 'confirmed' | 'failed';

type Address = { line1: string; city: string; line2?: string; postal_code?: string };

export const PaymentMethodsModal: React.FC<Props> = ({ isOpen, onClose, items }) => {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [orderId, setOrderId] = useState<string | number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address>({ line1: '', city: '' });
  const [billingAddress, setBillingAddress] = useState<Address>({ line1: '', city: '' });
  const [sameAsBilling, setSameAsBilling] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setFlowState('idle');
      setOrderId(null);
      setCheckoutUrl(null);
      setShippingAddress({ line1: '', city: '' });
      setBillingAddress({ line1: '', city: '' });
      setSameAsBilling(true);
    }
  }, [isOpen]);

  const placeOrderMutation = useMutation({
    mutationFn: (payload: any) => PaymentService.placeOrder(payload),
    onSuccess: (data: any) => {
      setOrderId((data as any).order_id);
      setFlowState('initiating');
    },
    onError: () => {
      toast.error('Failed to place order');
      setFlowState('failed');
    },
  });

  const initiateStripeMutation = useMutation({
    mutationFn: ({ orderId, payload }: any) => PaymentService.initiateStripePayment(orderId, payload),
    onSuccess: (data: any) => {
      // expected { checkoutUrl } or { payment_id }
      // prefer checkoutUrl if provided
      if (data?.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        // open checkout in new tab/window
        window.open(data.checkoutUrl, '_blank');
        setFlowState('waiting');
        // start polling status using returned payment id or provided orderId
        const pid = data.payment_id || data.paymentId || data.id || orderId;
        pollStatus(pid);
      } else if (data?.clientSecret) {
        // for client-side stripe flow the app would use clientSecret
        toast.success('Stripe client secret received - complete payment in UI');
        setFlowState('waiting');
        pollStatus(orderId);
      } else if (data?.payment_id || data?.paymentId) {
        // backend returned a payment id to poll
        setFlowState('waiting');
        const pid = data.payment_id || data.paymentId;
        pollStatus(pid);
      } else {
        toast.error('Unexpected stripe response');
        setFlowState('failed');
      }
    },
    onError: () => {
      toast.error('Failed to initiate Stripe');
      setFlowState('failed');
    },
  });

  const pollStatus = async (id: any) => {
    if (!id) return;
    try {
      let attempts = 0;
      while (attempts < 12) {
        const res: any = await PaymentService.getPaymentStatus(id);
        // expected { status: 'pending'|'paid'|'failed' }
        if (res?.status === 'paid' || res?.status === 'confirmed') {
          setFlowState('confirmed');
          toast.success('Payment successful');
          return;
        }
        if (res?.status === 'failed' || res?.status === 'cancelled') {
          setFlowState('failed');
          toast.error('Payment failed');
          return;
        }
        attempts += 1;
        await new Promise((r) => setTimeout(r, 3000));
      }
      // timed out
      toast('Payment still pending. You can check order status from orders page.', { icon: '⏳' });
      setFlowState('waiting');
    } catch (err) {
      console.error('poll error', err);
      setFlowState('failed');
    }
  };

  const handlePlaceOrderAndPay = async (method: 'stripe' | 'cod') => {
    if (!shippingAddress.line1 || !shippingAddress.city) {
      toast.error('Please fill in shipping address');
      return;
    }
    if (!billingAddress.line1 || !billingAddress.city) {
      toast.error('Please fill in billing address');
      return;
    }
    setFlowState('placing');
    placeOrderMutation.mutate({
      items,
      payment_method: method,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    });
  };

  // when placeOrder completes we need to call initiate for stripe
  useEffect(() => {
    if (flowState === 'initiating' && orderId) {
      // call initiate with empty payload - backend may return checkout url or payment id
      initiateStripeMutation.mutate({ orderId, payload: {} });
    }
  }, [flowState, orderId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Checkout</h3>

        {/* Shipping Address */}
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm">Shipping Address</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Address Line 1"
              value={shippingAddress.line1}
              onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Address Line 2 (optional)"
              value={shippingAddress.line2 || ''}
              onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Postal Code (optional)"
              value={shippingAddress.postal_code || ''}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sameAsBilling"
              checked={sameAsBilling}
              onChange={(e) => {
                setSameAsBilling(e.target.checked);
                if (e.target.checked) {
                  setBillingAddress(shippingAddress);
                }
              }}
              className="rounded"
            />
            <label htmlFor="sameAsBilling" className="text-sm cursor-pointer">
              Billing address same as shipping
            </label>
          </div>
          {!sameAsBilling && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Billing Address Line 1"
                value={billingAddress.line1}
                onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
              />
              <input
                type="text"
                placeholder="Billing City"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
              />
              <input
                type="text"
                placeholder="Billing Address Line 2 (optional)"
                value={billingAddress.line2 || ''}
                onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
              />
              <input
                type="text"
                placeholder="Billing Postal Code (optional)"
                value={billingAddress.postal_code || ''}
                onChange={(e) => setBillingAddress({ ...billingAddress, postal_code: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Choose Payment Method</h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <div className="font-medium">Stripe</div>
                <div className="text-sm text-muted-foreground">Pay securely with card (Stripe)</div>
              </div>
              <div>
                <Button
                  onClick={() => handlePlaceOrderAndPay('stripe')}
                  disabled={flowState !== 'idle' && flowState !== 'failed'}
                >
                  {flowState === 'placing' ? 'Placing...' : 'Pay with Stripe'}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">Pay when item is delivered</div>
              </div>
              <div>
                <Button
                  onClick={() => handlePlaceOrderAndPay('cod')}
                  disabled={flowState !== 'idle' && flowState !== 'failed'}
                >
                  Place Order (COD)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm">Status: <strong>{flowState}</strong></p>
          {checkoutUrl && (
            <p className="text-sm text-blue-600">Checkout opened in new tab.</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodsModal;
