import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'order-service', timestamp: new Date() });
});

// Mount Routes
app.use('/api/v1/orders', orderRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
