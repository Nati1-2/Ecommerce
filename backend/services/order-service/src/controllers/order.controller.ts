import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { OrderService } from '../services/order.service.js';
import { createOrderSchema, updateShippingSchema, cancelOrderSchema } from '../validators/order.validator.js';

export class OrderController {
  /**
   * Submits a new order (Checkout)
   */
  public static async createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const validated = createOrderSchema.parse(req.body);
      const order = await OrderService.createOrder({
        customerId: req.user.id,
        ...validated
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves orders placed by current user
   */
  public static async getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const orders = await OrderService.getOrdersByCustomer(req.user.id);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves orders containing items supplied by current vendor
   */
  public static async getVendorOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const orders = await OrderService.getOrdersByVendor(req.user.id);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves detailed order by orderId
   */
  public static async getOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id as string);

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      // Permissions check: Owner, Vendor of item in order, or Admin
      const isOwner = req.user?.id === order.customerId;
      const isAdmin = req.user?.role.toLowerCase() === 'admin';
      const isVendorOfItem = order.items.some((item) => item.vendorId === req.user?.id);

      if (!isOwner && !isAdmin && !isVendorOfItem) {
        res.status(403).json({ success: false, message: 'Forbidden: Access denied to this order' });
        return;
      }

      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates shipping info and sets order status to SHIPPED
   */
  public static async shipOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateShippingSchema.parse(req.body);
      const estimatedDelivery = validated.estimatedDelivery ? new Date(validated.estimatedDelivery) : undefined;

      const order = await OrderService.shipOrder(
        id as string,
        validated.carrier,
        validated.trackingNumber,
        estimatedDelivery
      );

      res.status(200).json({
        success: true,
        message: 'Order updated to SHIPPED with tracking info',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancels an order
   */
  public static async cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = cancelOrderSchema.parse(req.body);

      const order = await OrderService.cancelOrder(id as string, validated.reason);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns paginated list of all system orders (Admin)
   */
  public static async getAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await OrderService.getAllOrders(page, limit);

      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
