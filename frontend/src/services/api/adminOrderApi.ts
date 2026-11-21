import {
  AdminOrderModel,
  OrderStatsData,
  DisputeCase,
  VendorOrderDistributionPoint,
  PaymentSummaryData,
  OrderStatus,
} from "@/types/adminOrder";

function getToken(): string {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("auth_token");
  if (token) return token;
  try {
    const authStore = localStorage.getItem("auth-storage");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      if (parsed?.state?.accessToken) return parsed.state.accessToken;
    }
  } catch {}
  return "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const adminOrderApi = {
  getOrderStats: async (): Promise<OrderStatsData> => {
    {
      const data = await apiFetch<{ orders: any[] }>("/api/admin/orders");
      const list = data.orders || [];
      const totalRev = list.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pending = list.filter((o) => o.status === "Pending" || o.status === "Processing").length;
      const completed = list.filter((o) => o.status === "Delivered" || o.status === "Shipped").length;
      const cancelled = list.filter((o) => o.status === "Cancelled").length;

      return {
        totalOrders: list.length,
        totalGrowth: 0,
        todayOrders: 0,
        todayGrowth: 0,
        pendingOrders: pending,
        completedOrders: completed,
        cancelledOrders: cancelled,
        cancelledChange: 0,
        totalRevenue: Math.round(totalRev * 100) / 100,
        revenueGrowth: 0,
      };
    }
  },

  getOrders: async (): Promise<AdminOrderModel[]> => {
    {
      const data = await apiFetch<{ orders: any[] }>("/api/admin/orders");
      return (data.orders || []).map((o) => ({
        id: o.id,
        customerName: o.customerName || "",
        customerEmail: o.customerEmail || "",
        customerAvatar: o.customerAvatar || "",
        customerPhone: o.customerPhone || "",
        shippingAddress: o.shippingAddress || "",
        vendorStore: o.vendorName || "",
        vendorId: o.vendorId || "",
        products: (o.products || o.items || []).map((item: any) => ({
          id: item.id || item.productId || "",
          name: item.name || item.productName || "",
          image: item.image || item.productImage || "",
          quantity: item.quantity ?? 0,
          price: item.price || item.unitPrice || 0,
          variant: item.variant || "",
        })),
        amount: o.totalAmount || 0,
        subtotal: o.subtotal || o.totalAmount || 0,
        tax: o.tax || 0.0,
        shippingFee: o.shippingFee || 0.0,
        discount: o.discount || 0.0,
        paymentStatus: o.paymentStatus || "PENDING",
        orderStatus: o.status || "PENDING",
        paymentMethod: o.paymentMethod || "",
        stripeChargeId: o.stripeChargeId || "",
        carrier: o.carrier || "",
        trackingNumber: o.trackingNumber || "",
        estimatedDelivery: o.estimatedDelivery || "",
        createdAt: o.createdAt || "",
      }));
    }
  },

  getOrderById: async (id: string): Promise<AdminOrderModel | undefined> => {
    const list = await adminOrderApi.getOrders();
    return list.find((o) => o.id === id);
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<AdminOrderModel> => {
    throw new Error("Order status updates are not connected to the order service.");
  },

  processRefund: async (id: string, amount: number, reason: string): Promise<AdminOrderModel> => {
    throw new Error("Refund processing requires a connected payment service.");
  },

  resolveDispute: async (disputeId: string, resolution: "Refund" | "Dismiss"): Promise<boolean> => {
    throw new Error("Dispute resolution is not connected to the payment service.");
  },

  updateTracking: async (id: string, carrier: string, trackingNumber: string): Promise<AdminOrderModel> => {
    throw new Error("Tracking updates are not connected to the order service.");
  },

  cancelOrder: async (id: string): Promise<AdminOrderModel> => {
    throw new Error("Order cancellation is not connected to the order service.");
  },

  bulkUpdateStatus: async (ids: string[], status: OrderStatus): Promise<boolean> => {
    throw new Error("Bulk order updates are not connected to the order service.");
  },

  getVendorDistribution: async (): Promise<VendorOrderDistributionPoint[]> => {
    {
      const data = await apiFetch<{ vendors: any[] }>("/api/admin/vendors");
      return (data.vendors || []).map((v) => ({
        vendor: v.storeName,
        orders: v.orders || v.sales || 0,
        revenue: v.revenue || 0,
      }));
    }
  },

  getPaymentSummary: async (): Promise<PaymentSummaryData> => {
    {
      const data = await apiFetch<{ payments: any }>("/api/admin/payments");
      const p = data.payments || {};
      return {
        successfulPayments: p.successfulPayments || 0,
        successfulAmount: 0,
        failedPayments: p.failedPayments || 0,
        pendingPayments: 0,
        refundedPayments: p.refundsProcessed || 0,
        refundedAmount: 0,
      };
    }
  },

  getDisputes: async (): Promise<DisputeCase[]> => {
    return [];
  },
};
