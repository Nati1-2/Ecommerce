import {
  createLogger,
  NotFoundError,
  BadRequestError,
  messageBroker,
  EventType,
  BaseEvent,
  OrderCreatedEvent,
  OrderCancelledEvent,
  PaymentCompletedEvent,
} from '@ecom/common';
import { InventoryItem, IInventoryItem } from '../models/inventory.model';
import { StockMovement, StockMovementType } from '../models/stock-movement.model';
import { lockManager } from '../utils/lock-manager';

const logger = createLogger('inventory-service');

// ============================================
// Stock Movement Recording
// ============================================

async function recordMovement(
  productId: string,
  type: StockMovementType,
  quantity: number,
  previousStock: number,
  newStock: number,
  reason?: string,
  performedBy?: string
): Promise<void> {
  await StockMovement.create({
    productId,
    type,
    quantity,
    previousStock,
    newStock,
    reason,
    performedBy,
  });
}

// ============================================
// Public Service Methods
// ============================================

export async function getInventory(productId: string): Promise<IInventoryItem> {
  const item = await InventoryItem.findOne({ productId });
  if (!item) {
    throw new NotFoundError('Inventory item');
  }
  return item;
}

export async function restockProduct(
  productId: string,
  quantity: number,
  performedBy: string
): Promise<IInventoryItem> {
  if (quantity <= 0) {
    throw new BadRequestError('Restock quantity must be greater than zero');
  }

  return lockManager.withLock(`lock:inventory:${productId}`, async () => {
    let item = await InventoryItem.findOne({ productId });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    const previousStock = item.totalStock;
    item.totalStock += quantity;
    item.lastRestockedAt = new Date();
    await item.save();

    await recordMovement(
      productId,
      'RESTOCK',
      quantity,
      previousStock,
      item.totalStock,
      `Restocked ${quantity} units`,
      performedBy
    );

    await publishInventoryUpdated(item);

    logger.info('Product restocked', { productId, quantity, newTotal: item.totalStock });
    return item;
  });
}

export async function adjustStock(
  productId: string,
  quantity: number,
  reason: string,
  performedBy: string
): Promise<IInventoryItem> {
  return lockManager.withLock(`lock:inventory:${productId}`, async () => {
    const item = await InventoryItem.findOne({ productId });

    if (!item) {
      throw new NotFoundError('Inventory item');
    }

    const previousStock = item.totalStock;
    const newStock = item.totalStock + quantity;

    if (newStock < 0) {
      throw new BadRequestError('Adjustment would result in negative stock');
    }

    if (newStock < item.reservedStock) {
      throw new BadRequestError('Adjustment would make available stock negative (below reserved)');
    }

    item.totalStock = newStock;
    await item.save();

    await recordMovement(
      productId,
      'ADJUSTMENT',
      quantity,
      previousStock,
      item.totalStock,
      reason,
      performedBy
    );

    await publishInventoryUpdated(item);

    logger.info('Stock adjusted', { productId, quantity, reason, newTotal: item.totalStock });
    return item;
  });
}

export async function getLowStockItems(sellerId?: string): Promise<IInventoryItem[]> {
  const query: Record<string, unknown> = {
    $expr: { $lte: [{ $subtract: ['$totalStock', '$reservedStock'] }, '$lowStockThreshold'] },
  };

  if (sellerId) {
    query.sellerId = sellerId;
  }

  return InventoryItem.find(query).sort({ totalStock: 1 });
}

