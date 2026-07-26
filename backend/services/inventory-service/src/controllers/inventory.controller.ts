import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { replenishSchema, reserveSchema, releaseSchema, deductSchema } from '../validators/inventory.validator.js';

export class InventoryController {
  /**
   * Retrieves stock levels for a product
   */
  public static async getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params;
      if (!productId) {
        res.status(400).json({ success: false, message: 'Product ID parameter is required' });
        return;
      }
      const item = await InventoryService.getInventoryByProductId(productId as string);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Replenishes stock levels (manual / admin restock)
   */
  public static async replenish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = replenishSchema.parse(req.body);
      const { productId, quantity, warehouseLocation, notes } = validated;

      const item = await InventoryService.replenishStock(
        productId,
        quantity,
        warehouseLocation,
        notes
      );

      res.status(200).json({
        success: true,
        message: 'Stock replenished successfully',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reserves stock (checkout phase)
   */
  public static async reserve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, items } = req.body;
      
      if (!orderId || !items || !Array.isArray(items)) {
        res.status(400).json({ success: false, message: 'Invalid payload: orderId and items list required' });
        return;
      }

      // Validate each item
      for (const item of items) {
        reserveSchema.parse({ ...item, orderId });
      }

      await InventoryService.reserveStock(orderId, items);

      res.status(200).json({
        success: true,
        message: 'Stock reserved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Releases stock reservation (cancelled checkout / expired cart)
   */
  public static async release(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, items } = req.body;

      if (!orderId || !items || !Array.isArray(items)) {
        res.status(400).json({ success: false, message: 'Invalid payload: orderId and items list required' });
        return;
      }

      for (const item of items) {
        releaseSchema.parse({ ...item, orderId });
      }

      await InventoryService.releaseStock(orderId, items);

      res.status(200).json({
        success: true,
        message: 'Stock reservation released successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deducts stock permanently (completed checkout / order paid)
   */
  public static async deduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, items } = req.body;

      if (!orderId || !items || !Array.isArray(items)) {
        res.status(400).json({ success: false, message: 'Invalid payload: orderId and items list required' });
        return;
      }

      for (const item of items) {
        deductSchema.parse(item);
      }

      await InventoryService.deductStock(orderId, items);

      res.status(200).json({
        success: true,
        message: 'Stock deducted permanently'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets items with stock below threshold
   */
  public static async getLowStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await InventoryService.getLowStockItems();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }
}
