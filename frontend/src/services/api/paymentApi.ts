import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CheckoutSessionResponse {
  success: boolean;
  message?: string;
  data: {
    checkoutUrl: string | null;
    sessionId: string;
    payment?: any;
  };
}

/** Retrieve auth token from localStorage or document cookie */
function getAuthToken(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('auth_token');
  if (stored && stored !== 'undefined' && stored !== 'null') return stored;

  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.accessToken;
      if (token && token !== 'undefined' && token !== 'null') return token;
    }
  } catch (e) {
    // ignore json error
  }

  // Try to extract from cookies
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  const cookieToken = match ? decodeURIComponent(match[1]) : '';
  if (cookieToken && cookieToken !== 'undefined' && cookieToken !== 'null') return cookieToken;
  return '';
}

export const paymentApi = {
  /**
   * Creates a Stripe Checkout Session via the Next.js API route.
   * The route lives at /api/payments/checkout-session (Next.js App Router).
   */
  createCheckoutSession: async (payload: {
    orderId: string;
    amount: number;
    currency?: string;
    items?: Array<{ name: string; amount: number; quantity: number }>;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<CheckoutSessionResponse> => {
    const token = getAuthToken();
    const response = await axios.post<CheckoutSessionResponse>(
      '/api/payments/checkout-session',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * Creates a Stripe PaymentIntent for direct card element payment.
   */
  createPaymentIntent: async (payload: {
    orderId: string;
    amount: number;
    currency?: string;
    billingAddress?: any;
  }): Promise<{ success: boolean; clientSecret: string; paymentIntentId: string; publishableKey?: string }> => {
    const token = getAuthToken();
    const response = await axios.post(
      '/api/payments/create-intent',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * Confirms payment and marks order as PAID in database.
   */
  confirmPayment: async (payload: {
    orderId: string;
    paymentIntentId?: string;
    sessionId?: string;
  }): Promise<{ success: boolean; message: string; orderId?: string; paymentStatus?: string }> => {
    const token = getAuthToken();
    const response = await axios.post(
      '/api/payments/confirm',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * Verify payment status for a given orderId.
   */
  verifyPayment: async (orderId: string): Promise<{ success: boolean; data: any }> => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/v1/payments/verify/${orderId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  },

  /**
   * Refund a previously completed payment.
   */
  refundPayment: async (paymentId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/v1/payments/${paymentId}/refund`,
      { reason },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.data;
  },
};
