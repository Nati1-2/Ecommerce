# @ecom/vendor-service

The **Vendor Service** is a production-grade microservice responsible for marketplace seller onboarding, store profile management, admin approval workflows, commission calculation, and vendor dashboard data compilation.

---

## 🚀 Key Features

- **Onboarding & Verification:** Standard registration system for users to apply to become sellers.
- **Storefront Setup:** Automatic SEO-friendly slug generation for vendor stores.
- **Commission System:** Calculates custom/default platform commissions and logs vendor earnings.
- **Admin Management:** Approval/rejection workflows, blocking, and suspension of vendors.
- **Dashboard Preparation:** High-speed data aggregation (sales count, total revenue, average reviews, net earnings).
- **Event-Driven Integration:** Publishes vendor events (`vendor.created`, `vendor.approved`) and consumes order/payment completion events to calculate commissions automatically.

---

## 📁 Service Structure

```text
src/
├── server.ts                 # Service entry point (Mongoose + RabbitMQ startup)
├── app.ts                    # Express application mounting config & middlewares
├── config/
│   ├── database.ts           # MongoDB connection utility
│   └── env.ts                # Environment configuration parsing
├── controllers/
│   ├── vendor.controller.ts  # Vendor onboarding & dashboard requests
│   └── store.controller.ts   # Store creation & details requests
├── services/
│   ├── vendor.service.ts     # Business logic, aggregations & commission math
│   └── store.service.ts      # Store profiles, slug generation & database sync
├── models/
│   ├── Vendor.ts             # Mongoose Vendor definition
│   ├── Store.ts              # Mongoose Store definition
│   └── Commission.ts         # Mongoose Commission transaction logs
├── routes/
│   ├── vendor.routes.ts      # Router for profiles, dashboard & admin actions
│   └── store.routes.ts       # Router for stores (vendor operations & public check)
├── middleware/
│   ├── auth.middleware.ts    # Authentication parsing (Gateway + direct JWT support)
│   ├── role.middleware.ts    # Role validation (CUSTOMER, VENDOR, ADMIN)
│   └── error.middleware.ts   # Unified Zod and Mongoose error handling
├── validators/
│   └── vendor.validator.ts   # Zod request validators
├── events/
│   ├── vendor.publisher.ts   # RabbitMQ Event publishers
│   └── vendor.consumer.ts    # RabbitMQ Event consumers (Order/Payment completion listener)
└── utils/
    └── logger.ts             # Structured winston logger configuration
```

---

## 🌐 API Reference

All requests run through the API Gateway (default: `http://localhost:8000/api/v1/`).

### Vendor Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/vendors/register` | Register a new vendor profile | Customer |
| **GET** | `/vendors/profile` | Get current vendor profile | Vendor / Admin |
| **PUT** | `/vendors/profile` | Update current vendor profile | Vendor / Admin |
| **GET** | `/vendors/dashboard` | Get vendor dashboard analytics | Vendor / Admin |
| **GET** | `/vendors/:id` | Get vendor profile by ID (Internal/Public check) | None |

### Store Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/vendors/store` | Create a new vendor store | Vendor / Admin |
| **GET** | `/vendors/store` | Get own store details | Vendor / Admin |
| **PUT** | `/vendors/store` | Update store details | Vendor / Admin |
| **GET** | `/vendors/store/slug/:slug` | Get store details by slug (Public) | None |

### Admin Moderation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/vendors` | List all registered vendors | Admin |
| **GET** | `/admin/vendors/pending` | List all pending approvals | Admin |
| **PATCH** | `/admin/vendors/:id/approve` | Approve vendor application | Admin |
| **PATCH** | `/admin/vendors/:id/reject` | Reject vendor application | Admin |
| **PATCH** | `/admin/vendors/:id/status` | Suspend or Block a vendor | Admin |

---

## 🛠️ Environment Variables

Create a `.env` file inside this directory or load via parent monorepo:
```env
PORT=8004
MONGODB_URI=mongodb://127.0.0.1:27017/vendor_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=your_jwt_secret_key_here
```

---

## 🚀 Setup & Execution

### 1. Install dependencies:
From the service folder:
```bash
npm install
```

Or from the monorepo root:
```bash
npm install
```

### 2. Run in Development Mode:
From the monorepo root:
```bash
npm run dev:vendor
```

From this directory:
```bash
npm run dev
```

### 3. Build & Start in Production:
```bash
npm run build
npm start
```

### 4. Run Tests:
```bash
npm run test
```
