import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_key_change_in_production';

// ── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Bypass express.json() parsing for Stripe webhook routes to preserve raw signature buffer
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhook')) {
    return next();
  }
  express.json()(req, res, next);
});

// ── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: { success: false, errors: [{ message: 'Too many requests, please try again later.' }] }
});
app.use(limiter);

// ── Authentication Middleware ──────────────────────────────────────────────
const extractUserContext = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; userId?: string; email: string; role: string };
      const userId = decoded.id || decoded.userId;
      if (userId) {
        req.headers['x-user-id'] = userId;
      }
      if (decoded.email) {
        req.headers['x-user-email'] = decoded.email;
      }
      if (decoded.role) {
        req.headers['x-user-role'] = decoded.role;
      }
    } catch (err) {
      // Invalid token, context will not be injected
    }
  }
  next();
};

app.use(extractUserContext);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'API Gateway', timestamp: new Date().toISOString() });
});

// ── Service Reverse Proxy Routing ──────────────────────────────────────────
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8003';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8011'; // Offset to avoid conflict
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:8005';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8006';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8007';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8008';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8009';
const VENDOR_SERVICE_URL = process.env.VENDOR_SERVICE_URL || 'http://localhost:8004';

const proxyOptions = {
  proxyReqPathResolver: (req: express.Request) => req.originalUrl,
  proxyReqBodyDecorator: (bodyContent: any, srcReq: express.Request) => {
    if (srcReq.body && Object.keys(srcReq.body).length > 0 && !srcReq.originalUrl.includes('/webhook')) {
      return JSON.stringify(srcReq.body);
    }
    return bodyContent;
  }
};

app.use('/api/v1/auth', proxy(AUTH_SERVICE_URL, proxyOptions));
app.use('/api/v1/users', proxy(USER_SERVICE_URL, proxyOptions));
app.use('/api/v1/products', proxy(PRODUCT_SERVICE_URL, proxyOptions));
app.use('/api/v1/inventory', proxy(INVENTORY_SERVICE_URL, proxyOptions));
app.use('/api/v1/cart', proxy(CART_SERVICE_URL, proxyOptions));
app.use('/api/v1/orders', proxy(ORDER_SERVICE_URL, proxyOptions));
app.use('/api/v1/payments', proxy(PAYMENT_SERVICE_URL, proxyOptions));
app.use('/api/v1/notifications', proxy(NOTIFICATION_SERVICE_URL, proxyOptions));
app.use('/api/v1/analytics', proxy(ANALYTICS_SERVICE_URL, proxyOptions));
app.use('/api/v1/vendors', proxy(VENDOR_SERVICE_URL, proxyOptions));
app.use('/api/v1/admin/vendors', proxy(VENDOR_SERVICE_URL, proxyOptions));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
