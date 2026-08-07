# 🗄️ Database Design & Schema Specifications

This document outlines the MongoDB Atlas database schema, models, indexing strategies, and entity relationships.

---

## 📊 Entity Relationship Diagram (ERD)

```
        ┌──────────────┐
        │     User     │
        └──────┬───────┘
               │ 1:N
   ┌───────────┼───────────┐
   │           │           │
   ▼           ▼           ▼
Customer    Vendor      Admin
   │           │           │
   │           ▼           │
   │    ┌──────────────┐   │
   │    │ VendorProduct│   │
   │    └──────┬───────┘   │
   │           │           │
   ▼           ▼           ▼
┌─────────────────────────────┐
│            Order            │
└──────────────┬──────────────┘
               │ 1:N
               ▼
   ┌──────────────────────┐
   │     Notification     │
   └──────────────────────┘
```

---

## 📄 Collections & Mongoose Schemas

### 1. `User` Collection (`models/User.ts`)
- `_id`: ObjectId
- `email`: String (Unique, Indexed)
- `name`: String
- `password`: String (Hashed with bcrypt)
- `role`: Enum (`"CUSTOMER"`, `"VENDOR"`, `"ADMIN"`)
- `isVerified`: Boolean
- `createdAt`, `updatedAt`: Date

### 2. `Order` Collection (`models/Order.ts`)
- `orderId`: String (Unique, Indexed, e.g., `ORD-MSJ6GKMK-IMH8`)
- `userId`: String (Indexed)
- `items`: Array of `{ productId, name, price, quantity, image }`
- `shippingAddress`: `{ street, city, state, zipCode, country }`
- `paymentStatus`: Enum (`"PENDING"`, `"PAID"`, `"FAILED"`, `"REFUNDED"`)
- `orderStatus`: Enum (`"PENDING"`, `"PROCESSING"`, `"SHIPPED"`, `"DELIVERED"`, `"CANCELLED"`)
- `totalAmount`, `shippingCost`, `tax`, `grandTotal`: Number
- `paymentIntentId`: String
- `trackingNumber`: String

### 3. `VendorProduct` Collection (`models/VendorProduct.ts`)
- `name`, `slug`, `sku` (Unique): String
- `vendorId`: String (Indexed)
- `price`, `discountPrice`, `stock`: Number
- `status`: Enum (`"Published"`, `"Draft"`, `"Archived"`)
- `images`: Array of Strings

### 4. `Notification` Collection (`models/Notification.ts`)
- `recipientId`: String (Indexed, e.g., `userId`, `vendorId`, or `"ADMIN"`)
- `type`, `title`, `message`, `link`: String
- `read`: Boolean (Default: `false`)
