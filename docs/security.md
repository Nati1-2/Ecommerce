# 🛡️ Enterprise Security Architecture & Data Safeguards — Nati Platform

This document outlines the security controls, authentication mechanisms, token lifecycles, RBAC enforcement, and vulnerability prevention rules for the **Nati.** E-Commerce Platform.

---

## 🔒 Statutory Security Principles

Every AI coding agent and human developer MUST strictly observe these 6 core security imperatives:

1. **Never Commit Secrets**: Secrets (JWT keys, Stripe secret keys, MongoDB URIs) MUST reside exclusively in `.env` files and environment settings. Never commit secrets to git repositories.
2. **Defensive Server Authorization**: NEVER rely on client-side state or route guards for security. Every API endpoint MUST independently verify JWT tokens and RBAC permissions on the backend.
3. **Validate All Inputs**: Sanitize and validate every incoming payload using Zod schemas before passing parameters to business logic or database queries.
4. **Idempotent Webhooks**: Verify digital signatures on external callbacks (e.g. Stripe webhooks) using `stripe.webhooks.constructEvent` and enforce deduplication via `PaymentEvent` tracking.
5. **No Sensitive Data Logging**: Never log passwords, raw credit card details, JWT tokens, or personally identifiable information (PII) in console logs or monitoring systems.
6. **Least Privilege Principles**: Microservices and database connection strings must operate with the minimum permissions required for their domain.

---

## 🔑 Authentication & Token Lifecycle

The system implements stateless JWT authentication with token rotation:

```text
┌───────────────────────────┐          ┌───────────────────────────┐
│     Access Token          │          │     Refresh Token         │
├───────────────────────────┤          ├───────────────────────────┤
│ - Expiration: 15 minutes  │          │ - Expiration: 7 days      │
│ - Storage: In-Memory /    │          │ - Storage: HttpOnly,      │
│   Authorization Header    │          │   Secure Cookie           │
└───────────────────────────┘          └───────────────────────────┘
```

### Token Rotation Workflow
1. Upon successful login (`POST /api/auth/login`), `auth-service` issues a short-lived **Access Token** (15-min TTL) and a long-lived **Refresh Token** (7-day TTL).
2. When the Access Token expires, the client sends the Refresh Token to `POST /api/auth/refresh`.
3. If valid, a new Access Token is issued and the Refresh Token is rotated. Revoked tokens are tracked in Redis (`session:{token}`) and immediately rejected.

---

## 🛡️ Role-Based Access Control (RBAC) Guard Matrix

Endpoints are protected by statutory middleware from `@ecom/shared`:

| Middleware | Target Roles | Access Scope |
| :--- | :--- | :--- |
| `currentUser` | All Users | Attaches decoded JWT identity (`req.currentUser`) if present. |
| `requireAuth` | Logged-in Users | Rejects unauthenticated requests with `401 Unauthorized`. |
| `requireVendor` | `VENDOR`, `ADMIN` | Restricts access to seller portal features (`/api/vendor/*`). |
| `requireAdmin` | `ADMIN` Only | Restricts access to Super Admin telemetry & control (`/api/admin/*`). |

---

## 🌐 Web Ingress Security Controls

- **Security Headers (`helmet`)**: Configures `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, and Content Security Policies (CSP).
- **CORS Protection**: CORS middleware restricts API requests to whitelisted origins (`process.env.ALLOWED_ORIGINS` or `http://localhost:3000`).
- **Rate Limiting**: `express-rate-limit` prevents brute-force credential stuffing on `/api/auth/login` (max 10 requests per 15-min window per IP).
- **Password Hashing**: Passwords hashed using `bcryptjs` with salt round factor 10.
