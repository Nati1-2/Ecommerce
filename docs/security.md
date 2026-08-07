# 🛡️ Enterprise Security Architecture & RBAC Safeguards

This document details security enforcement, authentication token rotation, input validation, and PaymentEvent idempotency.

---

## 🔒 Security Principles

1. **Authentication Token Rotation**:
   - Access tokens expire in 15 minutes (`generateAccessToken`).
   - Refresh tokens expire in 7 days (`generateRefreshToken`).
   - Revoked tokens are tracked and rejected immediately (`authTokens.revokeToken`).

2. **Idempotency Protection**:
   - Payment webhooks are tracked in the Mongoose `PaymentEvent` collection (`stripeEventId`).
   - Duplicate Stripe webhooks are safely skipped to prevent double orders or double notifications.

3. **RBAC Guard Middleware**:
   - `requireAdmin(req)` and `requireVendor(req)` prevent unauthorized privilege escalation across `/api/admin/*` and `/api/vendor/*`.
