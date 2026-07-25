# User Service Microservice

Production-grade User Profile & Address Management microservice built with Node.js, Express, TypeScript, MongoDB, and RabbitMQ.

## 🚀 Key Features

- **User Profiles:** Retrieves and updates user profiles, avatars, DOB, gender, and contact details.
- **Multiple Addresses:** Full CRUD for user shipping & billing addresses (`HOME`, `WORK`) with default address switching.
- **RabbitMQ Event Consumer:** Subscribes to `USER_CREATED` events to automatically initialize user profiles upon registration.
- **Admin Governance:** Allows administrators to list users, inspect profiles, block/unblock users, or delete user accounts.

## 🛠️ API Endpoints

### Customer / User Routes
- `GET /api/v1/users/profile` — Fetch current user profile & saved addresses
- `PUT /api/v1/users/profile` — Update user profile details
- `DELETE /api/v1/users/account` — Delete user account & addresses
- `POST /api/v1/users/addresses` — Add new address
- `GET /api/v1/users/addresses` — List user addresses
- `PUT /api/v1/users/addresses/:id` — Update existing address
- `DELETE /api/v1/users/addresses/:id` — Remove saved address
- `PUT /api/v1/users/addresses/:id/default` — Set primary/default address

### Admin Routes
- `GET /api/v1/users/admin/users` — List all registered user profiles
- `GET /api/v1/users/admin/users/:id` — Inspect user profile & address details
- `PUT /api/v1/users/admin/users/:id/status` — Block or activate user profile
- `DELETE /api/v1/users/admin/users/:id` — Delete user account (Admin)

## ⚙️ Environment Variables

```env
PORT=8002
MONGODB_URI=mongodb://admin:password123@localhost:27017/user_db?authSource=admin
JWT_SECRET=super-secret-jwt-key-2026
AUTH_SERVICE_URL=http://localhost:8001
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```
