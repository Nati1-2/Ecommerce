import {
  AdminOrderModel,
  OrderStatsData,
  DisputeCase,
  VendorOrderDistributionPoint,
  PaymentSummaryData,
  OrderStatus,
} from "@/types/adminOrder";

let mockStats: OrderStatsData = {
  totalOrders: 1200000,
  totalGrowth: 18.5,
  todayOrders: 5400,
  todayGrowth: 14.2,
  pendingOrders: 1250,
  completedOrders: 1100000,
  cancelledOrders: 5000,
  cancelledChange: -1.2,
  totalRevenue: 15000000,
  revenueGrowth: 22.1,
};

let mockOrders: AdminOrderModel[] = [
  {
    id: "ord_90101",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@techcorp.com",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    customerPhone: "+1 (415) 890-1234",
    shippingAddress: "742 Evergreen Terrace, San Francisco, CA 94107",
    vendorStore: "Apex Tech Labs",
    vendorId: "v_101",
    products: [
      {
        id: "prod_1001",
        name: "MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 3499.00,
        variant: "Space Black / 1TB",
      },
    ],
    amount: 3499.00,
    subtotal: 3499.00,
    tax: 280.00,
    shippingFee: 0.00,
    discount: 0.00,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    paymentMethod: "Credit Card (Visa •••• 4242)",
    stripeChargeId: "ch_3N8xY2Lkd890192A",
    carrier: "FedEx Express",
    trackingNumber: "789123049102",
    estimatedDelivery: "2026-07-21",
    createdAt: "2026-07-18 14:22 UTC",
  },
  {
    id: "ord_90102",
    customerName: "Michael Chen",
    customerEmail: "mchen@horizon.dev",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    customerPhone: "+1 (206) 555-9012",
    shippingAddress: "1200 5th Ave, Seattle, WA 98101",
    vendorStore: "Quantum Sound Audio",
    vendorId: "v_102",
    products: [
      {
        id: "prod_1002",
        name: "Quantum Noise Cancelling Wireless Headphones Gen 2",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
        quantity: 2,
        price: 349.50,
        variant: "Matte Black",
      },
    ],
    amount: 699.00,
    subtotal: 699.00,
    tax: 56.00,
    shippingFee: 15.00,
    discount: 20.00,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    paymentMethod: "Apple Pay (MasterCard •••• 8819)",
    stripeChargeId: "ch_3N8xZ5Lkd441098B",
    carrier: "UPS Ground",
    trackingNumber: "1Z9999999999999999",
    estimatedDelivery: "2026-07-22",
    createdAt: "2026-07-19 02:10 UTC",
  },
  {
    id: "ord_90103",
    customerName: "Marcus Sterling",
    customerEmail: "marcus@luminavision.com",
    customerAvatar: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=150&q=80",
    customerPhone: "+1 (312) 789-0123",
    shippingAddress: "350 N Orleans St, Chicago, IL 60654",
    vendorStore: "Hyperion Ergonomics",
    vendorId: "v_103",
    products: [
      {
        id: "prod_1003",
        name: "Hyperion Ergonomic Mesh Executive Office Chair",
        image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 649.00,
        variant: "Graphite Frame",
      },
    ],
    amount: 649.00,
    subtotal: 649.00,
    tax: 52.00,
    shippingFee: 40.00,
    discount: 50.00,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    paymentMethod: "Stripe Escrow Bank Transfer",
    stripeChargeId: "ch_3N8xA1Lkd190283C",
    carrier: "DHL Express",
    trackingNumber: "DHL-901928401",
    estimatedDelivery: "2026-07-24",
    createdAt: "2026-07-19 00:45 UTC",
  },
  {
    id: "ord_90104",
    customerName: "David Miller",
    customerEmail: "david.m@suspicious.org",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    customerPhone: "+1 (555) 321-9988",
    shippingAddress: "100 Ocean Drive, Miami, FL 33139",
    vendorStore: "Aura Wearable Tech",
    vendorId: "v_104",
    products: [
      {
        id: "prod_1004",
        name: "Aura Luxury Titanium Smartwatch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 49.00,
        variant: "Leather Strap",
      },
    ],
    amount: 49.00,
    subtotal: 49.00,
    tax: 4.00,
    shippingFee: 5.00,
    discount: 0.00,
    paymentStatus: "Refunded",
    orderStatus: "Refunded",
    paymentMethod: "Credit Card (Amex •••• 1004)",
    stripeChargeId: "ch_3N8xB8Lkd551092D",
    carrier: "USPS Priority",
    trackingNumber: "94001118995629102",
    estimatedDelivery: "2026-07-15",
    createdAt: "2026-07-12 18:30 UTC",
  },
];

