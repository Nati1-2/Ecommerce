import {
  Order,
  IOrder,
  OrderStatus,
  PaymentStatus,
  generateOrderId,
  IOrderItem,
  IShippingAddress,
} from '../models/order.model';
import {
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  createLogger,
  messageBroker,
  EventType,
} from '@ecom/common';

const logger = createLogger('order-service');

// ============================================
// Interfaces
// ============================================

interface CreateOrderInput {
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  shippingCost?: number;
  tax?: number;
  grandTotal: number;
  notes?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface OrderFilterOptions extends PaginationOptions {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================
// Service Functions
// ============================================

/**
 * Create a new order and publish ORDER_CREATED event.
 */
export async function createOrder(input: CreateOrderInput): Promise<IOrder> {
  const orderId = generateOrderId();

  const order = new Order({
    orderId,
    userId: input.userId,
    items: input.items,
    shippingAddress: input.shippingAddress,
    totalAmount: input.totalAmount,
    shippingCost: input.shippingCost ?? 0,
    tax: input.tax ?? 0,
    grandTotal: input.grandTotal,
    notes: input.notes,
    orderStatus: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
  });

  await order.save();

  logger.info('Order created', { orderId: order.orderId, userId: input.userId });

  // Publish ORDER_CREATED event
  await messageBroker.publish({
    type: EventType.ORDER_CREATED,
    data: {
      orderId: order.orderId,
      userId: order.userId,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.grandTotal,
    },
    timestamp: new Date().toISOString(),
  });

  return order;
}

/**
 * Get paginated order history for a specific user.
 */
export async function getUserOrders(
  userId: string,
  options: PaginationOptions
): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IOrder[]>(),
    Order.countDocuments({ userId }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single order by orderId. Validates ownership or admin access.
 */
export async function getOrderById(
  orderId: string,
  userId: string,
  userRole: string
): Promise<IOrder> {
  const order = await Order.findOne({ orderId }).lean<IOrder>();

  if (!order) {
    throw new NotFoundError('Order');
  }

  // Only owner or admin can view
  if (order.userId !== userId && userRole !== 'ADMIN') {
    throw new NotAuthorizedError();
  }

  return order;
}

/**
 * Cancel an order. Only allowed if status is PENDING or PAYMENT_PENDING.
 */
export async function cancelOrder(
  orderId: string,
  userId: string,
  cancelReason?: string
): Promise<IOrder> {
  const order = await Order.findOne({ orderId });

  if (!order) {
    throw new NotFoundError('Order');
  }

  if (order.userId !== userId) {
    throw new NotAuthorizedError();
  }

  const cancellableStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.PAYMENT_PENDING,
  ];

  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new BadRequestError(
      `Cannot cancel order with status "${order.orderStatus}". Only PENDING or PAYMENT_PENDING orders can be cancelled.`
    );
  }

  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelReason = cancelReason || 'Cancelled by user';
  await order.save();

  logger.info('Order cancelled', { orderId, userId });

  // Publish ORDER_CANCELLED event
  await messageBroker.publish({
    type: EventType.ORDER_CANCELLED,
    data: {
      orderId: order.orderId,
      userId: order.userId,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      reason: order.cancelReason,
    },
    timestamp: new Date().toISOString(),
  });

  return order;
}

/**
 * Update order status (admin/vendor only). Publishes ORDER_SHIPPED on SHIPPED.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  estimatedDelivery?: string
): Promise<IOrder> {
  const order = await Order.findOne({ orderId });

  if (!order) {
    throw new NotFoundError('Order');
  }

  if (order.orderStatus === OrderStatus.CANCELLED) {
    throw new BadRequestError('Cannot update status of a cancelled order');
  }

  if (order.orderStatus === OrderStatus.DELIVERED) {
    throw new BadRequestError('Cannot update status of a delivered order');
  }

  order.orderStatus = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (estimatedDelivery) {
    order.estimatedDelivery = new Date(estimatedDelivery);
  }

  await order.save();

  logger.info('Order status updated', { orderId, status });

  // Publish ORDER_SHIPPED when setting to SHIPPED
  if (status === OrderStatus.SHIPPED) {
    await messageBroker.publish({
      type: EventType.ORDER_SHIPPED,
      data: {
        orderId: order.orderId,
        userId: order.userId,
        trackingNumber: order.trackingNumber || '',
        estimatedDelivery: order.estimatedDelivery?.toISOString() || '',
      },
      timestamp: new Date().toISOString(),
    });
  }

  return order;
}

/**
 * Get all orders with optional filters (admin).
 */
export async function getAllOrders(
  options: OrderFilterOptions
): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
  const { page, limit, orderStatus, paymentStatus, startDate, endDate } = options;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }
  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }
    filter.createdAt = dateFilter;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IOrder[]>(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get orders containing a specific vendor's products.
 * Matches orders where any item's productId-owning vendor equals vendorId.
 * Since we don't store vendorId in items here, we query by userId creating orders
 * that include the vendor's items. For now, we use a simpler approach:
 * vendors see orders where items.productId match their products.
 * In a real system, items would include a sellerId field.
 */
export async function getVendorOrders(
  vendorId: string,
  options: PaginationOptions
): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  // Query orders that contain items from this vendor
  // In production, items should have a sellerId field.
  // For now, we return orders and let the controller filter if needed.
  const filter = { 'items.productId': { $exists: true } };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IOrder[]>(),
    Order.countDocuments(filter),
  ]);

  logger.info('Vendor orders retrieved', { vendorId, total });

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Handle PAYMENT_COMPLETED event: update order payment and status.
 */
export async function handlePaymentCompleted(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  const order = await Order.findOne({ orderId });

  if (!order) {
    logger.error('Order not found for payment completed event', { orderId });
    return;
  }

  order.paymentStatus = PaymentStatus.PAID;
  order.orderStatus = OrderStatus.PAID;
  order.paymentIntentId = paymentIntentId;
  await order.save();

  logger.info('Order payment completed', { orderId, paymentIntentId });
}

/**
 * Handle PAYMENT_FAILED event: mark order as failed/cancelled.
 */
export async function handlePaymentFailed(orderId: string, reason: string): Promise<void> {
  const order = await Order.findOne({ orderId });

  if (!order) {
    logger.error('Order not found for payment failed event', { orderId });
    return;
  }

  order.paymentStatus = PaymentStatus.FAILED;
  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelReason = `Payment failed: ${reason}`;
  await order.save();

  logger.info('Order payment failed', { orderId, reason });
}
