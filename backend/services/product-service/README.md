# Product Service Microservice

Production-grade Product Catalog, Category & Variant management service built with Node.js, Express, TypeScript, MongoDB, and RabbitMQ.

## 🚀 Key Features

- **Product Catalog:** Paginated listing, full-text search, price filtering, and sorting (`price_asc`, `price_desc`, `rating`).
- **Vendor Workflow:** Allows vendors to submit products, update details, or toggle product status (`DRAFT`, `PENDING_APPROVAL`, `ACTIVE`, `REJECTED`, `OUT_OF_STOCK`).
- **Admin Approval System:** Admin endpoints to review pending product submissions, approve, or reject listings.
- **Category Hierarchy:** Parent-child category relationship management.
- **RabbitMQ Integration:** Publishes `PRODUCT_CREATED`, `PRODUCT_UPDATED`, and `PRODUCT_DELETED` events to the `ecommerce_events` exchange for downstream Search (Meilisearch) and Recommendation services.

## 🛠️ API Endpoints

### Public Catalog Endpoints
- `GET /api/v1/products` — Browse products with pagination, sorting & filters
- `GET /api/v1/products/:id` — Get product detail by ID
- `GET /api/v1/categories` — Get category tree
- `GET /api/v1/categories/:id/products` — Get products by category

### Vendor Endpoints (`VENDOR` / `ADMIN` Role)
- `POST /api/v1/products` — Create new product listing (submits for approval)
- `PUT /api/v1/products/:id` — Update existing product
- `DELETE /api/v1/products/:id` — Remove product
- `PATCH /api/v1/products/:id/status` — Update status (`DRAFT`, `OUT_OF_STOCK`, etc.)

### Admin Approval Endpoints (`ADMIN` Role Only)
- `GET /api/v1/products/admin/pending` — List products pending review
- `PATCH /api/v1/products/admin/:id/approve` — Approve product (sets status to `ACTIVE`)
- `PATCH /api/v1/products/admin/:id/reject` — Reject product submission

## ⚙️ Environment Variables

```env
PORT=8003
MONGODB_URI=mongodb://127.0.0.1:27017/product_db
JWT_SECRET=super-secret-jwt-key-2026
RABBITMQ_URL=amqp://guest:guest@localhost:5672
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```
