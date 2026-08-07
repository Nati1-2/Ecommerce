import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

const DEFAULT_TTL_SECONDS = 300; // 5 minutes cache TTL

export const redisCache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err: any) {
      logger.warn(`Redis Cache GET failed for key: ${key}`, { meta: { error: err.message } });
      return null;
    }
  },

  set: async (key: string, data: any, ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<boolean> => {
    try {
      await redis.set(key, JSON.stringify(data), ttlSeconds);
      return true;
    } catch (err: any) {
      logger.warn(`Redis Cache SET failed for key: ${key}`, { meta: { error: err.message } });
      return false;
    }
  },

  del: async (key: string): Promise<boolean> => {
    try {
      await redis.del(key);
      return true;
    } catch (err: any) {
      logger.warn(`Redis Cache DEL failed for key: ${key}`, { meta: { error: err.message } });
      return false;
    }
  },

  invalidateProductCache: async (productId?: string) => {
    try {
      await redisCache.del("products:all");
      await redisCache.del("products:categories");
      if (productId) {
        await redisCache.del(`product:${productId}`);
      }
      logger.info("Product cache invalidated successfully", { meta: { productId } });
    } catch (err: any) {
      logger.warn("Failed to invalidate product cache", { meta: { error: err.message } });
    }
  },
};
