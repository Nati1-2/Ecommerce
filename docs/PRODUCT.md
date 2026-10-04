# 📦 Product Requirements & Domain Overview — Nati. E-Commerce Platform

This document outlines the product vision, domain model, user personas, key functional capabilities, and business workflows for the **Nati.** Multi-Vendor E-Commerce Platform.

---

## 🌟 Product Vision & Core Value Proposition

**Nati.** is an enterprise-grade, multi-vendor e-commerce platform engineered for sub-second latency, high-concurrency transactional stability (such as flash sales), and responsive real-time user experiences across all devices.

### Strategic Objectives
1. **Prevent Concurrency Race Conditions**: Guarantee zero negative stock balances during peak concurrent checkouts via distributed Redis Redlock locking.
2. **Decoupled Monorepo Architecture**: Eliminate monolithic bottlenecks by operating modular domain microservices (`auth`, `user`, `product`, `inventory`, `cart`, `order`, `payment`, `notification`, `analytics`, `vendor`).
3. **Seamless Mobile-First Storefront**: Deliver a 320px–1440px responsive user interface with fluid layout scaling and zero horizontal overflow.

---

## 👥 User Personas & Permissions

The platform serves three primary user personas with fine-grained Role-Based Access Control (RBAC):

| Persona | Role Enum | Core Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **Customer** | `CUSTOMER` | Storefront browsing, product variant matrix selection, cart/wishlist management, multi-step Stripe checkout, order history & live tracking. |
| **Seller Vendor** | `VENDOR` | Vendor portal access (`/vendor`), store profile configuration, catalog & stock management, order fulfillment, revenue metrics. |
| **Super Admin** | `ADMIN` | Platform control center (`/admin`), live GMV & user telemetry, system health monitoring (MongoDB, Redis, RabbitMQ), vendor approvals, catalog moderation, audit logging. |

---

## 🛍️ Core Functional Modules

### 1. Customer Storefront & Catalog
- **Mobile-First Responsive Layout**: Adaptive grid columns (`grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4`) supporting 320px+ viewports without text clipping.
- **Dynamic Variant Matrix**: Dynamic pricing calculations based on selected color, size, or storage options.
- **Multi-Facet Search & Filtering**: Filter by category, price range, brand, stock availability, and ratings.
- **Persistent Cart & Wishlist**: Zustand stores with local storage persistence, subtotal updates, and badge count indicators.

### 2. Multi-Step Checkout & Payments
- **Address & Shipping Selection**: Multi-step checkout form with step validation.
- **Stripe Integration**: Secure Stripe PaymentIntent creation, element rendering, and payment confirmation.
- **Distributed Concurrency Lock**: Redis Redlock locks acquired during checkout initialization to guarantee stock reservation.

### 3. Seller Vendor Portal (`/vendor`)
- **Product & Inventory Management**: Create and edit vendor product listings, custom SKU pricing, and stock levels.
- **Fulfillment Pipeline**: Track incoming orders containing vendor products, update shipping statuses, and view revenue metrics.

### 4. Super Admin Control Center (`/admin`)
- **Platform Telemetry**: Real-time GMV counters, transaction volume, active user growth graphs, and system health status.
- **Vendor & Catalog Moderation**: Review vendor registration applications and verify new catalog additions.
- **Audit Logs**: Comprehensive activity log tracking system actions across the platform.

---

## 🔄 Critical Business Workflows

### Checkout & Inventory Lifecycle
```text
1. Customer initiates checkout with cart items
   │
   ▼
2. API Gateway requests lock on InventoryService (Redis Redlock TTL: 5s)
   │
   ├── [Lock Granted] ──► Deduct temp stock & create Pending Order
   │                            │
   │                            ▼
   │                      Initialize Stripe PaymentIntent
   │                            │
   │                            ▼
   │                      Stripe Webhook Confirms Payment
   │                            │
   │                            ├── [Success] ──► Finalize Order & Emit ORDER_PAID event
   │                            └── [Failure] ──► Release Redis Lock & Revert Stock
   │
   └── [Lock Denied] ──► Return "Stock Unavailable" error to user
```

---

## 🚫 Out of Scope / Non-Goals
- Native desktop applications (web application responsive layout covers desktop).
- In-house payment processing hardware or physical point-of-sale integrations.
