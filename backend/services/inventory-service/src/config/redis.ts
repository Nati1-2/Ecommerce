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
    const mockRedis: any = {
      ping: async () => 'PONG',
      set: async () => 'OK',
      del: async () => 1,
      on: () => mockRedis,
      quit: async () => 'OK'
    };
    redisClient = mockRedis;
    return redisClient as Redis;
  }

  logger.info(`Connecting to Redis at: ${env.REDIS_URL}`);
  
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    reconnectOnError: (err: Error) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    }
  });

  redisClient.on('connect', () => {
    logger.info('Inventory Service Redis client connected');
  });

  redisClient.on('error', (err: unknown) => {
    logger.error('Inventory Service Redis client error:', err);
  });

  return redisClient;
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    return connectRedis();
  }
  return redisClient;
};
