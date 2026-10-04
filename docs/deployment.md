# 🚀 Deployment, Infrastructure & DevOps Operations — Nati Platform

This document details the production deployment procedures, Docker orchestration setup, Vercel configuration, environment variables, and health verification protocols for the **Nati.** E-Commerce Platform.

---

## 🌐 Target Infrastructure Topology

```text
┌────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                  │
│       Hosts Next.js 15 App Router Frontend Bundle      │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTPS API Calls)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Docker / Cloud Container Mesh             │
│   Hosts Express API Gateway & Microservices Instances  │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
                ▼                        ▼
┌───────────────────────────┐┌───────────────────────────┐
│     MongoDB Atlas         ││       Redis Cloud         │
│   Primary Managed DB      ││  Redlock & Session Store  │
└───────────────────────────┘└───────────────────────────┘
```

---

## ⚙️ Environment Variables Matrix

### 1. Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8009
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sample_key_here
```

### 2. Backend Microservices Environment (`.env`)
```env
PORT=8000
NODE_ENV=production
JWT_SECRET=super_secret_jwt_access_key
REFRESH_TOKEN_SECRET=super_secret_jwt_refresh_key
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecom_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RABBITMQ_URL=amqp://localhost:5672
STRIPE_SECRET_KEY=sk_test_sample_key_here
STRIPE_WEBHOOK_SECRET=whsec_sample_key_here
```

---

## 🛠️ Production Build & Container Execution Commands

### 1. Local Docker Container Deployment
```bash
# Build and spin up all microservices, MongoDB, Redis, and RabbitMQ
npm run docker:up

# Tear down containers
npm run docker:down
```

### 2. Vercel Frontend Deployment
1. Import repository to Vercel dashboard.
2. Set Root Directory to `frontend`.
3. Configure Build Command: `next build`.
4. Configure Output Directory: `.next`.
5. Attach production environment variables (`NEXT_PUBLIC_API_URL`, etc.).

---

## ⚡ Environment Verification & Health Check Protocol

After deploying changes, execute the health check endpoint to verify system readiness:

```bash
curl -i http://localhost:8000/api/health
```

Expected Response (`HTTP 200 OK`):
```json
{
  "status": "healthy",
  "environment": "production",
  "mongodb": "connected",
  "timestamp": "2026-10-03T12:00:00.000Z",
  "service": "nati-store-ecommerce-api"
}
```

---

## 🔄 CI/CD Automation Pipeline

The project utilizes GitHub Actions for continuous integration:
1. Trigger: On push or pull request to `main` or `develop`.
2. Pipeline Steps:
   - Type Checking: `npx tsc --noEmit`
   - Linting: `npm run lint`
   - Unit Tests: `npm test`
   - Build Verification: `npm run build`
