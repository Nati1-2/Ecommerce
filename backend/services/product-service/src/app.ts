import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { productRoutes } from './routes/product.routes.js';
import { categoryRoutes } from './routes/category.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'Product Service', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/categories', categoryRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.use('/products', productRoutes);
app.use('/api/v1/products', productRoutes);

// ── Error Middleware ──
app.use(errorMiddleware);

export { app };
