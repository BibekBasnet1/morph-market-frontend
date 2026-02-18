import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from '../ui/modal';
import { PaymentService } from '../../lib/api/payments';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import type { OrderItem, Address } from '../../types/PaymentType';
import { getReadableError, formatCurrency } from '../../utils/paymentErrors';
import Loading from '../common/Loading';
import { Input } from '../ui/input';
import Label from '../ui/label';

type FlowState =
  | 'address'
  | 'placing'
  | 'initiating'
  | 'payment'
  | 'processing'
  | 'confirmed'
  | 'failed';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onSuccess?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { 
        color: '#6b7280' 
      },
      padding: '12px',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

export const PaymentMethodsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [flowState, setFlowState] = useState<FlowState>('address');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('usd');
  const [cardError, setCardError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: '',
    city: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    line1: '',
    city: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  /* ---------------- RESET ---------------- */
  useEffect(() => {
    if (!isOpen) {
      setFlowState('address');
      setOrderId(null);
      setClientSecret(null);
      setShippingAddress({ line1: '', city: '' });
      setBillingAddress({ line1: '', city: '' });
      setSameAsBilling(true);
      setCardError(null);
    }
  }, [isOpen]);

  /* ---------------- AUTO COPY BILLING ---------------- */
  useEffect(() => {
    if (sameAsBilling) {
      setBillingAddress(shippingAddress);
    }
  }, [shippingAddress, sameAsBilling]);

  /* ---------------- MUTATIONS ---------------- */

  const placeOrderMutation = useMutation({
    mutationFn: (payload: any) => PaymentService.placeOrder(payload),
    onSuccess: (data: any) => {
      const order = data?.data?.order;

      setOrderId(order?.id ?? null);
      setTotalAmount(data?.data?.amount ?? 0);
      setCurrency(data?.data?.currency ?? 'usd');

      if (!order?.id) {
        toast.error('Order ID missing');
        setFlowState('failed');
        return;
      }

      setFlowState('initiating');
    },
    onError: (error: any) => {
      toast.error(getReadableError(error.message));
      setFlowState('failed');
    },
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: (orderId: number) => PaymentService.initiateStripePayment(orderId),
    onSuccess: (data: any) => {
      setClientSecret(data.data.client_secret);
      setFlowState('payment');
    },
    onError: (error: any) => {
      toast.error(getReadableError(error.message));
      setFlowState('failed');
    },
  });

  /* ---------------- VALIDATION ---------------- */

  const validateAddresses = useCallback(() => {
    if (!shippingAddress.line1 || !shippingAddress.city) {
      toast.error('Please fill in your shipping address');
      return false;
    }

    if (!sameAsBilling && (!billingAddress.line1 || !billingAddress.city)) {
      toast.error('Please fill in your billing address');
      return false;
    }

    return true;
  }, [shippingAddress, billingAddress, sameAsBilling]);

  /* ---------------- HANDLERS ---------------- */

  const handlePlaceOrder = useCallback(() => {
    if (!validateAddresses()) return;

    setFlowState('placing');

    placeOrderMutation.mutate({
      items: items.map(item => ({
        product_id: item.product_id,
        store_id: item.store_id,
        quantity: item.quantity,
      })),
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    });
  }, [items, shippingAddress, billingAddress, validateAddresses]);

  const handleConfirmPayment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements || !clientSecret) return;

      const card = elements.getElement(CardElement);
      if (!card) return;

      setIsSubmitting(true);
      setCardError(null);

      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              address: {
                line1: billingAddress.line1,
                city: billingAddress.city,
              },
            },
          },
        });

        setIsSubmitting(false);

        if (error) {
          setCardError(error.message || 'Payment failed');
          setFlowState('failed');
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
  // Stripe has already confirmed the payment; go straight to confirmed state
  // (backend should verify via webhooks, not re-confirm)
  setFlowState('confirmed');
  setTimeout(() => {
    onSuccess?.();
    onClose();
  }, 1200);
} else {
  setFlowState('failed');
}
      } catch (err: any) {
        setIsSubmitting(false);
        setCardError(err?.message || 'Payment failed');
        setFlowState('failed');
      }
    },
    [stripe, elements, clientSecret, billingAddress]
  );

  useEffect(() => {
    if (flowState === 'initiating' && orderId) {
      initiatePaymentMutation.mutate(orderId);
    }
  }, [flowState, orderId]);

const isProcessing = flowState === 'processing';

const estimatedTax = (items.reduce((sum, item) => sum + (item.price || 0), 0)) * 0.01;
const shippingAndHandling = 45.00;
  /* ---------------- MAIN RENDER ---------------- */
