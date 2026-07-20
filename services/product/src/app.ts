import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, NotFoundError } from '@ecom/common';
import { productRoutes } from './routes/product.routes';
import { categoryRoutes } from './routes/category.routes';
import { reviewRoutes } from './routes/review.routes';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/products/categories', categoryRoutes);
app.use('/api/products', reviewRoutes);

// 404 handler for unmatched routes
app.all('*', () => {
  throw new NotFoundError('Route');
});

// Global error handler
app.use(errorHandler);

export { app };
