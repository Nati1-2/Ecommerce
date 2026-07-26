import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { vendorRoutes, adminVendorRoutes } from './routes/vendor.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'Vendor Service', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/vendors', vendorRoutes);
app.use('/api/v1/vendors', vendorRoutes);

app.use('/admin/vendors', adminVendorRoutes);
app.use('/api/v1/admin/vendors', adminVendorRoutes);

// ── Error Middleware ──
app.use(errorMiddleware);

export { app };