console.log("item.name", items) ;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="min-h-[500px] dark:bg-[#0d1f1a] text-gray-800 dark:text-white p-10 rounded-xl">
        
        {/* ADDRESS STEP */}
        {flowState === 'address' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Review Items */}
              <div className="dark:bg-[#0a2820] rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-6">Review Items</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black rounded-lg flex-shrink-0">
                        {/* Product image would go here */}
                        <div className="w-full h-full bg-gray-800 rounded-lg"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white">{item.product_name}</h3>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-green-400 font-semibold">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="dark:bg-[#0a2820] rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="123 Serpent Lane, Scales District"
                    value={shippingAddress.line1}
                    onChange={(val) => setShippingAddress({ ...shippingAddress, line1: val.target.value })}
                  />
                  <Label>City</Label>
                  <Input
                    placeholder="Austin, TX 78701, United States"
                    value={shippingAddress.city}
                    onChange={(val) => setShippingAddress({ ...shippingAddress, city: val.target.value })}
                  />
                </div>

                {/* SAME AS BILLING */}
                <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="w-4 h-4 text-green-500 bg-[#0d1f1a] border-gray-600 rounded 
                      focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300 dark:group-hover:text-white transition-colors">
                    Billing address same as shipping
                  </span>
                </label>

                {/* BILLING FORM */}
                {!sameAsBilling && (
                  <div className="space-y-4 border-t border-gray-700 mt-6 pt-6">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-4">Billing Address</h3>
                  
                  <Label>Street Address</Label>
                    <Input
                      placeholder="123 Serpent Lane, Scales District"
                      value={billingAddress.line1}
                      onChange={(val) => setBillingAddress({ ...billingAddress, line1: val.target.value })}
                    />
                  <Label>City</Label>
                    <Input
                      placeholder="Austin, TX 78701, United States"
                      value={billingAddress.city}
                      onChange={(val) => setBillingAddress({ ...billingAddress, city: val.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Order Summary */}
            <div className="space-y-6">
              <div className="dark:bg-[#0a2820] rounded-xl border border-gray-800 p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Items Subtotal ({items.length})</span>
                    <span className="text-gray-800 dark:text-white">${(items.reduce((sum, item) => sum + (item.price || 0), 0)).toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping & Handling</span>
                    <span className="text-gray-800 dark:text-white">${shippingAndHandling.toFixed(2)}</span>
                  </div> */}
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Tax</span>
                    <span className="text-gray-800 dark:text-white">${estimatedTax.toFixed(2)}</span>
                  </div> */}

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-3xl font-bold text-green-400">
                        {/* ${(items.reduce((sum, item) => sum + (item.price || 0), 0) + shippingAndHandling + estimatedTax).toFixed(2)} */}
                        ${(items.reduce((sum, item) => sum + (item.price || 0), 0)).toFixed(2)}

                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placeOrderMutation.isPending}
                  className="w-full bg-green-500 hover:bg-green-600 text-gray-800 dark:text-white py-4 rounded-xl 
                    font-semibold transition-all duration-200 disabled:opacity-50 
                    disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg
                    shadow-green-500/20"
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order & Pay
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Encrypted Transaction</span>
                </div>

                <div className="mt-4 p-3 dark:bg-[#0d1f1a] rounded-lg border border-gray-700">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      By clicking "Place Order & Pay," you agree to ExoticPetsMarket's{' '}
                      <a href="#" className="text-green-400 underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-green-400 underline">Privacy Notice</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING STATES */}
        {['placing', 'initiating'].includes(flowState) && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading />
            <p className="mt-6 text-gray-300 font-medium text-lg">
              {flowState === 'placing' ? 'Preparing your order...' : 'Setting up payment...'}
            </p>
          </div>
        )}

        {/* PAYMENT STEP */}
        {flowState === 'payment' && (
          <div className=" mx-auto">
            <form onSubmit={handleConfirmPayment} className="space-y-6">
              <div className="dark:bg-gradient-to-br dark:from-green-900/30 dark:to-emerald-900/30 dark:border dark:border-green-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-4xl font-bold text-green-400">
                      {formatCurrency(totalAmount, currency)}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a2820] rounded-xl border border-gray-800 p-6 space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Card Information
                </label>
                <div className="dark:bg-[#0d1f1a] !text-white border-2 border-gray-700 rounded-lg p-4 
                  focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 
                  transition-all">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                {cardError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 
                    border border-red-800 p-4 rounded-lg">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {cardError}
                  </div>
                )}
              </div>

              <div className="dark:bg-[#0a2820] border border-gray-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div className="text-sm text-gray-800 dark:text-gray-400">
                    <p className="font-medium text-gray-800 dark:text-gray-300 mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!stripe || isProcessing || isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-gray-800 dark:text-white py-4 rounded-xl 
                  font-semibold shadow-lg shadow-green-500/30 transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay {formatCurrency(totalAmount, currency)}
              </button>
            </form>
          </div>
        )}

        {/* PROCESSING */}
        {flowState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="mt-8 text-gray-800 dark:text-white font-semibold text-xl">Processing Payment...</p>
            <p className="mt-2 text-gray-400">Please do not close this window</p>
          </div>
        )}

        {/* CONFIRMED */}
        {flowState === 'confirmed' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Payment Successful!</h3>
            <p className="text-gray-400 text-lg">Your order has been confirmed</p>
          </div>
        )}

        {/* FAILED */}
        {flowState === 'failed' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Payment Failed</h3>
            <p className="text-gray-400 text-lg mb-8">Something went wrong with your payment</p>
            <button
              onClick={() => setFlowState('address')}
              className="bg-green-500 hover:bg-green-600 text-gray-800 dark:text-white px-8 py-4 rounded-xl 
                font-semibold transition-all shadow-lg shadow-green-500/30"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentMethodsModal;