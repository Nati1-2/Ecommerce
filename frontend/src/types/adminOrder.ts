export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  variant: string;
}

export interface AdminOrderModel {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  customerPhone: string;
  shippingAddress: string;
  vendorStore: string;
  vendorId: string;
  products: OrderItem[];
  amount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  stripeChargeId: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface OrderTimelineStep {
  step: string;
  timestamp: string;
  service: string;
  status: "completed" | "current" | "upcoming";
}

export interface DisputeCase {
  id: string;
  orderId: string;
  customerName: string;
  vendorStore: string;
  complaintReason: string;
  customerEvidence: string[];
  vendorResponse: string;
  status: "Open" | "Resolved" | "Escalated";
  createdAt: string;
}

export interface RefundRequest {
  orderId: string;
  amount: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  stripeRefundId?: string;
}

export interface OrderStatsData {
  totalOrders: number;
  totalGrowth: number;
  todayOrders: number;
  todayGrowth: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  cancelledChange: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface OrderFilterCriteria {
  searchQuery: string;
  orderStatusFilter: string;
  paymentStatusFilter: string;
  dateFilter: string;
}

export interface VendorOrderDistributionPoint {
  vendor: string;
  orders: number;
  revenue: number;
}

export interface PaymentSummaryData {
  successfulPayments: number;
  successfulAmount: number;
  failedPayments: number;
  pendingPayments: number;
  refundedPayments: number;
  refundedAmount: number;
}
