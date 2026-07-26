import { Order, IOrder, OrderStatus, PaymentStatus } from '../models/Order.js';
import { publishOrderCreated, publishOrderCancelled, publishOrderStatusUpdated } from '../events/order.publisher.js';
import { logger } from '../utils/logger.js';

export interface CreateOrderPayload {
  customerId: string;
  items: Array<{
    productId: string;
    vendorId?: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tax?: number;
  shippingFee?: number;
  discount?: number;
}

export class OrderService {
  /**
   * Generates a human-readable unique order ID (e.g. ORD-20260726-8942)
   */
  private static generateOrderId(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${dateStr}-${randomSuffix}`;
  }

  /**
   * Creates a new customer order (Checkout)
   */
  public static async createOrder(payload: CreateOrderPayload): Promise<IOrder> {
    const { customerId, items, shippingAddress, tax = 0, shippingFee = 0, discount = 0 } = payload;

    // Calculate item subtotals and overall pricing
    const processedItems = items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity
    }));

    const subtotal = processedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const total = Math.max(0, subtotal + tax + shippingFee - discount);

    const orderId = this.generateOrderId();

    const order = await Order.create({
      orderId,
      customerId,
      items: processedItems,
      shippingAddress,
      pricing: {
        subtotal,
        tax,
        shippingFee,
        discount,
        total
      },
      status: 'PENDING',
      paymentStatus: 'UNPAID'
    });

    logger.info(`Order created successfully: ${order.orderId} for customer: ${customerId}`);

    // Emit event for inventory reservation and saga processing
    await publishOrderCreated({
      orderId: order.orderId,
      customerId: order.customerId,
      items: order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      totalAmount: order.pricing.total
    });

    return order;
  }

  /**
   * Gets an order by its unique orderId
   */
  public static async getOrderById(orderId: string): Promise<IOrder | null> {
    return Order.findOne({ orderId });
  }

  /**
   * Fetches orders placed by a specific customer
   */
  public static async getOrdersByCustomer(customerId: string): Promise<IOrder[]> {
    return Order.find({ customerId }).sort({ createdAt: -1 });
  }

  /**
   * Fetches orders containing items supplied by a specific vendor
   */
  public static async getOrdersByVendor(vendorId: string): Promise<IOrder[]> {
    return Order.find({ 'items.vendorId': vendorId }).sort({ createdAt: -1 });
  }

  /**
   * Updates order status with validation against allowed transitions
   */
  public static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    reason?: string
  ): Promise<IOrder> {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const prevStatus = order.status;
    order.status = newStatus;

    if (reason) {
      order.cancelReason = reason;
    }

    await order.save();
    logger.info(`Order ${orderId} status updated: ${prevStatus} -> ${newStatus}`);

    await publishOrderStatusUpdated(orderId, prevStatus, newStatus);
    return order;
  }

  /**
   * Updates order payment status to PAID and status to PAID
   */
  public static async updateOrderPaymentCompleted(orderId: string): Promise<IOrder> {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    order.paymentStatus = 'PAID';
    order.status = 'PAID';
    await order.save();

    logger.info(`Order ${orderId} marked as PAID`);
    await publishOrderStatusUpdated(orderId, 'RESERVED', 'PAID');
    return order;
  }

  /**
   * Updates shipping details and marks order status as SHIPPED
   */
  public static async shipOrder(
    orderId: string,
    carrier: string,
    trackingNumber: string,
    estimatedDelivery?: Date
  ): Promise<IOrder> {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.status !== 'PAID' && order.status !== 'RESERVED') {
      throw new Error(`Cannot ship order ${orderId} with status ${order.status}. Order must be PAID or RESERVED.`);
    }

    const prevStatus = order.status;
    order.status = 'SHIPPED';
    order.tracking = {
      carrier,
      trackingNumber,
      estimatedDelivery
    };

    await order.save();
    logger.info(`Order ${orderId} marked as SHIPPED (Carrier: ${carrier}, Tracking: ${trackingNumber})`);

    await publishOrderStatusUpdated(orderId, prevStatus, 'SHIPPED');
    return order;
  }

  /**
   * User/Admin manual cancellation of an order
   */
  public static async cancelOrder(orderId: string, reason: string): Promise<IOrder> {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      throw new Error(`Cannot cancel order ${orderId} because it has already been ${order.status.toLowerCase()}`);
    }

    const prevStatus = order.status;
    order.status = 'CANCELLED';
    order.cancelReason = reason;
    await order.save();

    logger.info(`Order ${orderId} cancelled. Reason: ${reason}`);

    // Emit event to release reserved stock
    await publishOrderCancelled(
      orderId,
      order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      reason
    );

    await publishOrderStatusUpdated(orderId, prevStatus, 'CANCELLED');
    return order;
  }

  /**
   * System cancellation (e.g. payment failed or insufficient stock)
   */
  public static async cancelOrderSystem(orderId: string, reason: string): Promise<void> {
    const order = await Order.findOne({ orderId });
    if (!order || order.status === 'CANCELLED') return;

    order.status = 'CANCELLED';
    order.cancelReason = reason;
    await order.save();

    await publishOrderCancelled(
      orderId,
      order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      reason
    );
  }

  /**
   * Returns a paginated list of all orders (Admin overview)
   */
  public static async getAllOrders(page = 1, limit = 20): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments()
    ]);
    return { orders, total };
  }
}
