import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ clientSecret, onSuccess }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      toast.success('Payment successful');
      onSuccess();
    }
  };

  return (
    <div className="space-y-3">
      <CardElement />
      <Button onClick={handlePay}>Pay Now</Button>
    </div>
  );
};

export default StripePaymentForm;
