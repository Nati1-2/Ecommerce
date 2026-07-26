import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CheckoutSessionResponse {
  success: boolean;
  message?: string;
  data: {
    checkoutUrl: string | null;
    sessionId: string;
    payment: any;
  };
}

export const paymentApi = {
  createCheckoutSession: async (payload: {
    orderId: string;
    amount: number;
    currency?: string;
    items?: Array<{ name: string; amount: number; quantity: number }>;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<CheckoutSessionResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await axios.post<CheckoutSessionResponse>(
      `${API_BASE_URL}/v1/payments/checkout-session`,
      payload,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    );
    return response.data;
  },

  verifyPayment: async (orderId: string): Promise<{ success: boolean; data: any }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await axios.get(`${API_BASE_URL}/v1/payments/verify/${orderId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  },

  refundPayment: async (paymentId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await axios.post(
      `${API_BASE_URL}/v1/payments/${paymentId}/refund`,
      { reason },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    );
    return response.data;
  }
};
