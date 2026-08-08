# Capacity Planning & Scaling Strategy

Scaling roadmap from current load to 10M+ users.

---

## Target Scale

| Metric | Current | Phase 1 (6 mo) | Phase 2 (18 mo) | Phase 3 (36 mo) |
| :--- | :--- | :--- | :--- | :--- |
| Registered users | 1,000 | 100,000 | 1,000,000 | 5,000,000 |
| Daily active users | 200 | 20,000 | 200,000 | 500,000 |
| Products | 500 | 50,000 | 1,000,000 | 10,000,000 |
| Orders/day | 50 | 5,000 | 50,000 | 100,000 |
| Peak requests/sec | 50 | 2,000 | 10,000 | 20,000 |

---

## MongoDB Scaling Strategy

### Phase 1: Index Optimization
- Compound indexes on high-frequency query patterns
- Atlas Performance Advisor for slow query detection
- Upgrade from M10 to M30 cluster tier

### Phase 2: Read Replicas
- Add read replica set members in secondary region
- Route analytics and reporting queries to secondaries via `readPreference: 'secondaryPreferred'`
- Reduces primary node load by ~30%

### Phase 3: Sharding
- Shard `orders` collection by `customerId` (even distribution)
- Shard `products` collection by `vendorId`
- Zone-based sharding for geographic data locality

---

## Redis Memory Planning

| Scale | Estimated Keys | Memory Required | Tier |
| :--- | :--- | :--- | :--- |
| Current | ~1,000 | <10MB | Upstash Free |
| Phase 1 | ~50,000 | ~250MB | Upstash Pro |
| Phase 2 | ~500,000 | ~2.5GB | Upstash Enterprise |
| Phase 3 | ~2,000,000 | ~10GB | Dedicated Redis cluster |

**Eviction Policy**: `allkeys-lru` — Least Recently Used keys evicted when memory limit reached. Product cache keys have shortest TTL (5 min) and are evicted first.

---

## Vercel Serverless Limits

| Limit | Hobby | Pro | Enterprise |
| :--- | :--- | :--- | :--- |
| Function duration | 10s | 60s | 900s |
| Concurrent executions | 10 | 100 | 1000+ |
| Bandwidth | 100GB | 1TB | Custom |
| Cron jobs | 2 | 40 | Unlimited |

**Phase 2 Migration Trigger**: If concurrent execution consistently hits Pro tier limits (100), evaluate:
- Vercel Enterprise plan
- Extract high-throughput services (payment webhooks, search) to dedicated AWS Lambda or Fly.io

---

## Queue & Worker Scaling

| Scale | Events/Day | Worker Strategy |
| :--- | :--- | :--- |
| Current | ~200 | Vercel Cron (15-min interval) |
| Phase 1 | ~5,000 | Vercel Cron (5-min interval) + on-demand trigger |
| Phase 2 | ~50,000 | Upstash QStash (HTTP-based async delivery) |
| Phase 3 | ~500,000 | AWS SQS/EventBridge with dedicated Lambda workers |

---

## What Happens at 10x Current Scale?

### Current Architecture Supports
- Up to ~5,000 orders/day without architectural changes
- Up to ~50,000 products with current in-memory search
- Up to ~2,000 peak req/sec on Vercel Pro

### Required Changes at 10x
1. **Search**: Migrate from in-memory scoring to Atlas Search or Meilisearch
2. **Events**: Migrate from outbox polling to QStash push-based delivery
3. **Database**: Add read replicas and compound indexes
4. **Cache**: Increase Redis memory allocation and add cache warming for popular products

### Required Changes at 100x
1. **Architecture**: Extract Payment and Inventory as independent services
2. **Database**: Enable MongoDB sharding on orders and products collections
3. **Deployment**: Evaluate moving off Vercel to AWS/GCP for higher concurrency limits
4. **Search**: Dedicated Elasticsearch/Meilisearch cluster with real-time indexing pipeline
