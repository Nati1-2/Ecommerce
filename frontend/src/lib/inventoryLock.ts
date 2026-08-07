import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

const LOCK_TTL_SECONDS = 600; // 10 minutes temporary stock hold during checkout

export const inventoryLock = {
  acquireLock: async (productId: string, quantity: number, userId: string): Promise<boolean> => {
    try {
      const lockKey = `stock_lock:${productId}:${userId}`;
      const existing = await redis.get(lockKey);
      if (existing) {
        return true; // Lock already held by this user session
      }
      await redis.set(lockKey, JSON.stringify({ quantity, lockedAt: new Date().toISOString() }), LOCK_TTL_SECONDS);
      logger.info(`Stock lock acquired for product ${productId}`, { meta: { productId, quantity, userId } });
      return true;
    } catch (err: any) {
      logger.warn("Inventory lock acquisition warning", { meta: { error: err.message } });
      return true; // Fallback gracefully if cache is unavailable
    }
  },

  releaseLock: async (productId: string, userId: string): Promise<boolean> => {
    try {
      const lockKey = `stock_lock:${productId}:${userId}`;
      await redis.del(lockKey);
      logger.info(`Stock lock released for product ${productId}`, { meta: { productId, userId } });
      return true;
    } catch (err: any) {
      logger.warn("Inventory lock release warning", { meta: { error: err.message } });
      return false;
    }
  },
};
