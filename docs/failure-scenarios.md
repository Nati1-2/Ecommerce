# Production Failure Scenarios & Recovery Playbook

This document catalogs known failure modes, their blast radius, detection mechanisms, and recovery procedures.

---

## 1. Stripe Payment Gateway Failure

### Scenario
Stripe API returns HTTP 500 or times out (>30s) during checkout payment intent creation.

### Blast Radius
- Customer checkout blocked
- Orders created with `paymentStatus: PENDING`
- No revenue impact on existing fulfilled orders

### Detection
- PaymentEvent records with `status: FAILED` or `status: RETRYING`
- Prometheus metric: `payment_failure_rate > 5%` triggers alert
- Stripe Dashboard status page monitoring

### Recovery Strategy

```
PaymentEvent State Machine:

CREATED ──► PROCESSING ──► SUCCESS
                │
                ▼
            FAILED (retryCount++)
                │
                ▼ (retryCount < 5)
            RETRYING ──► PROCESSING
                │
                ▼ (retryCount >= 5)
            DEAD_LETTER ──► Manual Admin Recovery
```

**Automated Recovery:**
1. Exponential backoff retry: 1s, 2s, 4s, 8s, 16s
2. Idempotency key (`stripeEventId`) prevents duplicate charges
3. Outbox worker retries failed payment events on next poll cycle

**Manual Recovery:**
1. Admin reviews dead-letter PaymentEvents via `/admin/system-status`
2. Admin manually reconciles with Stripe Dashboard
3. Admin triggers re-processing or issues refund

### Prevention
- Stripe webhook signature verification prevents spoofed payment confirmations
- Client-side timeout handling shows "Payment processing" state (not error)
- Order remains in `PENDING` until webhook confirms — never auto-confirm

---

## 2. MongoDB Atlas Connection Failure

### Scenario
MongoDB Atlas cluster becomes unreachable due to network partition, maintenance window, or connection pool exhaustion.

### Blast Radius
- **Critical**: All API routes return 500 errors
- **Data safe**: MongoDB Atlas maintains data durability via replica set

### Detection
- Health check endpoint (`/api/health`) returns `database: "disconnected"`
- Mongoose connection state !== 1 (connected)
- Vercel function logs show `MongoNetworkError`

### Recovery Strategy

**Automatic:**
1. Mongoose auto-reconnect with exponential backoff (built-in driver behavior)
2. `connectDB()` utility caches connection across warm serverless invocations
3. Connection pool size limited to 10 to prevent Atlas connection storms from serverless scale-out

**Manual (Extended Outage):**
1. Verify Atlas cluster status at cloud.mongodb.com
2. If primary failover: wait for automatic election (~10-30 seconds)
3. If cluster degraded: trigger manual failover to secondary region
4. If data corruption: restore from continuous backup (Point-in-Time Recovery, RPO < 1 minute)

### Prevention
- Connection string uses `retryWrites=true&retryReads=true`
- `maxPoolSize=10` prevents connection exhaustion under Vercel auto-scaling
- Atlas alerts configured for connection count > 80% of limit

---

## 3. Redis/Upstash Cache Failure

### Scenario
Upstash Redis becomes unreachable or returns errors.

### Blast Radius
- **Low**: Product pages load slower (cache miss → MongoDB fallback)
- **Medium**: Inventory reservation locks unavailable during checkout
- **No data loss**: Redis contains only ephemeral cache data

### Detection
- Redis `get`/`set` operations throw connection errors
- Cache hit ratio drops to 0%
- API latency increase (p95 rises from ~80ms to ~200ms)

### Recovery Strategy

**Product Cache Fallback:**
- `redisCache.ts` wraps all Redis calls in try/catch
- On failure: direct MongoDB query serves the request
- User experience: slower page loads, no functional impact

**Inventory Lock Fallback:**
- When Redis lock acquisition fails, system falls back to MongoDB optimistic concurrency:
  ```
  db.products.updateOne(
    { _id: productId, stock: { $gte: requestedQuantity } },
    { $inc: { stock: -requestedQuantity } }
  )
  ```
- If `modifiedCount === 0`: stock insufficient, reject checkout
- This prevents overselling even without Redis

**Session Fallback:**
- JWT tokens remain stateless and verifiable without Redis
- Server-side session revocation temporarily unavailable (tokens valid until expiry)

### Prevention
- Upstash provides 99.99% SLA with multi-region replication
- All Redis operations have 3-second timeout to prevent request blocking

---

## 4. Outbox Worker / Event Queue Failure

### Scenario
Outbox worker fails to process pending events due to consumer errors, MongoDB query timeout, or Vercel Cron job failure.

### Blast Radius
- **Delayed**: Notifications arrive late (up to 30+ minutes)
- **Delayed**: Analytics metrics are stale
- **No data loss**: Events remain in `OutboxEvent` collection with `status: PENDING`

### Detection
- OutboxEvent count with `status: PENDING` growing beyond threshold (>50)
- OutboxEvent records with `status: FAILED` and `retryCount >= 5`
- Vercel Cron job execution logs show failures

### Recovery Strategy

**Retry Policy:**
- Each event retried up to 5 times
- Failed events (retryCount >= 5) enter dead-letter state (`status: FAILED`)
- Worker processes oldest events first (`createdAt` ascending sort)

**Poison Message Handling:**
- Events that consistently fail are isolated with `status: FAILED`
- They do not block processing of subsequent events
- Admin can inspect and manually replay via database query

**Manual Replay:**
```javascript
// Reset failed events for reprocessing
db.outboxevents.updateMany(
  { status: "FAILED" },
  { $set: { status: "PENDING", retryCount: 0 } }
)
```

### Prevention
- Consumer functions must be idempotent (safe to replay)
- Each consumer checks for duplicate processing using `eventId`
- Cron schedule (*/15 * * * *) ensures regular polling even if previous run completes early

---

## Recovery Objectives Summary

| Failure | RPO | RTO | Severity |
| :--- | :--- | :--- | :--- |
| Stripe outage | 0 (no data loss) | Dependent on Stripe | Medium |
| MongoDB outage | < 1 minute (PITR) | < 15 minutes | Critical |
| Redis outage | N/A (ephemeral) | Immediate fallback | Low |
| Event queue failure | 0 (events persisted) | < 30 minutes | Low |
