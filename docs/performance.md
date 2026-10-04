# ⚡ Performance Engineering & Latency SLAs — Nati Platform

This document outlines the performance benchmarks, latency Service Level Agreements (SLAs), bundle optimization rules, and load testing methodology for the **Nati.** E-Commerce Platform.

---

## 🎯 Target Latency SLAs

Performance targets measured under normal operating conditions:

| Endpoint Domain | Method | Target p50 | Target p95 | Target p99 | Primary Bottleneck / Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /api/products` (Cached) | `GET` | **15ms** | **45ms** | **120ms** | Served from Redis cache |
| `GET /api/products` (Cache Miss) | `GET` | **80ms** | **180ms** | **350ms** | MongoDB index lookup + Redis write |
| `POST /api/orders` | `POST` | **150ms** | **400ms** | **800ms** | Redlock acquire + DB write + outbox |
| `POST /api/payments/checkout` | `POST` | **800ms** | **1500ms** | **3000ms** | External Stripe API round-trip |
| `GET /api/health` | `GET` | **5ms** | **20ms** | **50ms** | In-memory DB health ping |

> **Note**: Checkout latency is bounded by external Stripe API round-trips (~500–1200ms).

---

## ⚛️ Frontend Optimization Guidelines

1. **Dynamic Code Splitting**: Heavy components (such as analytics charts in `AdminDashboard` built with Recharts) MUST be lazily imported using `next/dynamic`:
   ```tsx
   import dynamic from 'next/dynamic';

   const RevenueChart = dynamic(() => import('@/components/AdminDashboard/RevenueChart'), {
     ssr: false,
     loading: () => <div className="h-64 animate-pulse bg-slate-200 rounded-md" />
   });
   ```
2. **Asset Optimization**: Always use `next/image` for product catalog images to get automatic WebP/AVIF formatting and responsive sizing.
3. **Prevent Unnecessary Re-renders**: Wrap expensive computations in `useMemo` and callback props passed down to large lists in `useCallback`.

---

## ⚙️ Backend & Database Optimization

1. **Eliminate N+1 Database Queries**: Avoid executing database calls inside `.map()` or `for` loops. Use Mongoose `.populate()` or `$in` query operators.
2. **MongoDB Connection Pooling**: Cache and reuse Mongoose connections across serverless invocations (`maxPoolSize: 10`).
3. **Redis Pipeline Batching**: Batch multiple Redis cache queries into a single pipeline operation during cart or catalog fetches.

---

## 🧪 Load Testing Methodology (k6)

Load test scenarios are defined in `load-tests/` using Grafana k6:

- **Scenario 1: Catalog Read Spike**: 5,000 virtual users (VUs) browsing products over 2 minutes. Target: p95 < 100ms, error rate < 0.1%.
- **Scenario 2: Checkout Concurrency**: 500 VUs concurrently submitting checkout orders. Target: zero duplicate stock deductions, p95 < 1500ms.
