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

// Whitelist CORS origins to prevent unauthorized cross-origin requests
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, internal jobs) or whitelisted origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Prevent external spoofing: strip internal user identity headers on incoming ingress
app.use((req, _res, next) => {
  delete req.headers['x-user-id'];
  delete req.headers['x-user-email'];
  delete req.headers['x-user-role'];
  next();
});

// Bypass express.json() parsing for Stripe webhook routes to preserve raw signature buffer
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhook')) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

// ── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, errors: [{ message: 'Too many requests, please try again later.' }] }
});
app.use(limiter);

// Strict rate limiting on authentication routes to prevent brute-force / credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per 15-min window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, errors: [{ message: 'Too many authentication attempts, please try again after 15 minutes.' }] }
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

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
