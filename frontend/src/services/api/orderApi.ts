import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const orderApi = {
  createOrder: async (orderData: any) => {
    const response = await axios.post(`${API_BASE_URL}/v1/orders`, orderData, { headers: getHeaders() });
    return response.data;
  },
  
  getOrder: async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/v1/orders/${orderId}`, { headers: getHeaders() });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/orders`, { headers: getHeaders() });
    return response.data;
  }
};
