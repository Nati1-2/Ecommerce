import { Request, Response } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getVendorOrders,
} from '../services/order.service';
import { OrderStatus, PaymentStatus } from '../models/order.model';

/**
 * POST /api/orders - Create a new order
 */
export async function createOrderHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const { items, shippingAddress, totalAmount, shippingCost, tax, grandTotal, notes } = req.body;

  const order = await createOrder({
    userId,
    items,
    shippingAddress,
    totalAmount,
    shippingCost,
    tax,
    grandTotal,
    notes,
  });

  res.status(201).json({
    message: 'Order created successfully',
    order,
  });
}

/**
 * GET /api/orders - Get authenticated user's order history
 */
export async function getUserOrdersHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  const result = await getUserOrders(userId, { page, limit });

  res.status(200).json(result);
}

/**
 * GET /api/orders/:orderId - Get order details
 */
export async function getOrderByIdHandler(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const userId = req.currentUser!.id;
  const userRole = req.currentUser!.role;

  const order = await getOrderById(orderId, userId, userRole);

  res.status(200).json({ order });
}

/**
 * PUT /api/orders/:orderId/cancel - Cancel an order
 */
export async function cancelOrderHandler(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const userId = req.currentUser!.id;
  const { cancelReason } = req.body;

  const order = await cancelOrder(orderId, userId, cancelReason);

  res.status(200).json({
    message: 'Order cancelled successfully',
    order,
  });
}

/**
 * PUT /api/orders/:orderId/status - Update order status (admin/vendor)
 */
export async function updateOrderStatusHandler(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { status, trackingNumber, estimatedDelivery } = req.body;

  const order = await updateOrderStatus(orderId, status, trackingNumber, estimatedDelivery);

  res.status(200).json({
    message: 'Order status updated successfully',
    order,
  });
}

/**
 * GET /api/orders/admin/all - Get all orders with filters (admin)
 */
export async function getAllOrdersHandler(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
  const orderStatus = req.query.orderStatus as OrderStatus | undefined;
  const paymentStatus = req.query.paymentStatus as PaymentStatus | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  const result = await getAllOrders({
    page,
    limit,
    orderStatus,
    paymentStatus,
    startDate,
    endDate,
  });

  res.status(200).json(result);
}

/**
 * GET /api/orders/vendor/orders - Get vendor's orders
 */
export async function getVendorOrdersHandler(req: Request, res: Response): Promise<void> {
  const vendorId = req.currentUser!.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  const result = await getVendorOrders(vendorId, { page, limit });

  res.status(200).json(result);
}
