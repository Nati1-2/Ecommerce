# Production CI/CD Pipeline & Deployment Guide

This document outlines the complete automated Continuous Integration and Continuous Deployment (CI/CD) workflow for the Multi-Vendor E-Commerce Platform.

---

## 1. 🔄 Automated Pipeline Workflow

```text
 Developer Commit & Push
            │
            ▼
   GitHub Repository Trigger
   (Push to main / Pull Request)
            │
  ┌─────────┴────────────────────────┐
  ▼                                  ▼
[Frontend Pipeline]         [Backend Pipeline]
  │                                  │
  ├─ Install dependencies            ├─ Install dependencies
  ├─ TypeScript validation           ├─ Build shared library (@ecom/shared)
  ├─ Security audit (npm audit)      ├─ TypeScript compilation checks
  ├─ Next.js Production Build        ├─ Security audit (npm audit)
  └─ Deploy to Vercel (--prod)       ├─ Execute Jest Unit Test suite
                                     ├─ Build Multi-Stage Docker Images
                                     ├─ Push Images to GHCR (ghcr.io)
                                     └─ Deploy Hook / Production Server Sync
```

---

## 2. 🔐 Environment Secrets Configuration

To run the CI/CD pipeline, set the following secrets in **GitHub Repository Settings -> Secrets and variables -> Actions**:

### Frontend (Vercel) Secrets:
- `VERCEL_TOKEN`: Vercel Personal Access Token
- `VERCEL_ORG_ID`: Vercel Organization ID
- `VERCEL_PROJECT_ID`: Vercel Project ID

### Backend Secrets:
- `GITHUB_TOKEN`: Provided automatically by GitHub Actions to authenticate pushes to GitHub Container Registry (`ghcr.io`).
- `JWT_SECRET`: Production secret key for RS256 token verification.
- `MONGO_ROOT_USER`: Database administrator username.
- `MONGO_ROOT_PASSWORD`: Database administrator password.

---

## 3. 🐳 Production Multi-Stage Docker Setup

Each microservice utilizes lightweight **Node.js 20 Alpine** multi-stage builds (`builder` -> `runner`) to reduce image size (< 150MB per service) and optimize RAM footprint:

### Local Production Test Command:
To build and start all production services with memory limits applied:

```bash
cd backend/docker
docker-compose -f docker-compose.prod.yml up --build -d
```

### Health Check Verification:
All services include automated container health checks:

```bash
# Check container status & health
docker ps

# Inspect API Gateway health endpoint
curl http://localhost:8000/health

# Inspect Auth Service health endpoint
curl http://localhost:8001/health

# Inspect User Service health endpoint
curl http://localhost:8002/health

# Inspect Product Service health endpoint
curl http://localhost:8003/health
```

---

## 4. 🛡️ Deployment Safety & Rollback Strategy

1. **Test Gatekeeping:** Deployments halt automatically if unit tests or build commands fail.
2. **Atomic Image Tagging:** Docker images are tagged with the specific git SHA (`ghcr.io/...:sha-abc1234`).
3. **Rollback Procedure:** To rollback to a previous version, run:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker pull ghcr.io/<repo>-api-gateway:<previous-sha>
   docker-compose -f docker-compose.prod.yml up -d
   ```
