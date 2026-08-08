# Observability Platform Architecture

Monitoring, metrics, logging, and distributed tracing strategy.

---

## Three Pillars of Observability

### 1. Structured Logging

Every log entry contains:

```json
{
  "level": "info",
  "message": "Order created",
  "requestId": "req_1723...",
  "correlationId": "corr_1723...",
  "userId": "usr_abc123",
  "serviceName": "order-service",
  "timestamp": "2026-08-08T18:00:00.000Z",
  "durationMs": 145,
  "meta": {
    "orderId": "ORD-2026-001",
    "totalAmount": 89.99
  }
}
```

### 2. Metrics

**Technical Metrics (Prometheus-compatible)**

| Metric | Type | Description |
| :--- | :--- | :--- |
| `http_request_duration_ms` | Histogram | API endpoint latency |
| `http_requests_total` | Counter | Total requests by status code |
| `http_errors_total` | Counter | 4xx and 5xx responses |
| `db_query_duration_ms` | Histogram | MongoDB query latency |
| `cache_hit_ratio` | Gauge | Redis cache hit percentage |
| `outbox_pending_events` | Gauge | Unprocessed outbox event count |
| `active_users` | Gauge | Currently authenticated users |

**Business Metrics**

| Metric | Calculation | Dashboard |
| :--- | :--- | :--- |
| Gross Merchandise Value (GMV) | Sum of all order totals | Admin Dashboard |
| Checkout Conversion Rate | Orders / Checkout Sessions | Analytics |
| Payment Success Rate | Successful / Total Payments | Admin System Status |
| Average Order Value (AOV) | GMV / Order Count | Analytics |
| Vendor Payout Volume | Sum of vendor payouts | Admin Finance |

### 3. Distributed Tracing

**OpenTelemetry-compatible** trace context propagation:

```
Customer Browser
    │ x-request-id: req_abc
    ▼
Next.js API Route
    │ span: api.checkout (150ms)
    ▼
Payment Service
    │ span: stripe.createIntent (800ms)
    ▼
Stripe API
    │ span: external.stripe (750ms)
    ▼
Order Service
    │ span: mongodb.createOrder (45ms)
    ▼
Outbox Writer
    │ span: outbox.persist (10ms)
    ▼
Notification Consumer
      span: notification.dispatch (25ms)
```

---

## Alerting Rules

| Alert | Condition | Severity | Action |
| :--- | :--- | :--- | :--- |
| High Error Rate | `http_errors_total / http_requests_total > 5%` for 5 min | Critical | Page on-call |
| Payment Failures | `payment_failure_rate > 10%` for 10 min | Critical | Check Stripe status |
| Database Latency | `db_query_duration_ms p95 > 500ms` for 5 min | Warning | Review slow queries |
| Outbox Backlog | `outbox_pending_events > 100` for 30 min | Warning | Check worker health |
| Cache Hit Ratio | `cache_hit_ratio < 50%` for 15 min | Warning | Verify Redis connectivity |

---

## Integration Points

| Tool | Purpose | Status |
| :--- | :--- | :--- |
| Sentry | Error tracking, stack traces, release tracking | ✅ Ready |
| Prometheus | Metrics collection via `/api/metrics` endpoint | ✅ Implemented |
| Grafana | Dashboard visualization for Prometheus metrics | ⚠️ Configuration ready |
| Vercel Analytics | Web vitals, function performance | ✅ Built-in |
