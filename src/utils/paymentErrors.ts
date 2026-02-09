export const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  // Stripe error codes
  card_declined: 'Your card was declined. Please try a different card.',
  expired_card: 'Your card has expired. Please use a different card.',
  incorrect_cvc: 'The CVC code is incorrect. Please check and try again.',
  insufficient_funds: 'Insufficient funds. Please try a different card.',
  processing_error: 'An error occurred while processing your card. Please try again.',
  incorrect_number: 'The card number is incorrect. Please check and try again.',
  lost_card: 'Your card has been reported as lost.',
  stolen_card: 'Your card has been reported as stolen.',
  pick_up_card: 'Your card cannot be used for payments.',

  // API errors
  'Order is not in a payable state.': 'This order cannot be paid. It may have already been processed.',
  'Order amount invalid or no items.': 'There was an issue with your order. Please try again.',
  Unauthorized: 'Your session has expired. Please log in again.',
  'Payment failed': 'Payment processing failed. Please try again.',
  'Network error': 'Network error. Please check your connection and try again.',
};

export function getReadableError(error: unknown): string {
  if (error instanceof Error) {
    return PAYMENT_ERROR_MESSAGES[error.message] || error.message;
  }
  if (typeof error === 'string') {
    return PAYMENT_ERROR_MESSAGES[error] || error;
  }
  return 'An unexpected error occurred. Please try again.';
}

export function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
