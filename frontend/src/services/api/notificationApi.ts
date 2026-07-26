import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api/v1";

export const notificationApi = {
  getMyNotifications: async () => {
    const res = await axios.get(`${API_BASE}/notifications/my-notifications`, {
      withCredentials: true,
    });
    return res.data;
  },

  markAsRead: async (notificationId: string) => {
    const res = await axios.put(
      `${API_BASE}/notifications/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  sendDirectNotification: async (payload: {
    recipientId: string;
    title: string;
    body: string;
    channel?: string;
  }) => {
    const res = await axios.post(`${API_BASE}/notifications/send-direct`, payload, {
      withCredentials: true,
    });
    return res.data;
  },
};
