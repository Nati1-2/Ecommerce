import { redisClient } from './redis';
import { createLogger } from '@ecom/common';
import crypto from 'crypto';

const logger = createLogger('lock-manager');

const LOCK_TTL_MS = 5000;
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 200;

/**
 * Distributed lock manager implementing a simple Redlock-style pattern
 * using a single Redis instance with SET NX EX and Lua-based release.
 */
export class LockManager {
  /**
   * Acquire a distributed lock on a given resource key.
   * @returns The lock value (needed for release) or null if lock could not be acquired.
   */
  async acquireLock(resourceKey: string): Promise<string | null> {
    const lockValue = crypto.randomUUID();

    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
      const result = await redisClient.set(
        resourceKey,
        lockValue,
        'PX',
        LOCK_TTL_MS,
        'NX'
      );

      if (result === 'OK') {
        logger.debug(`Lock acquired on ${resourceKey}`, { attempt });
        return lockValue;
      }

      logger.debug(`Lock attempt ${attempt}/${RETRY_COUNT} failed for ${resourceKey}`);

      if (attempt < RETRY_COUNT) {
        await this.delay(RETRY_DELAY_MS);
      }
    }

    logger.warn(`Failed to acquire lock on ${resourceKey} after ${RETRY_COUNT} attempts`);
    return null;
  }

  /**
   * Release a distributed lock. Uses a Lua script to ensure we only
   * release the lock if we still own it (compare-and-delete).
   */
  async releaseLock(resourceKey: string, lockValue: string): Promise<boolean> {
    // Lua script: only delete the key if the stored value matches our lock value
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await redisClient.eval(luaScript, 1, resourceKey, lockValue);
    const released = result === 1;

    if (released) {
      logger.debug(`Lock released on ${resourceKey}`);
    } else {
      logger.warn(`Lock release failed for ${resourceKey} — lock expired or owned by another process`);
    }

    return released;
  }

  /**
   * Execute a function while holding a distributed lock.
   * Automatically acquires and releases the lock.
   */
  async withLock<T>(resourceKey: string, fn: () => Promise<T>): Promise<T> {
    const lockValue = await this.acquireLock(resourceKey);

    if (!lockValue) {
      throw new Error(`Could not acquire lock on ${resourceKey}`);
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(resourceKey, lockValue);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const lockManager = new LockManager();
