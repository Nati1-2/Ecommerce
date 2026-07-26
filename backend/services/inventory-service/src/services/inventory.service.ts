import { getRedisClient } from '../config/redis.js';
import { InventoryItem, IInventoryItem } from '../models/InventoryItem.js';
import { StockMovement, MovementType } from '../models/StockMovement.js';
import { publishInventoryLowStock, publishInventoryReserved } from '../events/inventory.publisher.js';
import { logger } from '../utils/logger.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class InventoryService {
  /**
   * Acquires a distributed lock on a product using Redis NX PX
   */
  private static async acquireLock(
    productId: string,
    ttlMs = 5000,
    retryDelayMs = 100,
    maxRetries = 30
  ): Promise<boolean> {
    const client = getRedisClient();
    const lockKey = `lock:inventory:${productId}`;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await client.set(lockKey, 'locked', 'PX', ttlMs, 'NX');
        if (result === 'OK') {
          return true;
        }
      } catch (err) {
        logger.error(`Error acquiring Redis lock for ${productId}:`, err);
      }
      await sleep(retryDelayMs);
    }
    return false;
  }

  /**
   * Releases a distributed lock on a product
   */
  private static async releaseLock(productId: string): Promise<void> {
    try {
      const client = getRedisClient();
      const lockKey = `lock:inventory:${productId}`;
      await client.del(lockKey);
    } catch (err) {
      logger.error(`Error releasing Redis lock for ${productId}:`, err);
    }
  }

  /**
   * Fetches an inventory item, lazily creating it if not present
   */
  public static async getInventoryByProductId(productId: string): Promise<IInventoryItem> {
    let item = await InventoryItem.findOne({ productId });
    if (!item) {
      logger.info(`Lazy-creating inventory item for product: ${productId}`);
      item = await InventoryItem.create({
        productId,
        totalStock: 0,
        reservedStock: 0,
        lowStockThreshold: 5
      });
    }
    return item;
  }

  /**
   * Replenishes stock for a product
   */
  public static async replenishStock(
    productId: string,
    quantity: number,
    warehouseLocation?: string,
    notes?: string
  ): Promise<IInventoryItem> {
    const lockAcquired = await this.acquireLock(productId);
    if (!lockAcquired) {
      throw new Error(`Failed to acquire inventory lock for product ${productId}`);
    }

    try {
      const item = await this.getInventoryByProductId(productId);
      
      item.totalStock += quantity;
      if (warehouseLocation) {
        item.warehouseLocation = warehouseLocation;
      }
      await item.save();

      await StockMovement.create({
        productId,
        quantity,
        type: 'REPLENISHMENT',
        notes: notes || 'Manual replenishment'
      });

      logger.info(`Stock replenished for ${productId}: +${quantity}. New total: ${item.totalStock}`);
      return item;
    } finally {
      await this.releaseLock(productId);
    }
  }

  /**
   * Reserves stock for an order (with lock & rollback mechanism)
   */
  public static async reserveStock(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    const reservedItems: Array<{ productId: string; quantity: number }> = [];

    try {
      for (const item of items) {
        const { productId, quantity } = item;
        
        const lockAcquired = await this.acquireLock(productId);
        if (!lockAcquired) {
          throw new Error(`Concurrency Lock Timeout: Could not reserve stock for ${productId}`);
        }

        try {
          const inv = await this.getInventoryByProductId(productId);
          
          if (inv.availableStock < quantity) {
            throw new Error(`Insufficient stock for product ${productId}. Available: ${inv.availableStock}, requested: ${quantity}`);
          }

          inv.reservedStock += quantity;
          await inv.save();

          await StockMovement.create({
            productId,
            quantity,
            type: 'RESERVATION',
            referenceId: orderId,
            notes: `Checkout reservation for order: ${orderId}`
          });

          reservedItems.push({ productId, quantity });
          logger.info(`Stock reserved for product ${productId}: ${quantity} items (Order: ${orderId})`);
        } finally {
          await this.releaseLock(productId);
        }
      }

      // Publish success event
      await publishInventoryReserved(orderId, items);

    } catch (error: any) {
      logger.error(`Stock reservation failed for order ${orderId}. Rolling back...`, error);
      
      // Rollback already reserved items
      if (reservedItems.length > 0) {
        await this.releaseStock(orderId, reservedItems);
      }
      
      throw error;
    }
  }

  /**
   * Releases stock reservation (e.g. order cancelled)
   */
  public static async releaseStock(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    for (const item of items) {
      const { productId, quantity } = item;
      
      const lockAcquired = await this.acquireLock(productId);
      if (!lockAcquired) {
        logger.error(`Failed to acquire lock to release stock for ${productId}`);
        continue;
      }

      try {
        const inv = await this.getInventoryByProductId(productId);
        
        // Decrement reserved stock, capped at 0
        inv.reservedStock = Math.max(0, inv.reservedStock - quantity);
        await inv.save();

        await StockMovement.create({
          productId,
          quantity: -quantity,
          type: 'RELEASE',
          referenceId: orderId,
          notes: `Reservation release for order: ${orderId}`
        });

        logger.info(`Released reservation for ${productId}: -${quantity} items (Order: ${orderId})`);
      } finally {
        await this.releaseLock(productId);
      }
    }
  }

  /**
   * Deducts stock permanently (e.g. payment completed)
   */
  public static async deductStock(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    for (const item of items) {
      const { productId, quantity } = item;
      
      const lockAcquired = await this.acquireLock(productId);
      if (!lockAcquired) {
        logger.error(`Failed to acquire lock to deduct stock for ${productId}`);
        continue;
      }

      try {
        const inv = await this.getInventoryByProductId(productId);
        
        // Deduct from total and reserved
        inv.totalStock = Math.max(0, inv.totalStock - quantity);
        inv.reservedStock = Math.max(0, inv.reservedStock - quantity);
        await inv.save();

        await StockMovement.create({
          productId,
          quantity: -quantity,
          type: 'DEDUCTION',
          referenceId: orderId,
          notes: `Sale deduction for order: ${orderId}`
        });

        logger.info(`Deducted stock permanently for ${productId}: -${quantity} items (Order: ${orderId})`);

        // Check low-stock threshold
        if (inv.availableStock <= inv.lowStockThreshold) {
          logger.warn(`⚠️ Low Stock Alert for ${productId}! Available: ${inv.availableStock}`);
          await publishInventoryLowStock(productId, inv.availableStock, inv.lowStockThreshold);
        }
      } finally {
        await this.releaseLock(productId);
      }
    }
  }

  /**
   * Retrieves items that are currently low in stock
   */
  public static async getLowStockItems(): Promise<IInventoryItem[]> {
    // We need to fetch items where availableStock <= lowStockThreshold.
    // Since availableStock is virtual, we do it via aggregation or direct query using $expr
    return InventoryItem.find({
      $expr: {
        $lte: [{ $subtract: ['$totalStock', '$reservedStock'] }, '$lowStockThreshold']
      }
    });
  }
}
