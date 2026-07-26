import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient: Redis | null = null;

export const setRedisClient = (client: any): void => {
  redisClient = client;
};

export const connectRedis = (): Redis => {
  if (redisClient) return redisClient;

  if (process.env.NODE_ENV === 'test') {
    const mockStorage = new Map<string, string>();
    const mockRedis: any = {
      ping: async () => 'PONG',
      get: async (key: string) => mockStorage.get(key) || null,
      set: async (key: string, val: string) => {
        mockStorage.set(key, val);
        return 'OK';
      },
      expire: async () => 1,
      del: async (key: string) => {
        const existed = mockStorage.has(key);
        mockStorage.delete(key);
        return existed ? 1 : 0;
      },
      on: () => mockRedis,
      quit: async () => 'OK'
    };
    redisClient = mockRedis;
    return redisClient as Redis;
  }

  logger.info(`Cart Service connecting to Redis at: ${env.REDIS_URL}`);
  
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true
  });

  redisClient.on('connect', () => {
    logger.info('Cart Service Redis client connected successfully');
  });

  redisClient.on('error', (err: unknown) => {
    logger.error('Cart Service Redis error:', err);
  });

  return redisClient;
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    return connectRedis();
  }
  return redisClient;
};
