# Auth Service Microservice

Production-grade Authentication and Identity Management service built with Node.js, Express, TypeScript, MongoDB, and RabbitMQ.

## 🚀 Key Features

- **Registration & Login:** Secure authentication with Argon2/bcrypt password hashing.
- **JWT & Refresh Tokens:** RS256 access tokens (15m expiration) & secure refresh token rotation (7d expiration).
- **RBAC Middleware:** Role-Based Access Control (`CUSTOMER`, `VENDOR`, `ADMIN`).
- **Email Verification & Reset:** Email verification & password reset via Nodemailer/SMTP.
- **RabbitMQ Integration:** Publishes `USER_CREATED` topic events upon user registration.

## 🛠️ API Endpoints

- `POST /api/v1/auth/register` — Create new user account
- `POST /api/v1/auth/login` — Authenticate & retrieve tokens
- `POST /api/v1/auth/logout` — Revoke refresh token
- `POST /api/v1/auth/refresh-token` — Issue new access token
- `POST /api/v1/auth/verify-email` — Confirm email verification token
- `POST /api/v1/auth/forgot-password` — Send password reset email
- `POST /api/v1/auth/reset-password` — Update user password

## ⚙️ Environment Variables

```env
PORT=8001
MONGODB_URI=mongodb://admin:password123@localhost:27017/auth_db?authSource=admin
JWT_SECRET=super-secret-jwt-key-2026
JWT_REFRESH_SECRET=super-secret-refresh-key-2026
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=ethereal.user@ethereal.email
SMTP_PASSWORD=ethereal_password
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```
