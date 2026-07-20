import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@ecom/common';
import { orderRouter } from './routes/order.routes';

const app = express();

// ============================================
// Global Middleware
// ============================================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'order-service',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Routes
// ============================================
app.use('/api/orders', orderRouter);

// ============================================
// Error Handler (must be last)
// ============================================
app.use(errorHandler);

export { app };
