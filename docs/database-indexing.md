# Database Index Engineering & Query Optimization

MongoDB Atlas index strategy for production query patterns.

---

## Index Catalog

### Users Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `email_1` | `{ email: 1 }` | Unique | Login lookup, duplicate prevention |
| `role_1` | `{ role: 1 }` | Standard | Admin queries filtering by role |

### Orders Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `customerId_1_createdAt_-1` | `{ customerId: 1, createdAt: -1 }` | Compound | Customer order history (newest first) |
| `vendorId_1_orderStatus_1` | `{ vendorId: 1, orderStatus: 1 }` | Compound | Vendor dashboard filtering by status |
| `orderId_1` | `{ orderId: 1 }` | Unique | Order lookup by human-readable ID |
| `paymentStatus_1_createdAt_-1` | `{ paymentStatus: 1, createdAt: -1 }` | Compound | Admin payment monitoring |

### Products Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `vendorId_1` | `{ vendorId: 1 }` | Standard | Vendor product management |
| `category_1_price_1` | `{ category: 1, price: 1 }` | Compound | Category browsing with price sort |
| `name_text_description_text` | `{ name: "text", description: "text" }` | Text | Full-text search |
| `createdAt_-1` | `{ createdAt: -1 }` | Standard | "Newest products" listing |

### PaymentEvents Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `stripeEventId_1` | `{ stripeEventId: 1 }` | Unique | Idempotency check — prevents duplicate webhook processing |
| `status_1_createdAt_1` | `{ status: 1, createdAt: 1 }` | Compound | Failed payment recovery queries |

### OutboxEvents Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `status_1_createdAt_1` | `{ status: 1, createdAt: 1 }` | Compound | Worker polling for PENDING events |
| `eventId_1` | `{ eventId: 1 }` | Unique | Idempotent event processing |

### Notifications Collection

| Index | Fields | Type | Rationale |
| :--- | :--- | :--- | :--- |
| `userId_1_read_1` | `{ userId: 1, read: 1 }` | Compound | Unread notification badge count |

---

## Index Cost Analysis

- **Write amplification**: Each index adds ~10-15% overhead to write operations
- **Memory footprint**: Indexes should fit in RAM for optimal performance. At 1M orders with 4 indexes, estimated ~2GB index memory.
- **Recommendation**: Monitor via Atlas Performance Advisor. Drop unused indexes quarterly.

---

## Slow Query Monitoring

- Atlas Performance Advisor automatically flags queries >100ms
- Enable MongoDB profiler level 1 (slow queries only) in staging environment
- Target: Zero queries >500ms in production
