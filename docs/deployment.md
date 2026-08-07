# 🚀 Enterprise Deployment & Environment Operations

This document details production deployment procedures for Vercel, Docker, MongoDB Atlas, and GitHub Actions CI/CD.

---

## 🌐 1. Deploying to Vercel (Recommended Next.js Platform)

1. Connect Repository (`https://github.com/Nati1-2/Ecommerce.git`).
2. Set Root Directory to `frontend`.
3. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
4. Deploy (`next build`).

---

## ⚡ 2. Environment Verification & Health Check

Confirm health monitoring status post-deployment:
```bash
curl -i https://yourstore.com/api/health
```

Expected Response (`HTTP 200 OK`):
```json
{
  "status": "healthy",
  "environment": "production",
  "mongodb": "connected",
  "timestamp": "2026-08-07T11:48:00.000Z",
  "uptimeSeconds": 3600,
  "service": "nati-store-ecommerce-api"
}
```
