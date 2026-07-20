import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@ecom/common';
import { paymentRouter } from './routes/payment.routes';

const app = express();

// ============================================
// Global Middleware
// ============================================
app.use(helmet());
app.use(cors());

// ============================================
// Stripe webhook needs raw body for signature verification.
// We mount the raw body parser specifically for the webhook route
// BEFORE the global JSON parser.
// ============================================
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' })
);

// JSON body parser for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'payment-service',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Routes
// ============================================
app.use('/api/payments', paymentRouter);

// ============================================
// Error Handler (must be last)
// ============================================
app.use(errorHandler);

export { app };
