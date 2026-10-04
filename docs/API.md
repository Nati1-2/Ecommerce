# 🔌 API Specification & Gateway Integration — Nati Platform

This document details the RESTful API standards, endpoints, payload formats, error responses, and Stripe webhook idempotency controls for the **Nati.** E-Commerce Platform.

---

## 🌐 Ingress & API Gateway Conventions

All API calls originate from the client and target the centralized API Gateway at `http://localhost:8000/api` (or Vercel Edge Serverless Routes at `/api/*`).

### Gateway Route Mapping Table

| Domain / Route | Target Service | Authentication & RBAC | Description |
| :--- | :--- | :--- | :--- |
| `POST /api/auth/register` | `auth-service` | Public | Account creation (Customer or Seller) |
| `POST /api/auth/login` | `auth-service` | Public | Authenticate and issue JWT tokens |
| `GET /api/users/profile` | `user-service` | `requireAuth` | Retrieve authenticated profile |
| `GET /api/products` | `product-service` | Public | Query catalog with search & filters |
| `GET /api/products/:id` | `product-service` | Public | Retrieve single product & variant matrix |
| `GET /api/cart` | `cart-service` | `requireAuth` | Fetch current user cart items |
| `POST /api/orders` | `order-service` | `requireAuth` | Place order & acquire inventory locks |
| `POST /api/payments/checkout` | `payment-service` | `requireAuth` | Initialize Stripe PaymentIntent |
| `POST /api/payments/webhook` | `payment-service` | Stripe Signature | Signature-verified webhook listener |
| `GET /api/vendor/products` | `vendor-service` | `requireVendor` | Vendor catalog management |
| `GET /api/admin/stats` | `analytics-service` | `requireAdmin` | Platform GMV & health telemetry |

---

## 📦 Request & Response Data Envelopes

All API endpoints must conform to standard JSON response structures:

### 1. Success Response Envelope
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-MSJ6GKMK",
    "grandTotal": 149.99,
    "status": "PENDING"
  },
  "message": "Order created successfully"
}
```

### 2. Error Response Envelope
```json
{
  "success": false,
  "error": {
    "message": "Insufficient stock available for product PROD-102",
    "code": "INSUFFICIENT_STOCK",
    "details": [
      {
        "field": "stock",
        "issue": "Requested quantity 5 exceeds available stock 2"
      }
    ]
  }
}
```

---

## 🚥 Standard HTTP Status Codes

| Code | Status | Usage Scenario |
| :--- | :--- | :--- |
| `200` | OK | Successful GET, PATCH, or PUT request. |
| `201` | Created | Successful POST creation (User, Product, Order). |
| `400` | Bad Request | Input validation failure or missing required fields. |
| `401` | Unauthorized | Missing, expired, or invalid JWT token. |
| `403` | Forbidden | Insufficient RBAC role permissions (e.g. non-admin accessing `/admin`). |
| `404` | Not Found | Requested resource ID does not exist in database. |
| `409` | Conflict | Duplicate unique key (e.g. email, SKU) or inventory lock failure. |
| `429` | Too Many Requests | Rate limit exceeded. |
| `500` | Internal Server Error | Unhandled server exception. |

---

## 💳 Stripe Webhook Idempotency Protocol

To prevent duplicate fulfillment or double notifications caused by Stripe webhook retries:
1. `payment-service` extracts the `stripeEventId` (e.g. `evt_3M0123...`) from the incoming webhook payload.
2. The service checks the `PaymentEvent` collection in MongoDB.
3. If `stripeEventId` already exists, the event is immediately acknowledged (`HTTP 200 OK`) and ignored.
4. If new, the transaction is processed and `stripeEventId` is stored in MongoDB atomically.
