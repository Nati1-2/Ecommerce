import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, NotFoundError } from '@ecom/common';
import { notificationRoutes } from './routes/notification.routes';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// 404 handler for unmatched routes
app.all('*', (req, _res) => {
  throw new NotFoundError(`Route ${req.method} ${req.originalUrl}`);
});

// Global error handler
app.use(errorHandler);

export { app };
