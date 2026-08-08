# Performance Engineering & SLA Documentation

Realistic performance targets based on architecture constraints and measured benchmarks.

---

## API Latency Targets

| Endpoint | p50 | p95 | p99 | Bottleneck |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/products` (cached) | 15ms | 45ms | 120ms | Redis lookup |
| `GET /api/products` (cache miss) | 80ms | 180ms | 350ms | MongoDB query + cache write |
| `GET /api/products/search` | 50ms | 200ms | 500ms | Full-text scoring computation |
| `POST /api/orders` | 150ms | 400ms | 800ms | MongoDB write + outbox event |
| `POST /api/payments/checkout` | 800ms | 1500ms | 3000ms | Stripe API round-trip |
| `POST /api/payments/webhook` | 50ms | 150ms | 300ms | MongoDB upsert + notification |
| `GET /api/health` | 5ms | 20ms | 50ms | MongoDB ping |

> **Note**: Checkout latency is dominated by Stripe API latency (~500-1200ms). This is an external dependency we cannot optimize beyond connection reuse.

---

## Load Testing Methodology

### Tool
k6 (Grafana Labs) — JavaScript-based load testing.

### Test Scenarios

**Scenario 1: Catalog Browsing (Read-Heavy)**
- 5000 virtual users
- Ramp: 0 → 5000 over 30 seconds
- Duration: 2 minutes sustained
- Target: p95 < 100ms, error rate < 0.1%

**Scenario 2: Checkout Flow (Write-Heavy)**
- 500 virtual users
- Sequential: browse → add cart → checkout
- Target: p95 < 1500ms, zero duplicate orders

**Scenario 3: Mixed Traffic (Realistic)**
- 80% reads (catalog, search, product detail)
- 15% writes (cart, orders)
- 5% admin (dashboard, analytics)
- Target: p95 < 200ms overall

### Traffic Assumptions

| Metric | Current | Growth Target |
| :--- | :--- | :--- |
| Daily active users | 1,000 | 500,000 |
| Peak concurrent users | 200 | 20,000 |
| Orders per day | 50 | 100,000 |
| Products in catalog | 500 | 10,000,000 |

---

## Bottleneck Analysis

### Current Bottlenecks

1. **Vercel Serverless Cold Starts**: First request after idle period adds 200-500ms. Mitigated by Vercel's automatic function warming on Pro plan.

2. **MongoDB Connection Establishment**: New connections take ~100ms. Mitigated by caching `mongoose` connection across warm invocations.

3. **Search Computation**: In-memory scoring algorithm scales linearly with product count. At >50k products, search latency will exceed 500ms p95. **Migration trigger**: Move to Atlas Search or Meilisearch.

4. **Outbox Worker Polling Interval**: 15-minute cron schedule means events can be delayed up to 15 minutes. Acceptable for notifications, not for real-time inventory.

### Optimization Opportunities

- **Redis pipeline batching**: Batch multiple cache reads into single Redis round-trip
- **MongoDB read preference**: Route analytics queries to secondary replica
- **Vercel Edge Functions**: Move health check and static API responses to edge for sub-10ms latency
- **Connection pooling**: Tune `maxPoolSize` based on Vercel concurrent execution limits
