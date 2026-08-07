# 🔐 Authentication & Authorization Flow

This document details the security architecture, JWT token issuing, password hashing, and Role-Based Access Control (RBAC).

---

## 🔑 Authentication Architecture

1. **Password Hashing**:
   - Passwords are encrypted using `bcrypt` (10 rounds) prior to persistence in the MongoDB `User` collection.

2. **JSON Web Token (JWT) Issuance**:
   - Upon successful credential verification, a signed JWT token is returned containing:
     ```json
     {
       "id": "usr-demo-customer",
       "email": "customer@natistore.com",
       "role": "CUSTOMER",
       "iat": 1754568000,
       "exp": 1754654400
     }
     ```

3. **RBAC Guard Enforcement**:
   - `getUserFromToken(req)` parses the `Authorization: Bearer <token>` header or `token` cookie.
   - `requireVendor(req)` verifies `role === "VENDOR"` or returns `HTTP 403 Forbidden`.
   - `requireAdmin(req)` verifies `role === "ADMIN"` or returns `HTTP 403 Forbidden`.
