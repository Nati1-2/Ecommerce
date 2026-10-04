# ⚙️ Backend Architecture & Service Guidelines — Nati Platform

This document outlines the backend architecture, service layering, request validation, authentication controls, and messaging patterns for the **Nati.** Node.js Express microservices monorepo.

---

## 🏗️ Architecture & Layering

The backend is structured as an Express microservices monorepo under `backend/`. Each service enforces strict separation of concerns across three internal layers:

```text
┌────────────────────────────────────────────────────────┐
│                   Express Router                       │
│    Receives HTTP requests & attaches RBAC middleware    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Service Controller                    │
│   Parses request params & validates payload with Zod   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Domain Business Logic                  │
│   Executes state transitions, Redis locks, Mongoose DB │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Outbox / Event Dispatcher                 │
│  Emits AMQP domain events to RabbitMQ exchange broker  │
└────────────────────────────────────────────────────────┘
```

---

## 🛡️ Trust & Security Rules

1. **Zero Client Trust**: NEVER trust price calculations, role assignments, or stock quantities sent from the frontend client. All financial calculations (subtotals, tax, shipping, discounts) MUST be calculated server-side in `order-service` or `payment-service`.
2. **Stateless JWT Verification**: The API Gateway (`backend/api-gateway`) or service middleware validates JWT access tokens and injects verified user identity into request headers (`x-user-id`, `x-user-role`).
3. **Role-Based Access Control (RBAC)**: Protect sensitive endpoints with middleware from `@ecom/shared`:
   - `requireAuth`: Enforces valid authentication token.
   - `requireVendor`: Restricts access to seller vendors (`role === 'VENDOR'` or `'ADMIN'`).
   - `requireAdmin`: Restricts access strictly to platform admins (`role === 'ADMIN'`).

---

## 🔒 Concurrency & Transactions

### 1. Redis Redlock Distributed Inventory Locking
When creating or updating inventory in high-concurrency flows:
```typescript
import { Redlock } from 'redlock';
import { redisClient } from '../lib/redis';

const redlock = new Redlock([redisClient], { retryCount: 3, retryDelay: 200 });

export const reserveInventory = async (productId: string, quantity: number) => {
  const resource = `lock:inventory:${productId}`;
  const lock = await redlock.acquire([resource], 5000); // 5-second TTL

  try {
    const product = await VendorProduct.findById(productId);
    if (!product || product.stock < quantity) {
      throw new BadRequestError('Insufficient inventory available');
    }
    product.stock -= quantity;
    await product.save();
  } finally {
    await lock.release();
  }
};
```

### 2. Mongoose Multi-Document Transactions
For operations requiring atomic multi-collection updates (e.g. order creation + inventory update + notification dispatch), use Mongoose sessions:
```typescript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Execute database operations passing { session }
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## 📩 Asynchronous Event Dispatch (RabbitMQ AMQP)

Services communicate asynchronously via RabbitMQ AMQP topic exchanges:
- **Exchange Name**: `ecommerce_events`
- **Routing Keys**:
  - `auth.user.created`
  - `order.created`
  - `order.paid`
  - `inventory.updated`
  - `payment.succeeded`

All event payloads MUST implement shared TypeScript interfaces defined in `@ecom/shared`.

---

## 📝 Input Validation & Error Propagation

- Validate all incoming request body, query, and path parameters using Zod schemas.
- Throw custom errors extending `CustomError` from `@ecom/shared` (`BadRequestError`, `NotFoundError`, `UnauthorizedError`).
- Log server errors using `winston` structured logger with error context, timestamp, and request correlation IDs.
