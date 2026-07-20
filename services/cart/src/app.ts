import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, NotFoundError } from '@ecom/common';
import { cartRoutes } from './routes/cart.routes';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'cart' });
});

// Routes
app.use('/api/cart', cartRoutes);

// 404 handler for unmatched routes
app.all('*', () => {
  throw new NotFoundError('Route');
});

// Global error handler
app.use(errorHandler);

export { app };
