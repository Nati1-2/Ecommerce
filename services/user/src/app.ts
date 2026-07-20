import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, NotFoundError } from '@ecom/common';
import { userRoutes } from './routes/user.routes';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler for unmatched routes
app.all('*', () => {
  throw new NotFoundError('Route');
});

// Global error handler
app.use(errorHandler);

export { app };