export async function getStockMovements(
  productId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ movements: typeof results; total: number; page: number; totalPages: number }> {
  const skip = (page - 1) * limit;
  const [results, total] = await Promise.all([
    StockMovement.find({ productId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    StockMovement.countDocuments({ productId }),
  ]);

  return {
    movements: results,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================
// Event Handlers
// ============================================

export async function handleOrderCreated(event: BaseEvent): Promise<void> {
  const data = (event as OrderCreatedEvent).data;
  const { orderId, items } = data;
  logger.info('Processing ORDER_CREATED for inventory reservation', { orderId });

  const reservationResults: Array<{ productId: string; success: boolean; reason?: string }> = [];

  for (const orderItem of items) {
    try {
      await lockManager.withLock(`lock:inventory:${orderItem.productId}`, async () => {
        const item = await InventoryItem.findOne({ productId: orderItem.productId });

        if (!item) {
          reservationResults.push({
            productId: orderItem.productId,
            success: false,
            reason: 'Product not found in inventory',
          });
          return;
        }

        const available = item.totalStock - item.reservedStock;

        if (available < orderItem.quantity) {
          reservationResults.push({
            productId: orderItem.productId,
            success: false,
            reason: `Insufficient stock. Available: ${available}, Requested: ${orderItem.quantity}`,
          });
          return;
        }

        const previousReserved = item.reservedStock;
        item.reservedStock += orderItem.quantity;
        await item.save();

        await recordMovement(
          orderItem.productId,
          'RESERVATION',
          orderItem.quantity,
          previousReserved,
          item.reservedStock,
          `Reserved for order ${orderId}`
        );

        reservationResults.push({ productId: orderItem.productId, success: true });
      });
    } catch (error) {
      logger.error('Failed to reserve stock for item', {
        productId: orderItem.productId,
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      reservationResults.push({
        productId: orderItem.productId,
        success: false,
        reason: error instanceof Error ? error.message : 'Lock acquisition failed',
      });
    }
  }

  const allSuccess = reservationResults.every((r) => r.success);

  // If any reservation failed, release the successful ones
  if (!allSuccess) {
    for (const result of reservationResults) {
      if (result.success) {
        const orderItem = items.find((i) => i.productId === result.productId);
        if (orderItem) {
          await releaseReservation(result.productId, orderItem.quantity, orderId);
        }
      }
    }
  }

  await messageBroker.publish({
    type: EventType.INVENTORY_RESERVED,
    data: {
      orderId,
      success: allSuccess,
      results: reservationResults,
    },
    timestamp: new Date().toISOString(),
    correlationId: event.correlationId,
  });

  logger.info('Inventory reservation completed', { orderId, success: allSuccess });
}

export async function handlePaymentCompleted(event: BaseEvent): Promise<void> {
  const data = (event as PaymentCompletedEvent).data;
  const { orderId } = data;
  logger.info('Processing PAYMENT_COMPLETED — deducting stock', { orderId });

  // We need to find all reservation movements for this order and process them
  const reservationMovements = await StockMovement.find({
    type: 'RESERVATION',
    reason: `Reserved for order ${orderId}`,
  });

  for (const movement of reservationMovements) {
    try {
      await lockManager.withLock(`lock:inventory:${movement.productId}`, async () => {
        const item = await InventoryItem.findOne({ productId: movement.productId });
        if (!item) {
          logger.warn('Inventory item not found during payment completion', {
            productId: movement.productId,
            orderId,
          });
          return;
        }

        const previousTotal = item.totalStock;
        item.totalStock -= movement.quantity;
        item.reservedStock -= movement.quantity;
        await item.save();

        await recordMovement(
          movement.productId,
          'SALE',
          movement.quantity,
          previousTotal,
          item.totalStock,
          `Sold via order ${orderId}`
        );

        await publishInventoryUpdated(item);
      });
    } catch (error) {
      logger.error('Failed to deduct stock after payment', {
        productId: movement.productId,
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  logger.info('Payment completion stock deduction finished', { orderId });
}

export async function handleOrderCancelled(event: BaseEvent): Promise<void> {
  const data = (event as OrderCancelledEvent).data;
  const { orderId, items } = data;
  logger.info('Processing ORDER_CANCELLED — releasing reservations', { orderId });

  for (const orderItem of items) {
    await releaseReservation(orderItem.productId, orderItem.quantity, orderId);
  }

  logger.info('Order cancellation stock release finished', { orderId });
}

// ============================================
// Internal Helpers
// ============================================

async function releaseReservation(
  productId: string,
  quantity: number,
  orderId: string
): Promise<void> {
  try {
    await lockManager.withLock(`lock:inventory:${productId}`, async () => {
      const item = await InventoryItem.findOne({ productId });
      if (!item) {
        logger.warn('Cannot release reservation — item not found', { productId, orderId });
        return;
      }

      const previousReserved = item.reservedStock;
      item.reservedStock = Math.max(0, item.reservedStock - quantity);
      await item.save();

      await recordMovement(
        productId,
        'RELEASE',
        quantity,
        previousReserved,
        item.reservedStock,
        `Released reservation for order ${orderId}`
      );

      await publishInventoryUpdated(item);
    });
  } catch (error) {
    logger.error('Failed to release reservation', {
      productId,
      orderId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function publishInventoryUpdated(item: IInventoryItem): Promise<void> {
  await messageBroker.publish({
    type: EventType.INVENTORY_UPDATED,
    data: {
      productId: item.productId,
      stock: item.totalStock,
      reservedStock: item.reservedStock,
    },
    timestamp: new Date().toISOString(),
  });
}

// ============================================
// Event Subscriptions Setup
// ============================================

export async function setupEventSubscriptions(): Promise<void> {
  await messageBroker.subscribe(
    'inventory-order-created',
    EventType.ORDER_CREATED,
    handleOrderCreated
  );

  await messageBroker.subscribe(
    'inventory-payment-completed',
    EventType.PAYMENT_COMPLETED,
    handlePaymentCompleted
  );

  await messageBroker.subscribe(
    'inventory-order-cancelled',
    EventType.ORDER_CANCELLED,
    handleOrderCancelled
  );

  logger.info('Inventory event subscriptions established');
}
