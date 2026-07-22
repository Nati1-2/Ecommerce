/**
 * Serverless-compatible Redis Cache client.
 * Uses Upstash REST API when credentials are provided, or memory fallback in dev.
 */

interface CacheStore {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttlSeconds?: number) => Promise<void>;
  del: (key: string) => Promise<void>;
}

class InMemoryCache implements CacheStore {
  private store = new Map<string, { val: string; exp?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.exp && Date.now() > item.exp) {
      this.store.delete(key);
      return null;
    }
    return item.val;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const exp = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { val: value, exp });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

class UpstashCache implements CacheStore {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  async get(key: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.url}/get/${key}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      return data.result;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      const endpoint = ttlSeconds
        ? `${this.url}/set/${key}/${encodeURIComponent(value)}/EX/${ttlSeconds}`
        : `${this.url}/set/${key}/${encodeURIComponent(value)}`;
      await fetch(endpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch {}
  }

  async del(key: string): Promise<void> {
    try {
      await fetch(`${this.url}/del/${key}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch {}
  }
}

export const redis: CacheStore =
  process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
    ? new UpstashCache(process.env.UPSTASH_REDIS_URL, process.env.UPSTASH_REDIS_TOKEN)
    : new InMemoryCache();
