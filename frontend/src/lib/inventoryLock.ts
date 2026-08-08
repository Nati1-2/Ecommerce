import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

const LOCK_TTL_SECONDS = 600; // 10 minutes temporary stock hold during checkout

export interface InventoryState {
  availableStock: number;
  reservedStock: number;
  soldStock: number;
}

export const inventoryLock = {
  /**
   * Reserve stock during checkout.
   * Decrements availableStock, increments reservedStock in Redis.
   * Falls back to optimistic MongoDB concurrency if Redis is unavailable.
   */
  acquireLock: async (productId: string, quantity: number, userId: string): Promise<boolean> => {
    try {
      const lockKey = `stock_lock:${productId}:${userId}`;
      const existing = await redis.get(lockKey);
      if (existing) {
        return true; // Lock already held by this user session
      }

      const stateKey = `inventory_state:${productId}`;
      const rawState = await redis.get(stateKey);
      if (rawState) {
        const state: InventoryState = JSON.parse(rawState);
        if (state.availableStock < quantity) {
          logger.warn(`Insufficient stock for product ${productId}`, {
            meta: { available: state.availableStock, requested: quantity },
          });
          return false;
        }
        state.availableStock -= quantity;
        state.reservedStock += quantity;
        await redis.set(stateKey, JSON.stringify(state), 3600);
      }

      await redis.set(
        lockKey,
        JSON.stringify({ quantity, lockedAt: new Date().toISOString() }),
        LOCK_TTL_SECONDS
      );
      logger.info(`Stock reserved: ${quantity} units of product ${productId}`, {
        meta: { productId, quantity, userId },
      });
      return true;
    } catch (err: any) {
      logger.warn("Inventory lock acquisition warning — falling back to MongoDB concurrency", {
        meta: { error: err.message },
      });
      return true; // Fallback: let MongoDB $inc with floor check handle it
    }
  },

  /**
   * Confirm reservation after successful payment.
   * Decrements reservedStock, increments soldStock.
   */
  confirmReservation: async (productId: string, quantity: number, userId: string): Promise<boolean> => {
    try {
      const lockKey = `stock_lock:${productId}:${userId}`;
      await redis.del(lockKey);

      const stateKey = `inventory_state:${productId}`;
      const rawState = await redis.get(stateKey);
      if (rawState) {
        const state: InventoryState = JSON.parse(rawState);
        state.reservedStock = Math.max(0, state.reservedStock - quantity);
        state.soldStock += quantity;
        await redis.set(stateKey, JSON.stringify(state), 3600);
      }

      logger.info(`Reservation confirmed: ${quantity} units of product ${productId} sold`, {
        meta: { productId, quantity, userId },
      });
      return true;
    } catch (err: any) {
      logger.warn("Reservation confirmation warning", { meta: { error: err.message } });
      return true;
    }
  },

  /**
   * Release reservation after payment failure or checkout timeout.
   * Decrements reservedStock, restores availableStock.
   */
  releaseLock: async (productId: string, quantity: number, userId: string): Promise<boolean> => {
    try {
      const lockKey = `stock_lock:${productId}:${userId}`;
      const rawLock = await redis.get(lockKey);
      const releaseQty = quantity || (rawLock ? JSON.parse(rawLock).quantity : 0);

      await redis.del(lockKey);

      if (releaseQty > 0) {
        const stateKey = `inventory_state:${productId}`;
        const rawState = await redis.get(stateKey);
        if (rawState) {
          const state: InventoryState = JSON.parse(rawState);
          state.reservedStock = Math.max(0, state.reservedStock - releaseQty);
          state.availableStock += releaseQty;
          await redis.set(stateKey, JSON.stringify(state), 3600);
        }
      }

      logger.info(`Stock released: ${releaseQty} units of product ${productId}`, {
        meta: { productId, userId },
      });
      return true;
    } catch (err: any) {
      logger.warn("Inventory lock release warning", { meta: { error: err.message } });
      return false;
    }
  },

  /**
   * Initialize inventory state in Redis from MongoDB source of truth.
   */
  initializeState: async (productId: string, totalStock: number): Promise<void> => {
    try {
      const stateKey = `inventory_state:${productId}`;
      const state: InventoryState = {
        availableStock: totalStock,
        reservedStock: 0,
        soldStock: 0,
      };
      await redis.set(stateKey, JSON.stringify(state), 3600);
    } catch {
      // Non-critical — MongoDB remains source of truth
    }
  },
};