let mockDisputes: DisputeCase[] = [
  {
    id: "disp_801",
    orderId: "ord_90104",
    customerName: "David Miller",
    vendorStore: "Aura Wearable Tech",
    complaintReason: "Counterfeit Brand Item Received - Non-functional cardiac sensor",
    customerEvidence: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"],
    vendorResponse: "Item was shipped in original packaging.",
    status: "Open",
    createdAt: "Yesterday",
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminOrderApi = {
  getOrderStats: async (): Promise<OrderStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getOrders: async (): Promise<AdminOrderModel[]> => {
    await delay(250);
    return [...mockOrders];
  },

  getOrderById: async (id: string): Promise<AdminOrderModel | undefined> => {
    await delay(200);
    return mockOrders.find((o) => o.id === id);
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<AdminOrderModel> => {
    await delay(400);
    const o = mockOrders.find((order) => order.id === id);
    if (!o) throw new Error("Order not found");

    o.orderStatus = newStatus;
    return o;
  },

  processRefund: async (id: string, amount: number, reason: string): Promise<AdminOrderModel> => {
    await delay(400);
    const o = mockOrders.find((order) => order.id === id);
    if (!o) throw new Error("Order not found");

    o.orderStatus = "Refunded";
    o.paymentStatus = "Refunded";
    return o;
  },

  resolveDispute: async (disputeId: string, resolution: "Refund" | "Dismiss"): Promise<boolean> => {
    await delay(350);
    const d = mockDisputes.find((disp) => disp.id === disputeId);
    if (d) d.status = "Resolved";
    return true;
  },

  updateTracking: async (id: string, carrier: string, trackingNumber: string): Promise<AdminOrderModel> => {
    await delay(300);
    const o = mockOrders.find((order) => order.id === id);
    if (!o) throw new Error("Order not found");

    o.carrier = carrier;
    o.trackingNumber = trackingNumber;
    return o;
  },

  cancelOrder: async (id: string): Promise<AdminOrderModel> => {
    await delay(300);
    const o = mockOrders.find((order) => order.id === id);
    if (!o) throw new Error("Order not found");

    o.orderStatus = "Cancelled";
    return o;
  },

  bulkUpdateStatus: async (ids: string[], status: OrderStatus): Promise<boolean> => {
    await delay(400);
    mockOrders = mockOrders.map((o) => (ids.includes(o.id) ? { ...o, orderStatus: status } : o));
    return true;
  },

  getVendorDistribution: async (): Promise<VendorOrderDistributionPoint[]> => {
    await delay(200);
    return [
      { vendor: "Apex Tech Labs", orders: 8900, revenue: 3450000 },
      { vendor: "Quantum Sound", orders: 7400, revenue: 2150000 },
      { vendor: "Hyperion Ergo", orders: 3900, revenue: 1120000 },
      { vendor: "Aura Wearables", orders: 310, revenue: 89000 },
    ];
  },

  getPaymentSummary: async (): Promise<PaymentSummaryData> => {
    await delay(200);
    return {
      successfulPayments: 1180000,
      successfulAmount: 14200000,
      failedPayments: 3200,
      pendingPayments: 1250,
      refundedPayments: 1450,
      refundedAmount: 189000,
    };
  },

  getDisputes: async (): Promise<DisputeCase[]> => {
    await delay(200);
    return [...mockDisputes];
  },
};
