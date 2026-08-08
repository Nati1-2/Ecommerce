# ADR-008: Redis Caching Strategy & Invalidation

## Status
Accepted

## Context
The platform serves product catalog pages, search results, and session data that benefit from caching to reduce MongoDB load and improve response latency.

## Decision
We use **Upstash Redis** as a multi-purpose cache with explicit invalidation.

### Cache Layers

```
Browser Cache (Cache-Control headers)
        │
        ▼
Vercel Edge Cache (CDN, static assets)
        │
        ▼
Redis/Upstash Cache (application data)
        │
        ▼
MongoDB Atlas (source of truth)
```

### Cache Entries

| Key Pattern | TTL | Purpose | Invalidation Trigger |
| :--- | :--- | :--- | :--- |
| `products:all` | 5 min | Product catalog listing | Product CRUD operations |
| `products:categories` | 10 min | Category tree | Category updates |
| `product:{id}` | 5 min | Individual product detail | Product update/delete |
| `stock_lock:{productId}:{userId}` | 10 min | Checkout inventory hold | Payment success/failure/timeout |
| `session:{sessionId}` | 7 days | User session data | Logout / token revocation |

### Invalidation Strategy

**Write-Through Invalidation**: When a product is updated or deleted, the API handler calls `invalidateProductCache()` which deletes:
- `products:all`
- `products:categories`  
- `product:{id}`

**TTL-Based Expiration**: All cache entries have bounded TTLs to prevent serving stale data if invalidation fails.

**No Cache Warming**: We use lazy population (cache-aside pattern). First request after expiration hits MongoDB and populates the cache.

### Redis Failure Handling

If Redis is unavailable:
- **Product cache**: Falls back to direct MongoDB queries (higher latency, still functional)
- **Inventory locks**: Falls back to MongoDB-level optimistic concurrency check using `$inc` with stock floor validation
- **Sessions**: Falls back to stateless JWT verification (no server-side revocation until Redis recovers)

## Consequences
- Cache hit ratio target: >85% for catalog pages
- Redis memory usage: <50MB at current product scale (estimated 10k products × 5KB avg)
- Risk: Stale product prices displayed for up to 5 minutes after vendor price update
- Mitigation: Checkout always reads current price from MongoDB, never from cache
