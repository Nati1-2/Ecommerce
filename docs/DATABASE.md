# 🗄️ Database Schema & Data Persistence — Nati Platform

This document documents the MongoDB database architecture, Mongoose schemas, indexing strategies, Redis caching layers, and transaction safety guidelines for the **Nati.** E-Commerce Platform.

---

## 📊 Database Architecture

The platform uses **MongoDB 8.x** as its primary document store with Mongoose ORM models. In production microservice environments, databases are logically isolated per domain service (`auth_db`, `user_db`, `product_db`, `order_db`, `payment_db`, `notification_db`).

```text
┌────────────────────────────────────────────────────────┐
│                   MongoDB Architecture                 │
└───────────────────────────┬────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
┌───────────┐         ┌───────────┐         ┌───────────┐
│  auth_db  │         │product_db │         │ order_db  │
│  (Users)  │         │(Products) │         │ (Orders)  │
└───────────┘         └───────────┘         └───────────┘
```

---

## 📄 Primary Collections & Mongoose Schemas

### 1. `User` Collection (`models/User.ts`)
Stores account credentials, profile metadata, and statutory role assignments.
```typescript
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // Hashed with bcryptjs (salt 10)
  role: { type: String, enum: ['CUSTOMER', 'VENDOR', 'ADMIN'], default: 'CUSTOMER' },
  isVerified: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `Order` Collection (`models/Order.ts`)
Tracks customer purchases, line item snapshots, shipping data, and payment status.
```typescript
{
  _id: ObjectId,
  orderId: { type: String, required: true, unique: true, index: true }, // e.g. ORD-MSJ6GKMK
  userId: { type: String, required: true, index: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    vendorId: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
  orderStatus: { type: String, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  totalAmount: Number,
  shippingCost: Number,
  tax: Number,
  grandTotal: Number,
  paymentIntentId: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `VendorProduct` Collection (`models/VendorProduct.ts`)
Catalog items created and managed by marketplace sellers.
```typescript
{
  _id: ObjectId,
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true, index: true },
  vendorId: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  discountPrice: Number,
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Draft' },
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. `Notification` Collection (`models/Notification.ts`)
Transactional alerts dispatched to customers, vendors, or admins.
```typescript
{
  _id: ObjectId,
  recipientId: { type: String, required: true, index: true },
  type: String,
  title: String,
  message: String,
  link: String,
  read: { type: Boolean, default: false },
  createdAt: Date
}
```

---

## ⚡ Indexing Strategy & Performance Rules

To ensure query performance under high load:
1. **Unique Indexes**: Required on `User.email`, `Order.orderId`, `VendorProduct.slug`, and `VendorProduct.sku`.
2. **Compound Indexes**:
   - `VendorProduct`: `{ vendorId: 1, status: 1 }` for fast seller portal catalog listings.
   - `Order`: `{ userId: 1, createdAt: -1 }` for customer order history sorting.
3. **No Unindexed Scans**: All queries filtering by `vendorId`, `userId`, `recipientId`, or `status` MUST have supporting database indexes.

---

## 🔴 Redis Caching & Lock Data Structures

Redis is utilized for fast transient key-value storage:

| Key Pattern | Data Structure | TTL | Purpose |
| :--- | :--- | :--- | :--- |
| `cart:{userId}` | Hash / JSON String | 30 Days | Persistent shopping cart storage |
| `lock:inventory:{productId}` | String (Lock ID) | 5 Seconds | Redlock concurrency lock during checkout |
| `session:{token}` | String | 15 Minutes | Revoked access token blacklist |

---

## 🛡️ Safe Schema Changes & Migration Guidelines

- **Non-Destructive Modifications**: Never delete existing schema fields directly. Deprecate fields by making them optional first.
- **Default Values**: Provide safe defaults for newly added fields to prevent null pointer exceptions on legacy records.
- **Migration Scripts**: Write migration scripts inside `scripts/` when changing schema structures across existing documents.
