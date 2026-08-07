# 🔌 API Design & Endpoint Specification

This document details the RESTful HTTP API routes exposed by the Nati Store backend.

---

## 🌐 Public & Customer Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | System health check & MongoDB ping | ❌ |
| `GET` | `/api/metrics` | Prometheus metrics exporter endpoint | ❌ |
| `GET` | `/api/products` | Search & list store products | ❌ |
| `GET` | `/api/orders` | Fetch customer's orders | ✅ (Customer) |
| `POST` | `/api/orders` | Create new customer order | ✅ (Customer) |
| `GET` | `/api/notifications` | Fetch unread notifications | ✅ |
| `POST` | `/api/payments/checkout-session` | Create Stripe checkout session | ✅ |
| `POST` | `/api/payments/webhook` | Stripe webhook signature listener | ❌ (Stripe Sig) |

---

## 🏪 Vendor Endpoints (`/api/vendor/*`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/vendor/profile` | Fetch vendor store profile | ✅ (Vendor) |
| `GET` | `/api/vendor/metrics` | Fetch vendor revenue & order stats | ✅ (Vendor) |
| `GET` | `/api/vendor/products` | Fetch vendor catalog products | ✅ (Vendor) |
| `POST` | `/api/vendor/products` | Create new vendor product listing | ✅ (Vendor) |
| `GET` | `/api/vendor/orders` | Fetch orders containing vendor items | ✅ (Vendor) |
| `PATCH` | `/api/vendor/orders/[id]` | Accept, reject, ship, or update order | ✅ (Vendor) |

---

## 🛡️ Admin Endpoints (`/api/admin/*`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/admin/stats` | Platform GMV & revenue telemetry | ✅ (Admin) |
| `GET` | `/api/admin/users` | List all marketplace users | ✅ (Admin) |
| `PATCH` | `/api/admin/users/[id]` | Block/unblock user or update role | ✅ (Admin) |
| `GET` | `/api/admin/vendors` | Review & approve pending vendors | ✅ (Admin) |
| `GET` | `/api/admin/orders` | Global order audit across all vendors | ✅ (Admin) |
