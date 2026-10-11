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
  return localStorage.getItem("auth_token") || "";
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
    try {
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
    } catch {
      return {
        totalOrders: 0,
        totalGrowth: 0,
        todayOrders: 0,
        todayGrowth: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        cancelledChange: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
      };
    }
  },

  getOrders: async (): Promise<AdminOrderModel[]> => {
    try {
      const data = await apiFetch<{ orders: any[] }>("/api/admin/orders");
      return (data.orders || []).map((o) => ({
        id: o.id,
        customerName: o.customerName || "Customer",
        customerEmail: o.customerEmail || "",
        customerAvatar: o.customerAvatar || "",
        customerPhone: o.customerPhone || "",
        shippingAddress: o.shippingAddress || "Direct Fulfillment",
        vendorStore: o.vendorName || "Direct Merchant",
        vendorId: o.vendorId || "",
        products: (o.products || o.items || []).map((item: any) => ({
          id: item.id || item.productId || "prod_1",
          name: item.name || item.productName || "Order Item",
          image: item.image || item.productImage || "",
          quantity: item.quantity || 1,
          price: item.price || item.unitPrice || 0,
          variant: item.variant || "Standard",
        })),
        amount: o.totalAmount || 0,
        subtotal: o.subtotal || o.totalAmount || 0,
        tax: o.tax || 0.0,
        shippingFee: o.shippingFee || 0.0,
        discount: o.discount || 0.0,
        paymentStatus: o.paymentStatus || "Paid",
        orderStatus: o.status || "Processing",
        paymentMethod: o.paymentMethod || "Stripe Card",
        stripeChargeId: o.stripeChargeId || (o.orderNumber ? `ch_${o.orderNumber}` : `ch_${o.id}`),
        carrier: o.carrier || "Standard Carrier",
        trackingNumber: o.trackingNumber || `TRK-${o.orderNumber || o.id}`,
        estimatedDelivery: o.estimatedDelivery || "2-4 Business Days",
        createdAt: o.createdAt || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  getOrderById: async (id: string): Promise<AdminOrderModel | undefined> => {
    const list = await adminOrderApi.getOrders();
    return list.find((o) => o.id === id);
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<AdminOrderModel> => {
    const list = await adminOrderApi.getOrders();
    const o = list.find((order) => order.id === id);
    if (o) o.orderStatus = newStatus;
    if (!o) throw new Error("Order not found");
    return o;
  },

  processRefund: async (id: string, amount: number, reason: string): Promise<AdminOrderModel> => {
    const list = await adminOrderApi.getOrders();
    const o = list.find((order) => order.id === id);
    if (o) {
      o.orderStatus = "Refunded";
      o.paymentStatus = "Refunded";
    }
    if (!o) throw new Error("Order not found");
    return o;
  },

  resolveDispute: async (disputeId: string, resolution: "Refund" | "Dismiss"): Promise<boolean> => {
    return true;
  },

  updateTracking: async (id: string, carrier: string, trackingNumber: string): Promise<AdminOrderModel> => {
    const list = await adminOrderApi.getOrders();
    const o = list.find((order) => order.id === id);
    if (o) {
      o.carrier = carrier;
      o.trackingNumber = trackingNumber;
    }
    if (!o) throw new Error("Order not found");
    return o;
  },

  cancelOrder: async (id: string): Promise<AdminOrderModel> => {
    const list = await adminOrderApi.getOrders();
    const o = list.find((order) => order.id === id);
    if (o) o.orderStatus = "Cancelled";
    if (!o) throw new Error("Order not found");
    return o;
  },

  bulkUpdateStatus: async (ids: string[], status: OrderStatus): Promise<boolean> => {
    return true;
  },

  getVendorDistribution: async (): Promise<VendorOrderDistributionPoint[]> => {
    try {
      const data = await apiFetch<{ vendors: any[] }>("/api/admin/vendors");
      return (data.vendors || []).map((v) => ({
        vendor: v.storeName,
        orders: v.orders || v.sales || 0,
        revenue: v.revenue || 0,
      }));
    } catch {
      return [];
    }
  },

  getPaymentSummary: async (): Promise<PaymentSummaryData> => {
    try {
      const data = await apiFetch<{ payments: any }>("/api/admin/payments");
      const p = data.payments || {};
      return {
        successfulPayments: p.successfulPayments || 0,
        successfulAmount: p.pendingPayoutsAmount || 0,
        failedPayments: p.failedPayments || 0,
        pendingPayments: 0,
        refundedPayments: p.refundsProcessed || 0,
        refundedAmount: 0,
      };
    } catch {
      return {
        successfulPayments: 0,
        successfulAmount: 0,
        failedPayments: 0,
        pendingPayments: 0,
        refundedPayments: 0,
        refundedAmount: 0,
      };
    }
  },

  getDisputes: async (): Promise<DisputeCase[]> => {
    return [];
  },
};
