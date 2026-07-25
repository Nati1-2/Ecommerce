export enum EventType {
  USER_CREATED = 'user:created',
  USER_UPDATED = 'user:updated',
  PRODUCT_CREATED = 'product:created',
  PRODUCT_UPDATED = 'product:updated',
  ORDER_CREATED = 'order:created',
  ORDER_COMPLETED = 'order:completed',
  ORDER_CANCELLED = 'order:cancelled',
  PAYMENT_SUCCESS = 'payment:success',
  PAYMENT_FAILED = 'payment:failed',
  REFUND_CREATED = 'refund:created',
  STOCK_UPDATED = 'stock:updated',
  STOCK_LOW = 'stock:low'
}

export interface UserCreatedEvent {
  type: EventType.USER_CREATED;
  data: {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
    firstName?: string;
    lastName?: string;
  };
}

export interface ProductCreatedEvent {
  type: EventType.PRODUCT_CREATED;
  data: {
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    vendorId: string;
    categoryId: string;
    imageUrl?: string;
  };
}

export interface OrderCreatedEvent {
  type: EventType.ORDER_CREATED;
  data: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    totalAmount: number;
    items: Array<{
      productId: string;
      sku: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
}

export interface PaymentSuccessEvent {
  type: EventType.PAYMENT_SUCCESS;
  data: {
    orderId: string;
    transactionId: string;
    amountPaid: number;
    stripePaymentIntentId: string;
  };
}

export interface StockLowEvent {
  type: EventType.STOCK_LOW;
  data: {
    productId: string;
    sku: string;
    availableStock: number;
    vendorId: string;
  };
}
